import { API_ENDPOINTS } from '@/commons/constants';
import { ROUTES } from '@/commons/constants/routes';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { buildApiUrl, getUserFromToken } from '@/utils';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

/**
 * 로그인 비즈니스 로직 Hook
 */
export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ token?: string; isNewUser?: string }>();
  const { login } = useAuth();

  // API Base URL 가져오기
  const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl || '';

  // URL 파라미터에서 토큰 확인 및 처리 (콜백 처리)
  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.token;

      if (token) {
        try {
          // 토큰에서 사용자 정보 추출
          const userData = getUserFromToken(token);

          if (userData) {
            // AuthProvider의 login 함수를 통해 토큰 저장 및 상태 업데이트
            // login 함수 내부에서 이미 메인으로 리다이렉트함
            await login(token, userData);
          } else {
            Alert.alert('오류', '사용자 정보를 가져올 수 없습니다.');
          }
        } catch (error) {
          if (__DEV__) {
            console.error('로그인 콜백 처리 오류:', error);
          }
          Alert.alert('오류', '로그인 처리 중 오류가 발생했습니다.');
        }
      }
    };

    handleCallback();
  }, [searchParams.token, login]);

  // 카카오 로그인 시작 (OAuth 2.0 플로우)
  const handleKakaoLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      const loginUrl = buildApiUrl(apiBaseUrl, API_ENDPOINTS.AUTH.KAKAO);
      console.log('카카오 로그인 URL:', loginUrl);

      // 웹 환경: 브라우저에서 직접 이동
      // 콜백 URL은 자동으로 /auth/callback 라우트로 리다이렉트됨
      if (Platform.OS === 'web') {
        window.location.href = loginUrl;
        return;
      }

      // 모바일 환경: 인앱 브라우저로 열기
      // 콜백 URL은 로그인 페이지로 리다이렉트되며, URL 파라미터로 토큰이 전달됨
      const callbackUrl = Linking.createURL(ROUTES.AUTH_LOGIN);
      const result = await WebBrowser.openAuthSessionAsync(loginUrl, callbackUrl);

      if (result.type === 'success' && result.url) {
        // 콜백 URL로 리다이렉트되면 로그인 페이지의 useEffect에서 처리
        // URL 파라미터에 토큰이 포함되어 있으면 자동으로 처리됨
        console.log('로그인 성공, 콜백 처리 중...');
      } else if (result.type === 'cancel') {
        console.log('사용자가 로그인을 취소했습니다.');
      } else {
        Alert.alert('오류', '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, router]);

  return {
    isLoading,
    handleKakaoLogin,
  };
}
