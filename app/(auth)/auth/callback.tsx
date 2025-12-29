/**
 * app/(auth)/auth/callback.tsx
 * OAuth 콜백 처리 (웹 전용)
 * - 모바일: useKakaoLogin에서 직접 처리
 * - 웹: 백엔드 리다이렉트 처리
 */

import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { getUserFromToken } from '@/utils';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

export default function AuthCallback() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { login } = useAuth();

  useEffect(() => {
    if (!token) return;

    const handleWebLogin = async () => {
      try {
        const userData = getUserFromToken(token);
        if (!userData) {
          Alert.alert('오류', '사용자 정보를 가져올 수 없습니다.');
          return;
        }

        await login(token, userData);
      } catch (error) {
        Alert.alert('오류', '로그인 처리 중 오류가 발생했습니다.');
      }
    };

    handleWebLogin();
  }, [token, login]);

  // 토큰 없으면 로그인 페이지로
  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  // 웹 로그인 처리 중
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 16, fontSize: 16, color: '#333' }}>로그인 처리 중...</Text>
    </View>
  );
}
