/**
 * components/onboarding/hooks/useKakaoLogin.ts
 * 카카오 OAuth 로그인 처리만 담당
 */

import { API_ENDPOINTS, ROUTES } from '@/commons/constants';
import { buildApiUrl } from '@/utils';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

interface KakaoLoginResult {
  token?: string;
  isNewUser?: boolean;
  error?: string;
}

/**
 * 카카오 OAuth 로그인 Hook
 * @returns {isLoading, loginWithKakao}
 */
export function useKakaoLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl || '';

  /**
   * 카카오 로그인 실행 및 결과 반환
   */
  const loginWithKakao = useCallback(async (): Promise<KakaoLoginResult | null> => {
    try {
      setIsLoading(true);
      
      // 백엔드 OAuth URL 생성
      const baseLoginUrl = buildApiUrl(apiBaseUrl, API_ENDPOINTS.AUTH.KAKAO);
      
      // 플랫폼별 redirect_uri 설정
      // ⚠️ 중요: 웹 환경에서는 프론트엔드 라우트 경로를 사용해야 함
      // 백엔드는 이 redirect_uri로 리다이렉트하므로, 프론트엔드 라우트와 일치해야 함
      const redirectUri = Platform.OS === 'web'
        ? `${window.location.origin}${ROUTES.AUTH_CALLBACK}`  // 웹: 프론트엔드 라우트 경로 사용
        : 'timeegg://auth/callback';  // 모바일: 딥링크
      
      const loginUrl = `${baseLoginUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`;

      // 웹: 백엔드 OAuth 페이지로 직접 이동 (페이지 새로고침)
      if (Platform.OS === 'web') {
        window.location.href = loginUrl;
        return null;  // 페이지가 이동하므로 결과 반환 불가
      }

      // 모바일: 인앱 브라우저
      // 안드로이드: openAuthSessionAsync 대신 일반 브라우저로 열기
      if (Platform.OS === 'android') {
        // 일반 브라우저로 열기 (Chrome Custom Tabs 문제 우회)
        const canOpen = await Linking.canOpenURL(loginUrl);
        if (canOpen) {
          await Linking.openURL(loginUrl);
          // Linking.openURL은 결과를 반환하지 않으므로 null 반환
          return null;
        } else {
          Alert.alert('오류', 'URL을 열 수 없습니다.');
          return { error: 'CANNOT_OPEN_URL' };
        }
      }

      // iOS: openAuthSessionAsync 사용 (타임아웃 60초)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('WebBrowser 타임아웃 (60초)'));
        }, 60000);
      });

      const webBrowserPromise = WebBrowser.openAuthSessionAsync(
        loginUrl,
        'timeegg://',
        { presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN },
      );

      // 타임아웃과 WebBrowser 중 먼저 완료되는 것 선택
      const result = await Promise.race([webBrowserPromise, timeoutPromise]);

      // 취소
      if (result.type === 'cancel') {
        return null;
      }

      // 성공: URL 파싱
      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const token = url.searchParams.get('token');
        const isNewUser = url.searchParams.get('isNewUser') === 'true';

        if (!token) {
          Alert.alert('오류', '토큰을 받지 못했습니다.');
          return { error: 'NO_TOKEN' };
        }

        return { token, isNewUser };
      }

      // 실패
      Alert.alert('오류', '로그인에 실패했습니다.');
      return { error: 'UNKNOWN_ERROR' };
    } catch (error) {
      // 타임아웃 에러
      if (error instanceof Error && error.message.includes('타임아웃')) {
        Alert.alert(
          '타임아웃',
          '로그인 페이지를 불러오는데 시간이 너무 오래 걸립니다 (60초 초과).\n\n네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.',
          [{ text: '확인' }]
        );
      } else {
        Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
      }
      
      return { error: 'EXCEPTION' };
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  return {
    isLoading,
    loginWithKakao,
  };
}

