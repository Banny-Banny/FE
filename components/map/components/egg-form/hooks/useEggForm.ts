/**
 * components/map/components/egg-form/hooks/useEggForm.ts
 * 이스터에그 폼 관리 통합 Hook
 *
 * multipart/form-data 방식으로 파일을 직접 업로드합니다.
 * - title: 캡슐 제목
 * - content: 캡슐 내용 (선택)
 * - latitude: 위도
 * - longitude: 경도
 * - media_files: 첨부 파일들 (이미지, 비디오, 오디오)
 */

import { API_ENDPOINTS, queryKeys } from '@/commons/constants';
import { MediaType } from '@/commons/constants/media';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { useMapLocation } from '@/components/map/components/map-view/hooks/useMapLocation';
import { buildApiUrl, getMimeTypes, normalizeApiBaseUrl } from '@/utils';
import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Platform } from 'react-native';
import { ApiErrorResponse, AttachmentFile, CreateCapsuleResponse, EggFormData } from '../types';
import { useVideoThumbnail } from './useVideoThumbnail';

interface UseEggFormProps {
  onClose: () => void;
}

/**
 * 이스터에그 폼 관리 통합 Hook
 */
export function useEggForm({ onClose }: UseEggFormProps) {
  const { accessToken } = useAuth();
  const { location } = useMapLocation();
  const { generateThumbnail } = useVideoThumbnail();
  const queryClient = useQueryClient();
  const { control, handleSubmit, watch, setValue } = useForm<EggFormData>({
    defaultValues: {
      title: '',
      content: '',
      attachments: [],
    },
  });

  const title = watch('title');
  const content = watch('content');
  const attachments = watch('attachments');

  // 캡슐 생성 Mutation
  const createCapsuleMutation = useMutation({
    mutationFn: async (formData: FormData): Promise<CreateCapsuleResponse> => {
      const rawApiBaseUrl =
        Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;
      const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

      if (!apiBaseUrl) {
        throw new Error(
          'API 서버 주소가 설정되지 않았습니다.\n.env 파일에 EXPO_PUBLIC_API_BASE_URL을 설정해주세요.',
        );
      }

      if (!accessToken) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await axios.post<CreateCapsuleResponse>(
        buildApiUrl(apiBaseUrl, API_ENDPOINTS.CAPSULE.CREATE),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    },
    onSuccess: () => {
      // 캡슐 생성 성공 후 관련 쿼리 무효화
      // Note: Optimistic Update는 적용하지 않음 (FormData 사용 및 응답 데이터 제한으로 인해 안전하지 않음)
      // 대신 즉시 invalidateQueries를 호출하여 최신 데이터를 가져옴
      // 1. 캡슐 목록 쿼리 무효화 (새로운 캡슐이 추가됨)
      // 모든 캡슐 목록 쿼리 무효화 (queryKey의 첫 번째 요소만 매칭)
      queryClient.invalidateQueries({
        queryKey: queryKeys.capsulesAll(),
      });
      // 2. 슬롯 정보 쿼리 무효화 (슬롯 사용량이 변경됨)
      queryClient.invalidateQueries({
        queryKey: queryKeys.eggSlotData(),
      });

      // 폼 초기화 및 닫기
      setValue('title', '');
      setValue('content', '');
      setValue('attachments', []);
      onClose();
      Alert.alert('성공', '이스터에그가 생성되었습니다.');
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data;

      switch (status) {
        case 409:
          if (errorData?.code === 'EGG_SLOTS_EXCEEDED') {
            Alert.alert('슬롯 부족', '남은 슬롯이 없습니다.');
          } else {
            Alert.alert('오류', errorData?.message || errorData?.error || '요청이 충돌했습니다.');
          }
          break;
        case 400:
          Alert.alert(
            '오류',
            errorData?.message || errorData?.error || '입력한 정보를 확인해주세요.',
          );
          break;
        case 401:
          Alert.alert('인증 오류', '로그인이 필요합니다.');
          break;
        case 404:
          Alert.alert('오류', '요청한 상품을 찾을 수 없습니다.');
          break;
        default:
          Alert.alert(
            '오류',
            errorData?.message || errorData?.error || '서버 오류가 발생했습니다.',
          );
          break;
      }
    },
  });

  const isSubmitting = createCapsuleMutation.isPending;

  // 폼 유효성 검사
  const isFormValid = title.trim().length > 0 && content.trim().length > 0 && !isSubmitting;

  // 파일 선택 핸들러 (간소화)
  const handleAddAttachment = async (type: MediaType) => {
    try {
      let file: { name: string; uri: string } | null = null;

      if (type === 'IMAGE') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 1,
        });
        if (!result.canceled && result.assets?.[0]) {
          const asset = result.assets[0];
          let imageUri = asset.uri;

          // iOS 시뮬레이터의 기본 사진은 HEIC 형식일 가능성이 높음
          const needsConversion =
            isHeicFormat(imageUri) ||
            !imageUri.includes('.') ||
            imageUri.startsWith('ph://') ||
            imageUri.startsWith('assets-library://') ||
            (asset.fileName &&
              (asset.fileName.toLowerCase().endsWith('.heic') ||
                asset.fileName.toLowerCase().endsWith('.heif')));

          if (needsConversion) {
            try {
              imageUri = await convertHeicToJpeg(imageUri);
            } catch {
              // 변환 실패해도 계속 진행
            }
          }

          // 파일명 추출 및 확장자 보정
          let fileName = asset.fileName || getFileName(imageUri, `photo_${Date.now()}.jpg`);
          if (needsConversion) {
            fileName = fileName.replace(/\.[^.]+$/, '') || `photo_${Date.now()}`;
            fileName = `${fileName}.jpg`;
          } else if (!fileName.includes('.')) {
            fileName = `${fileName}.jpg`;
          } else {
            const extension = fileName.split('.').pop()?.toLowerCase() || '';
            if (extension && !['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
              fileName = fileName.replace(/\.[^.]+$/, '.jpg');
            }
          }

          file = {
            name: fileName,
            uri: imageUri, // 변환된 URI 사용
          };
        }
      } else {
        const mimeTypes = getMimeTypes(type);
        const result = await DocumentPicker.getDocumentAsync({
          type: mimeTypes,
          copyToCacheDirectory: true,
        });
        if (!result.canceled && result.assets?.[0]) {
          const asset = result.assets[0];
          // URI에서 파일명 추출하여 기본값과 비교
          const defaultFileName =
            type === 'VIDEO' ? `video_${Date.now()}.mp4` : `music_${Date.now()}.mp3`;
          const fileName = getFileName(asset.uri, defaultFileName);
          file = {
            name: asset.name || fileName,
            uri: asset.uri,
          };
        }
      }

      if (file) {
        const otherAttachments = attachments.filter((att) => att.type !== type);
        const newAttachment: AttachmentFile = {
          id: Date.now().toString(),
          type,
          name: file.name,
          uri: file.uri,
        };

        // 비디오 파일인 경우 썸네일 생성
        if (type === 'VIDEO') {
          try {
            const thumbnailUri = await generateThumbnail(file.uri);
            if (thumbnailUri) {
              newAttachment.thumbnailUri = thumbnailUri;
            }
          } catch {
            // 썸네일 생성 실패해도 파일은 추가
          }
        }

        setValue('attachments', [...otherAttachments, newAttachment]);
      }
    } catch {
      // 파일 선택 오류는 무시
    }
  };

  // 첨부파일 삭제
  const handleDeleteAttachment = (id: string) => {
    setValue(
      'attachments',
      attachments.filter((file) => file.id !== id),
    );
  };

  // 이미지 URI가 HEIC/HEIF 형식인지 확인
  const isHeicFormat = (uri: string): boolean => {
    // URI에서 확장자 추출
    const extension = uri.split('.').pop()?.toLowerCase() || '';
    // HEIC/HEIF 확장자 확인
    if (extension === 'heic' || extension === 'heif') {
      return true;
    }
    // iOS 시뮬레이터의 특수 URI 형식도 HEIC일 가능성이 높음
    if (uri.startsWith('ph://') || uri.startsWith('assets-library://')) {
      return true;
    }
    return false;
  };

  // HEIC를 JPEG로 변환 (iOS 시뮬레이터 기본 사진 처리)
  const convertHeicToJpeg = async (uri: string): Promise<string> => {
    // 웹 환경에서는 변환 불가 (원본 반환)
    if (Platform.OS === 'web') {
      return uri;
    }

    try {
      // expo-image-manipulator를 사용하여 HEIC를 JPEG로 변환
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [], // 변환만 수행 (리사이즈 없음)
        {
          compress: 0.9, // 높은 품질 유지
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );
      return result.uri;
    } catch {
      // 변환 실패 시 원본 반환
      return uri;
    }
  };

  // URI에서 파일명 추출 (타임캡슐 제출 로직과 동일)
  const getFileName = (uri: string, defaultName: string): string => {
    const fileName = uri.split('/').pop() || defaultName;
    // 파일명에 확장자가 없으면 기본 확장자 추가
    if (!fileName.includes('.')) {
      return defaultName;
    }
    return fileName;
  };

  // URI에서 파일 확장자를 추출하여 MIME 타입 반환 (타임캡슐 제출 로직과 동일)
  const getMimeType = (uri: string, mediaType: MediaType): string => {
    const extension = uri.split('.').pop()?.toLowerCase() || '';

    if (mediaType === 'IMAGE') {
      if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
      if (extension === 'png') return 'image/png';
      if (extension === 'gif') return 'image/gif';
      return 'image/jpeg'; // 기본값
    }

    if (mediaType === 'AUDIO') {
      if (extension === 'mp3') return 'audio/mpeg';
      if (extension === 'm4a') return 'audio/mp4';
      if (extension === 'wav') return 'audio/wav';
      return 'audio/mpeg'; // 기본값
    }

    if (mediaType === 'VIDEO') {
      if (extension === 'mp4') return 'video/mp4';
      if (extension === 'mov') return 'video/quicktime';
      if (extension === 'avi') return 'video/x-msvideo';
      return 'video/mp4'; // 기본값
    }

    return 'application/octet-stream';
  };

  // 폼 제출 핸들러 (multipart/form-data 방식)
  const onSubmit = async (data: EggFormData) => {
    if (isSubmitting) {
      return;
    }

    // 현재 위치 확인
    if (!location) {
      Alert.alert('오류', '현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
      return;
    }

    // FormData 생성
    const formData = new FormData();

    // 기본 필드 추가
    formData.append('title', data.title);
    if (data.content) {
      formData.append('content', data.content);
    }
    formData.append('latitude', location.lat.toString());
    formData.append('longitude', location.lng.toString());

    // 파일 추가
    for (const attachment of attachments) {
      if (!attachment.uri) continue;

      let fileUri = attachment.uri;

      // HEIC 파일이면 JPEG로 변환
      if (attachment.type === 'IMAGE' && isHeicFormat(fileUri)) {
        fileUri = await convertHeicToJpeg(fileUri);
      }

      // 파일명 및 MIME 타입 추출
      const defaultFileName =
        attachment.type === 'IMAGE'
          ? `photo_${Date.now()}.jpg`
          : attachment.type === 'VIDEO'
          ? `video_${Date.now()}.mp4`
          : `music_${Date.now()}.mp3`;
      const fileName = getFileName(fileUri, defaultFileName);
      const mimeType = getMimeType(fileUri, attachment.type);

      // FormData에 추가
      if (Platform.OS === 'web') {
        try {
          const response = await fetch(fileUri);
          const blob = await response.blob();
          const file = new File([blob], fileName, { type: mimeType });
          formData.append('media_files', file);
        } catch {
          continue;
        }
      } else {
        formData.append('media_files', {
          uri: fileUri,
          type: mimeType,
          name: fileName,
        } as any);
      }
    }

    // Mutation 실행
    createCapsuleMutation.mutate(formData);
  };

  /**
   * 오디오 파일 직접 추가 (모달에서 사용)
   */
  const handleAddAudioFile = (uri: string, name: string) => {
    const otherAttachments = attachments.filter((att) => att.type !== 'AUDIO');
    const newAttachment: AttachmentFile = {
      id: Date.now().toString(),
      type: 'AUDIO',
      name,
      uri,
    };
    setValue('attachments', [...otherAttachments, newAttachment]);
  };

  // 각 타입별 첨부파일 확인
  const photoAttachment = attachments.find((att) => att.type === 'IMAGE');
  const musicAttachment = attachments.find((att) => att.type === 'AUDIO');
  const videoAttachment = attachments.find((att) => att.type === 'VIDEO');

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    isFormValid,
    isSubmitting,
    handleDeleteAttachment,
    handleAddAttachment,
    handleAddAudioFile,
    photoAttachment,
    musicAttachment,
    videoAttachment,
  };
}
