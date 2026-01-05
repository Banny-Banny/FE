/**
 * components/map/components/egg-form/hooks/useEggForm.ts
 * 이스터에그 폼 관리 통합 Hook (간소화 버전)
 *
 * 생성 시각: 2025-01-XX
 * 통신 테스트를 위해 간소화된 버전
 */

import { API_ENDPOINTS } from '@/commons/constants/endpoints';
import { MediaType } from '@/commons/constants/media';
import { useMediaUpload } from '@/commons/hooks';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { buildApiUrl, getMediaUrls, getMimeTypes, normalizeApiBaseUrl } from '@/utils';
import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { useMapLocation } from '../../map-view/hooks/useMapLocation';
import {
  ApiErrorResponse,
  AttachmentFile,
  CreateCapsuleRequest,
  CreateCapsuleResponse,
  EggFormData,
} from '../types';
import { useVideoThumbnail } from './useVideoThumbnail';

interface UseEggFormProps {
  onClose: () => void;
}

/**
 * 이스터에그 폼 관리 통합 Hook
 */
export const useEggForm = ({ onClose }: UseEggFormProps) => {
  const { accessToken } = useAuth();
  const { upload: uploadMedia, isUploading: isMediaUploading } = useMediaUpload();
  const { location } = useMapLocation();
  const { generateThumbnail } = useVideoThumbnail();
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 유효성 검사
  const isFormValid =
    title.trim().length > 0 && content.trim().length > 0 && !isSubmitting && !isMediaUploading;

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
          file = {
            name: result.assets[0].fileName || `image_${Date.now()}.jpg`,
            uri: result.assets[0].uri,
          };
        }
      } else {
        const mimeTypes = getMimeTypes(type);
        const result = await DocumentPicker.getDocumentAsync({
          type: mimeTypes,
          copyToCacheDirectory: true,
        });
        if (!result.canceled && result.assets?.[0]) {
          file = {
            name: result.assets[0].name,
            uri: result.assets[0].uri,
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
          } catch (error) {
            console.error('비디오 썸네일 생성 오류:', error);
            // 썸네일 생성 실패해도 파일은 추가
          }
        }

        setValue('attachments', [...otherAttachments, newAttachment]);
      }
    } catch (error) {
      console.error('파일 선택 오류:', error);
    }
  };

  // 첨부파일 삭제
  const handleDeleteAttachment = (id: string) => {
    setValue(
      'attachments',
      attachments.filter((file) => file.id !== id),
    );
  };

  // 폼 제출 핸들러 (간소화 - 파일 업로드 없이 URI만 전송)
  const onSubmit = async (data: EggFormData) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!accessToken) {
        Alert.alert('인증 오류', '로그인이 필요합니다.');
        setIsSubmitting(false);
        return;
      }

      const rawApiBaseUrl =
        Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;

      const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

      if (!apiBaseUrl) {
        Alert.alert(
          '오류',
          'API 서버 주소가 설정되지 않았습니다.\n.env 파일에 EXPO_PUBLIC_API_BASE_URL을 설정해주세요.\n예: http://172.16.2.94:3000',
        );
        setIsSubmitting(false);
        return;
      }

      // 파일 업로드 및 미디어 ID 수집 (Promise.all로 병렬 업로드, 원본 순서 보장)
      // 모든 파일을 병렬로 업로드 시도 (각 파일은 독립적으로 처리)
      const uploadPromises = attachments.map(async (attachment, index) => {
        if (!attachment.uri) {
          return {
            index,
            name: attachment.name,
            type: attachment.type,
            success: false,
            error: '파일 URI가 없습니다.',
          };
        }

        try {
          const mediaId = await uploadMedia(attachment.uri, attachment.type, attachment.name);

          if (mediaId) {
            return {
              index,
              name: attachment.name,
              type: attachment.type,
              success: true,
              mediaId,
            };
          } else {
            return {
              index,
              name: attachment.name,
              type: attachment.type,
              success: false,
              error: '업로드 결과를 받을 수 없습니다.',
            };
          }
        } catch (uploadError) {
          const errorMessage =
            uploadError instanceof Error
              ? uploadError.message
              : '파일 업로드 중 오류가 발생했습니다.';
          return {
            index,
            name: attachment.name,
            type: attachment.type,
            success: false,
            error: errorMessage,
          };
        }
      });

      // 모든 업로드를 병렬로 실행하고 결과 수집 (Promise.all은 원본 순서를 보장함)
      const uploadResults = await Promise.all(uploadPromises);

      // 성공한 파일들만 추출 (원본 순서 유지 - Promise.all이 이미 순서를 보장하므로 정렬 불필요)
      const successfulUploads = uploadResults.filter((r) => r.success);
      const mediaIds = successfulUploads.map((r) => r.mediaId!);
      const mediaTypes = successfulUploads.map((r) => r.type);

      // 업로드 결과 요약
      const successCount = uploadResults.filter((r) => r.success).length;
      const failCount = uploadResults.filter((r) => !r.success).length;

      // 실패한 파일이 있으면 사용자에게 알림
      if (failCount > 0) {
        const failedFiles = uploadResults.filter((r) => !r.success);
        const failedFileNames = failedFiles.map((f) => f.name).join(', ');
        Alert.alert(
          '일부 파일 업로드 실패',
          `다음 파일 업로드에 실패했습니다:\n${failedFileNames}\n\n성공한 파일(${successCount}개)은 계속 진행됩니다.`,
        );
      }

      // 최소한 하나의 파일이라도 성공했거나, 파일이 없어도 제목과 내용만으로 생성 가능한 경우 계속 진행
      if (mediaIds.length === 0 && attachments.length > 0) {
        Alert.alert('업로드 실패', '모든 파일 업로드에 실패했습니다. 다시 시도해주세요.');
        setIsSubmitting(false);
        return;
      }

      // mediaIds를 media_urls로 변환 (API는 URL을 요구함)
      let mediaUrls: string[];
      try {
        mediaUrls = await getMediaUrls(mediaIds);
      } catch (urlError) {
        const errorMessage =
          urlError instanceof Error ? urlError.message : '미디어 URL 변환에 실패했습니다.';
        Alert.alert('오류', errorMessage);
        setIsSubmitting(false);
        return;
      }

      // 현재 위치 확인
      if (!location) {
        Alert.alert('오류', '현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        setIsSubmitting(false);
        return;
      }

      const requestData: CreateCapsuleRequest = {
        latitude: location.lat,
        longitude: location.lng,
        title: data.title,
        content: data.content || undefined,
        media_urls: mediaUrls,
        media_types: mediaTypes,
      };

      const response = await axios.post<CreateCapsuleResponse>(
        buildApiUrl(apiBaseUrl, API_ENDPOINTS.CAPSULE.CREATE),
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      // 성공 시 폼 초기화 및 닫기
      setValue('title', '');
      setValue('content', '');
      setValue('attachments', []);
      onClose();
    } catch (error) {
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
    } finally {
      setIsSubmitting(false);
    }
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
};
