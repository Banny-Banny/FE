import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';

import { styles } from './styles';

/**
 * 알람 페이지
 * Tabs 레이아웃과 함께 사용
 */
export default function AlarmPage() {
  const [isLoading, setIsLoading] = useState(false);

  // API Base URL 가져오기
  const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl || '';

  // URL 구성 헬퍼 함수
  const buildApiUrl = useCallback(
    (endpoint: string) => {
      if (!apiBaseUrl) {
        throw new Error('API Base URL이 설정되지 않았습니다.');
      }

      // apiBaseUrl이 슬래시로 끝나지 않으면 추가
      const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`;
      // endpoint가 슬래시로 시작하면 제거
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

      return `${baseUrl}${cleanEndpoint}`;
    },
    [apiBaseUrl],
  );

  // 카카오 로그인 시작 (OAuth 2.0 플로우)
  const handleKakaoLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      const loginUrl = buildApiUrl('api/auth/kakao');
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
  }, [buildApiUrl]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>로그인</Text>
        <Pressable onPress={handleKakaoLogin} disabled={isLoading}>
          <Text>{isLoading ? '로그인 중...' : '로그인 버튼'}</Text>
        </Pressable>
      </View>
    </View>
  );
}
