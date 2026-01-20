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
  phoneNumber?: string;
  email?: string;
  password: string;
}

interface EmailSignupParams {
  nickname: string;
  phoneNumber: string;
  password: string;
  email?: string;
  profileImg?: string;
}

/**
 * 이메일 로그인 Hook
 * @returns {isLoading, loginWithEmail, signupWithEmail}
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

        // 이메일 또는 전화번호 중 하나는 필수
        if (!params.email && !params.phoneNumber) {
          Alert.alert('입력 오류', '이메일 또는 전화번호를 입력해주세요.');
          return null;
        }

        // 이메일 형식 검증 (입력된 경우)
        if (params.email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(params.email)) {
            Alert.alert('입력 오류', '올바른 이메일 형식이 아닙니다.');
            return null;
          }
        }

        // 전화번호 형식 검증 (입력된 경우)
        if (params.phoneNumber) {
          const cleanPhoneNumber = params.phoneNumber.replace(/-/g, '');
          const phoneRegex = /^01[0-9]{9}$/;
          if (!phoneRegex.test(cleanPhoneNumber)) {
            Alert.alert('입력 오류', '올바른 전화번호 형식이 아닙니다. (예: 01012345678)');
            return null;
          }
        }

        // 비밀번호 길이 검증
        if (params.password.length < 6) {
          Alert.alert('입력 오류', '비밀번호는 최소 6자 이상이어야 합니다.');
          return null;
        }

        // API 호출
        const loginUrl = buildApiUrl(apiBaseUrl, API_ENDPOINTS.AUTH.EMAIL_LOGIN);
        const requestBody: any = {
          password: params.password,
        };
        
        // 이메일 또는 전화번호 추가
        if (params.email) {
          requestBody.email = params.email;
        }
        if (params.phoneNumber) {
          requestBody.phoneNumber = params.phoneNumber.replace(/-/g, '');
        }

        const response = await publicApiClient.post(loginUrl, requestBody);

        if (response.data && response.data.token) {
          return {
            token: response.data.token,
            user: response.data.user || {
              id: response.data.userId || '',
              email: params.email || '',
              nickname: response.data.nickname,
            },
          };
        }

        Alert.alert('로그인 실패', '이메일/전화번호 또는 비밀번호가 올바르지 않습니다.');
        return null;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          '로그인 중 오류가 발생했습니다.';
        
        // 에러 상태 코드별 처리
        if (error.response?.status === 401) {
          Alert.alert('로그인 실패', '이메일/전화번호 또는 비밀번호가 올바르지 않습니다.');
        } else if (error.response?.status === 403) {
          Alert.alert('로그인 실패', '활성화되지 않은 계정이거나 SNS 계정입니다.');
        } else {
          Alert.alert('로그인 실패', errorMessage);
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * 이메일 회원가입 실행 및 결과 반환
   */
  const signupWithEmail = useCallback(
    async (params: EmailSignupParams): Promise<EmailLoginResult | null> => {
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

        // 전화번호 형식 검증 (하이픈 제거 후 11자리 숫자)
        const cleanPhoneNumber = params.phoneNumber.replace(/-/g, '');
        const phoneRegex = /^01[0-9]{9}$/;
        if (!phoneRegex.test(cleanPhoneNumber)) {
          Alert.alert('입력 오류', '올바른 전화번호 형식이 아닙니다. (예: 01012345678)');
          return null;
        }

        // 이메일 형식 검증 (선택사항이지만 입력된 경우)
        if (params.email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(params.email)) {
            Alert.alert('입력 오류', '올바른 이메일 형식이 아닙니다.');
            return null;
          }
        }

        // 비밀번호 길이 검증
        if (params.password.length < 8) {
          Alert.alert('입력 오류', '비밀번호는 최소 8자 이상이어야 합니다.');
          return null;
        }

        // API 호출
        const signupUrl = buildApiUrl(apiBaseUrl, API_ENDPOINTS.AUTH.EMAIL_SIGNUP);
        const requestBody: any = {
          nickname: params.nickname,
          phoneNumber: cleanPhoneNumber,
          password: params.password,
        };
        
        // 선택 필드 추가
        if (params.email) {
          requestBody.email = params.email;
        }
        if (params.profileImg) {
          requestBody.profileImg = params.profileImg;
        }

        const response = await publicApiClient.post(signupUrl, requestBody);

        if (response.data && response.data.token) {
          return {
            token: response.data.token,
            user: response.data.user || {
              id: response.data.userId || '',
              email: params.email,
              nickname: params.nickname || response.data.nickname,
            },
          };
        }

        Alert.alert('회원가입 실패', '회원가입에 실패했습니다. 다시 시도해주세요.');
        return null;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          '회원가입 중 오류가 발생했습니다.';
        
        // 중복 전화번호/이메일 에러 처리
        if (error.response?.status === 409) {
          Alert.alert('회원가입 실패', '이미 사용 중인 전화번호 또는 이메일입니다.');
        } else {
          Alert.alert('회원가입 실패', errorMessage);
        }
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
    signupWithEmail,
  };
}
