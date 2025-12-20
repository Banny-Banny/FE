import { API_ENDPOINTS } from '@/commons/constants';
import { buildApiUrl } from '@/utils';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

/**
 * 로그인 비즈니스 로직 Hook
 */
export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);

  // API Base URL 가져오기
  const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl || '';

  // 카카오 로그인 시작 (OAuth 2.0 플로우)
  const handleKakaoLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      const loginUrl = buildApiUrl(apiBaseUrl, API_ENDPOINTS.AUTH.KAKAO);
      console.log('카카오 로그인 URL:', loginUrl);

      // 웹 환경: 브라우저에서 직접 이동
      if (Platform.OS === 'web') {
        // expo-linking을 사용하여 웹에서도 안전하게 처리
        await Linking.openURL(loginUrl);
        return;
      }

      // 모바일 환경: 인앱 브라우저로 열기
      const result = await WebBrowser.openAuthSessionAsync(loginUrl, Linking.createURL('/'));

      if (result.type === 'success' && result.url) {
        // 콜백 URL에서 토큰 추출
        const url = new URL(result.url);
        const token = url.searchParams.get('token');
        const isNewUser = url.searchParams.get('isNewUser') === 'true';

        if (token) {
          console.log('로그인 성공:', { token, isNewUser });
          // TODO: 토큰 저장 및 사용자 정보 처리
          Alert.alert('성공', `로그인에 성공했습니다. ${isNewUser ? '(신규 사용자)' : ''}`);
        } else {
          Alert.alert('오류', '토큰을 받지 못했습니다.');
        }
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
  }, [apiBaseUrl]);

  return {
    isLoading,
    handleKakaoLogin,
  };
}
