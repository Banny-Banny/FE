/**
 * components/map/components/egg-form/hooks/useEggForm.ts
 * 이스터에그 폼 관리 통합 Hook (간소화 버전)
 *
 * 생성 시각: 2025-01-XX
 * 통신 테스트를 위해 간소화된 버전
 */

import { convertToMediaType, normalizeApiBaseUrl } from '@/utils';
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
 * JWT 토큰 가져오기
 * 테스트 환경에서는 환경변수에서 토큰을 가져옵니다.
 * TODO: 실제 인증 시스템 구현 시 AsyncStorage 또는 SecureStore에서 가져오도록 수정
 */
const getAuthToken = async (): Promise<string | null> => {
  // 테스트용: 환경변수에서 토큰 가져오기
  const testToken = process.env.EXPO_PUBLIC_TEST_AUTH_TOKEN;
  if (testToken) {
    return testToken;
  }

  // TODO: 실제 인증 시스템 구현 시 아래 코드 사용
  // return await AsyncStorage.getItem('auth_token');
  // 또는: return await SecureStore.getItemAsync('auth_token');

  return null;
};

/**
 * 이스터에그 폼 관리 통합 Hook
 */
export const useEggForm = ({ onClose }: UseEggFormProps) => {
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
  const handleAddAttachment = async (type: 'photo' | 'music' | 'video') => {
    try {
      let file: { name: string; uri: string } | null = null;

      if (type === 'photo') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        const mimeTypes = type === 'music' ? ['audio/*'] : ['video/*'];
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
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const token = await getAuthToken();
      const rawApiBaseUrl =
        Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;

      const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

      if (!apiBaseUrl) {
        Alert.alert(
          '오류',
          'API 서버 주소가 설정되지 않았습니다.\n.env 파일에 EXPO_PUBLIC_API_BASE_URL을 설정해주세요.\n예: http://172.16.2.94:3000',
        );
        console.error('API Base URL이 설정되지 않았습니다:', rawApiBaseUrl);
        return;
      }

      // 간소화: 파일 URI를 그대로 전송 (실제로는 업로드 후 URL을 받아야 함)
      const mediaUrls = attachments.filter((att) => att.uri).map((att) => att.uri!);
      const mediaTypes = attachments.map((att) => convertToMediaType(att.type));

      const requestData: CreateCapsuleRequest = {
        title: data.title,
        content: data.content || undefined,
        media_urls: mediaUrls,
        media_types: mediaTypes,
      };

      const response = await axios.post<CreateCapsuleResponse>(
        `${apiBaseUrl}/api/capsule`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
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
          Alert.alert('알림', '남은 슬롯이 없습니다.');
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
  const photoAttachment = attachments.find((att) => att.type === 'photo');
  const musicAttachment = attachments.find((att) => att.type === 'music');
  const videoAttachment = attachments.find((att) => att.type === 'video');

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
