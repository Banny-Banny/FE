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

import { API_ENDPOINTS } from '@/commons/constants/endpoints';
import { MediaType, MIME_TYPE_MAP } from '@/commons/constants/media';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { useMapLocation } from '@/components/map/components/map-view/hooks/useMapLocation';
import { buildApiUrl, getFileExtension, getMimeTypes, normalizeApiBaseUrl } from '@/utils';
import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
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
export const useEggForm = ({ onClose }: UseEggFormProps) => {
  const { accessToken } = useAuth();
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
            if (__DEV__) {
              console.error('비디오 썸네일 생성 오류:', error);
            }
            // 썸네일 생성 실패해도 파일은 추가
          }
        }

        setValue('attachments', [...otherAttachments, newAttachment]);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('파일 선택 오류:', error);
      }
    }
  };

  // 첨부파일 삭제
  const handleDeleteAttachment = (id: string) => {
    setValue(
      'attachments',
      attachments.filter((file) => file.id !== id),
    );
  };

  // MIME 타입 추론 함수 (파일명의 확장자 기반)
  const getMimeTypeFromFilename = (filename: string, type: MediaType): string => {
    const extension = getFileExtension(filename);
    const mimeType = MIME_TYPE_MAP[extension];

    if (mimeType) {
      return mimeType;
    }

    // 확장자가 없거나 매핑되지 않은 경우 기본값 사용
    const defaultMimeTypes: Record<MediaType, string> = {
      IMAGE: 'image/jpeg',
      VIDEO: 'video/mp4',
      AUDIO: 'audio/mpeg',
    };
    return defaultMimeTypes[type] || 'application/octet-stream';
  };

  // 폼 제출 핸들러 (multipart/form-data 방식)
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

      // 현재 위치 확인
      if (!location) {
        Alert.alert('오류', '현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        setIsSubmitting(false);
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
        if (!attachment.uri) {
          if (__DEV__) {
            console.warn(`파일 URI가 없습니다: ${attachment.name}`);
          }
          continue;
        }

        // React Native FormData 형식: { uri, type, name }
        const fileData: any = {
          uri: attachment.uri,
          type: getMimeTypeFromFilename(attachment.name, attachment.type),
          name: attachment.name,
        };

        // 웹 환경에서는 File 객체로 변환 필요
        if (Platform.OS === 'web') {
          try {
            const response = await fetch(attachment.uri);
            const blob = await response.blob();
            const file = new File([blob], attachment.name, {
              type: getMimeTypeFromFilename(attachment.name, attachment.type),
            });
            formData.append('media_files', file);
          } catch (error) {
            if (__DEV__) {
              console.error(`파일 변환 실패: ${attachment.name}`, error);
            }
            continue;
          }
        } else {
          // 네이티브 환경에서는 FormData에 직접 추가
          formData.append('media_files', fileData as any);
        }
      }

      // axios는 FormData를 자동으로 감지하여 Content-Type을 설정하지만,
      // 명시적으로 설정해도 문제없음 (boundary는 자동으로 추가됨)
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
