/**
 * components/onboarding/hooks/useEmailLogin.ts
 * 이메일 로그인 Hook
 */

import { API_ENDPOINTS } from '@/commons/constants';
import { publicApiClient } from '@/utils/apiClient';
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { buildApiUrl, normalizeApiBaseUrl } from '@/utils';
import Constants from 'expo-constants';

interface EmailLoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    nickname?: string;
  };
}

interface EmailLoginParams {
  email: string;
  password: string;
}

/**
 * 이메일 로그인 Hook
 * @returns {isLoading, loginWithEmail}
 */
export function useEmailLogin() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 이메일 로그인 실행 및 결과 반환
   */
  const loginWithEmail = useCallback(
    async (params: EmailLoginParams): Promise<EmailLoginResult | null> => {
      try {
        setIsLoading(true);

        // API Base URL 가져오기 및 정규화
        const rawApiBaseUrl =
          Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || '';
        const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

        if (!apiBaseUrl) {
          Alert.alert(
            '설정 오류',
            'API 서버 주소가 설정되지 않았습니다.\n.env 파일에 EXPO_PUBLIC_API_BASE_URL을 설정해주세요.',
          );
          return null;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(params.email)) {
          Alert.alert('입력 오류', '올바른 이메일 형식이 아닙니다.');
          return null;
        }

        // 비밀번호 길이 검증
        if (params.password.length < 6) {
          Alert.alert('입력 오류', '비밀번호는 최소 6자 이상이어야 합니다.');
          return null;
        }

        // API 호출
        const loginUrl = buildApiUrl(apiBaseUrl, API_ENDPOINTS.AUTH.EMAIL_LOGIN);
        const response = await publicApiClient.post(loginUrl, {
          email: params.email,
          password: params.password,
        });

        if (response.data && response.data.token) {
          return {
            token: response.data.token,
            user: response.data.user || {
              id: response.data.userId || '',
              email: params.email,
              nickname: response.data.nickname,
            },
          };
        }

        Alert.alert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
        return null;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          '로그인 중 오류가 발생했습니다.';
        Alert.alert('로그인 실패', errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoading,
    loginWithEmail,
  };
}
