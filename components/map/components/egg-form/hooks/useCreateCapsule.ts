/**
 * components/map/components/egg-form/hooks/useCreateCapsule.ts
 * 캡슐 생성 API 호출 Hook
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] axios를 사용한 API 통신
 * - [x] 에러 처리 로직 포함 (409, 400, 401, 404)
 * - [x] JWT 토큰 인증 헤더 설정
 * - [x] hooks 폴더 내 커스텀 훅으로 분리 (04-func.mdc 규칙)
 */

import { convertToMediaType, normalizeApiBaseUrl } from '@/utils';
import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import { Alert } from 'react-native';
import {
  ApiErrorResponse,
  AttachmentFile,
  CreateCapsuleRequest,
  CreateCapsuleResponse,
} from '../types';
import { useFileUpload } from './useFileUpload';

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
 * 캡슐 생성 Hook
 */
export const useCreateCapsule = () => {
  const { uploadFileToServer } = useFileUpload();

  /**
   * 캡슐 생성 API 호출
   * @param data 캡슐 생성 데이터
   * @returns 생성된 캡슐 정보 또는 null
   */
  const createCapsule = async (
    data: Omit<CreateCapsuleRequest, 'media_urls' | 'media_types'> & {
      attachments: AttachmentFile[];
    },
  ): Promise<CreateCapsuleResponse | null> => {
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
        return null;
      }

      // 파일 업로드 및 URL 수집
      const mediaUrls: string[] = [];
      const mediaTypes: ('IMAGE' | 'VIDEO' | 'MUSIC')[] = [];

      for (const attachment of data.attachments) {
        if (attachment.uri) {
          const uploadedUrl = await uploadFileToServer(attachment.uri, attachment.type, token);
          if (uploadedUrl) {
            mediaUrls.push(uploadedUrl);
            mediaTypes.push(convertToMediaType(attachment.type));
          } else {
            Alert.alert('오류', `파일 업로드에 실패했습니다: ${attachment.name}`);
            return null;
          }
        }
      }

      // 캡슐 생성 요청 데이터 구성
      const requestData: CreateCapsuleRequest = {
        title: data.title,
        content: data.content,
        media_urls: mediaUrls,
        media_types: mediaTypes,
        open_at: data.open_at,
        view_limit: data.view_limit,
        product_id: data.product_id,
      };

      // API 호출
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

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data;

      // 에러 처리
      switch (status) {
        case 409:
          // 슬롯 부족
          Alert.alert('알림', '남은 슬롯이 없습니다.');
          break;
        case 400:
          // 유효성 실패
          const errorMessage =
            errorData?.message || errorData?.error || '입력한 정보를 확인해주세요.';
          Alert.alert('오류', errorMessage);
          break;
        case 401:
          // 인증 실패
          Alert.alert('인증 오류', '로그인이 필요합니다.');
          break;
        case 404:
          // 상품 미존재
          Alert.alert('오류', '요청한 상품을 찾을 수 없습니다.');
          break;
        default:
          // 기타 오류
          const defaultMessage =
            errorData?.message || errorData?.error || '서버 오류가 발생했습니다.';
          Alert.alert('오류', defaultMessage);
          break;
      }

      console.error('캡슐 생성 오류:', error);
      return null;
    }
  };

  return {
    createCapsule,
  };
};
