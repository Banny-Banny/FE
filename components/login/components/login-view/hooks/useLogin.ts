import { API_ENDPOINTS } from '@/commons/constants';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { buildApiUrl } from '@/utils';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
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

  // ⚠️ 콜백 처리는 /auth/callback 페이지에서 수행하므로 여기서는 처리하지 않음
  // 이렇게 하면 로그인 페이지가 (auth) 그룹에 있고, 콜백 페이지는 그룹 밖에 있어서 가드 충돌이 없음

  // 카카오 로그인 시작 (OAuth 2.0 플로우)
  // 플로우: 프론트엔드 → 서버(/api/auth/kakao/callback) → 카카오 → 서버 → 프론트엔드(/auth/callback)
  const handleKakaoLogin = useCallback(async () => {
    try {
      setIsLoading(true);

      // 프론트엔드 콜백 URL 생성 (플랫폼 차이는 Linking.createURL이 자동으로 해결)
      // - 웹: http://localhost:8081/auth/callback 또는 https://example.com/auth/callback
      // - 앱: timeegg://auth/callback
      const callbackUrl = Linking.createURL('/auth/callback');
      console.log('[Login] 프론트엔드 콜백 URL:', callbackUrl);

      // 서버의 카카오 로그인 시작 엔드포인트로 이동
      // 서버가 카카오 인증 후 위의 callbackUrl로 리다이렉트함
      // ⚠️ 중요: 프론트엔드에서 생성한 콜백 URL을 서버에 쿼리 파라미터로 전달
      const baseLoginUrl = buildApiUrl(apiBaseUrl, API_ENDPOINTS.AUTH.KAKAO);
      const loginUrl = `${baseLoginUrl}?redirect_uri=${encodeURIComponent(callbackUrl)}`;
      console.log('[Login] 서버 로그인 URL:', loginUrl);

      // 웹 환경: 브라우저에서 직접 이동
      // 서버가 카카오 인증 후 프론트엔드 콜백 URL로 리다이렉트함
      if (Platform.OS === 'web') {
        window.location.href = loginUrl;
        return;
      }

      // 모바일 환경: 인앱 브라우저로 열기
      // ⚠️ 중요: 콜백 URL은 (auth) 그룹 밖의 /auth/callback으로 설정
      // 이렇게 하면 인증 가드와 충돌하지 않음
      // iOS에서 전체 화면으로 표시하기 위한 옵션
      const browserOptions =
        Platform.OS === 'ios'
          ? {
              presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
            }
          : undefined;

      const result = await WebBrowser.openAuthSessionAsync(loginUrl, callbackUrl, browserOptions);

      if (result.type === 'success' && result.url) {
        // ⚠️ 핵심: openAuthSessionAsync는 콜백 URL로 리다이렉트되면 자동으로 브라우저가 닫히고 앱으로 돌아옴
        // 하지만 확실하게 하기 위해 명시적으로 브라우저를 닫음
        try {
          WebBrowser.dismissAuthSession();
          await WebBrowser.dismissBrowser();
        } catch (error) {
          // 이미 닫혔거나 에러가 발생해도 계속 진행
          if (__DEV__) {
            console.log('[Login] Browser dismiss error (ignored):', error);
          }
        }
        console.log('[Login] 로그인 성공, 콜백 페이지에서 처리 중...');
      } else if (result.type === 'cancel') {
        // 사용자가 로그인을 취소한 경우에도 브라우저를 닫기
        try {
          WebBrowser.dismissAuthSession();
          await WebBrowser.dismissBrowser();
        } catch (error) {
          if (__DEV__) {
            console.log('[Login] Browser dismiss error (ignored):', error);
          }
        }
        console.log('[Login] 사용자가 로그인을 취소했습니다.');
      } else {
        // 기타 오류 발생 시에도 브라우저를 닫기
        try {
          WebBrowser.dismissAuthSession();
          await WebBrowser.dismissBrowser();
        } catch (error) {
          if (__DEV__) {
            console.log('[Login] Browser dismiss error (ignored):', error);
          }
        }
        Alert.alert('오류', '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  return {
    isLoading,
    handleKakaoLogin,
  };
}
