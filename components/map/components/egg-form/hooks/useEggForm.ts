/**
 * components/map/components/egg-form/hooks/useEggForm.ts
 * 이스터에그 폼 관리 통합 Hook (간소화 버전)
 *
 * 생성 시각: 2025-01-XX
 * 통신 테스트를 위해 간소화된 버전
 */

import { API_ENDPOINTS } from '@/commons/constants/endpoints';
import { useMediaUpload } from '@/commons/hooks';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { buildApiUrl, getMediaUrls, normalizeApiBaseUrl } from '@/utils';
import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import {
  ApiErrorResponse,
  AttachmentFile,
  CreateCapsuleRequest,
  CreateCapsuleResponse,
  EggFormData,
} from '../types';

interface UseEggFormProps {
  onClose: () => void;
}

/**
 * 이스터에그 폼 관리 통합 Hook
 */
export const useEggForm = ({ onClose }: UseEggFormProps) => {
  const { accessToken } = useAuth();
  const { upload: uploadMedia, isUploading: isMediaUploading } = useMediaUpload();
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
  const handleAddAttachment = async (type: 'IMAGE' | 'VIDEO' | 'MUSIC') => {
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
        const mimeTypes = type === 'MUSIC' ? ['audio/*'] : ['video/*'];
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
        setValue('attachments', [...otherAttachments, newAttachment]);
      }
    } catch (error) {
      console.log('파일 선택 오류:', error);
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
    console.log('🚀 onSubmit 호출됨!');
    console.log('📝 폼 데이터:', {
      title: data.title,
      content: data.content,
      attachments_count: data.attachments.length,
    });

    if (isSubmitting) {
      console.warn('⚠️ 이미 제출 중입니다.');
      return;
    }

    console.log('✅ 제출 시작...');
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
        console.error('API Base URL이 설정되지 않았습니다:', rawApiBaseUrl);
        setIsSubmitting(false);
        return;
      }

      // 파일 업로드 및 미디어 ID 수집 (Promise.all로 병렬 업로드, 원본 순서 보장)
      console.log('📤 파일 업로드 시작, 첨부파일 개수:', attachments.length);

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

        console.log(`📤 파일 업로드 중: ${attachment.name} (${attachment.type})`);
        console.log(`📤 파일 URI: ${attachment.uri.substring(0, 50)}...`);

        try {
          const mediaId = await uploadMedia(attachment.uri, attachment.type, attachment.name);

          if (mediaId) {
            console.log(`✅ 파일 업로드 성공: ${attachment.name}, mediaId: ${mediaId}`);
            return {
              index,
              name: attachment.name,
              type: attachment.type,
              success: true,
              mediaId,
            };
          } else {
            console.error(`❌ 파일 업로드 실패: ${attachment.name} - mediaId가 null입니다.`);
            return {
              index,
              name: attachment.name,
              type: attachment.type,
              success: false,
              error: '업로드 결과를 받을 수 없습니다.',
            };
          }
        } catch (uploadError) {
          console.error(`❌ 파일 업로드 중 에러 발생: ${attachment.name}`, uploadError);
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

      console.log(`📊 업로드 결과: 성공 ${successCount}개, 실패 ${failCount}개`);

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
        console.warn('⚠️ 모든 파일 업로드가 실패했습니다.');
        Alert.alert('업로드 실패', '모든 파일 업로드에 실패했습니다. 다시 시도해주세요.');
        setIsSubmitting(false);
        return;
      }

      if (mediaIds.length > 0) {
        console.log(`✅ 총 ${mediaIds.length}개 파일 업로드 완료`);
      }

      // mediaIds를 media_urls로 변환 (API는 URL을 요구함)
      console.log('🔗 미디어 URL 변환 시작...');
      let mediaUrls: string[];
      try {
        mediaUrls = await getMediaUrls(mediaIds, accessToken);
        console.log(`✅ 미디어 URL 변환 완료: ${mediaUrls.length}개`);
      } catch (urlError) {
        console.error('❌ 미디어 URL 변환 실패:', urlError);
        const errorMessage =
          urlError instanceof Error ? urlError.message : '미디어 URL 변환에 실패했습니다.';
        Alert.alert('오류', errorMessage);
        setIsSubmitting(false);
        return;
      }

      const requestData: CreateCapsuleRequest = {
        title: data.title,
        content: data.content || undefined,
        media_urls: mediaUrls,
        media_types: mediaTypes,
      };

      console.log('📡 이스터에그 생성 API 호출 시작...');
      console.log('📡 요청 데이터:', {
        title: requestData.title,
        content: requestData.content,
        media_urls_count: requestData.media_urls.length,
        media_types: requestData.media_types,
      });

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

      console.log('✅ 이스터에그 생성 성공:', response.data.id);

      // 성공 시 폼 초기화 및 닫기
      setValue('title', '');
      setValue('content', '');
      setValue('attachments', []);
      onClose();
    } catch (error) {
      console.error('❌ 이스터에그 생성 중 에러 발생:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data;

      console.error('❌ 에러 상태:', status);
      console.error('❌ 에러 데이터:', errorData);

      switch (status) {
        case 409:
          // 슬롯 부족 에러 처리
          const errorCode = errorData?.code;
          const details = errorData?.details;

          if (errorCode === 'EGG_SLOTS_EXCEEDED') {
            // 서버에서 슬롯 정보를 제공하는 경우
            if (details?.max_slots !== undefined && details?.used_slots !== undefined) {
              const remaining = (details.max_slots || 0) - (details.used_slots || 0);
              Alert.alert(
                '슬롯 부족',
                `이스터에그 작성 슬롯이 모두 사용되었습니다.\n\n사용된 슬롯: ${details.used_slots}개\n최대 슬롯: ${details.max_slots}개\n남은 슬롯: ${remaining}개`,
              );
            } else if (details?.remaining_slots !== undefined) {
              Alert.alert(
                '슬롯 부족',
                `남은 슬롯이 없습니다.\n(남은 슬롯: ${details.remaining_slots}개)`,
              );
            } else {
              // 서버 메시지가 있으면 사용, 없으면 기본 메시지
              const serverMessage = errorData?.message || errorData?.error;
              Alert.alert(
                '슬롯 부족',
                serverMessage ||
                  '이스터에그 작성 슬롯이 모두 사용되었습니다.\n더 이상 작성할 수 없습니다.',
              );
            }
          } else {
            // 다른 409 에러인 경우 서버 메시지 사용
            const serverMessage = errorData?.message || errorData?.error || '요청이 충돌했습니다.';
            Alert.alert('알림', serverMessage);
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

  // 각 타입별 첨부파일 확인
  const photoAttachment = attachments.find((att) => att.type === 'IMAGE');
  const musicAttachment = attachments.find((att) => att.type === 'MUSIC');
  const videoAttachment = attachments.find((att) => att.type === 'VIDEO');

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    isFormValid,
    isSubmitting,
    handleDeleteAttachment,
    handleAddAttachment,
    photoAttachment,
    musicAttachment,
    videoAttachment,
  };
};
