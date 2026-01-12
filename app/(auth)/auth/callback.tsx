/**
 * app/(auth)/auth/callback.tsx
 * OAuth 콜백 처리 (웹 전용)
 * - 모바일: useKakaoLogin에서 직접 처리
 * - 웹: 백엔드 리다이렉트 처리
 */

import { ROUTES, STORAGE_KEYS } from '@/commons/constants';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { getUserFromToken } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

export default function AuthCallback() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { login } = useAuth();
  const router = useRouter();
  const isProcessingRef = useRef(false); // 로그인 처리 중복 방지

  useEffect(() => {
    // 토큰 없으면 온보딩 페이지로 리다이렉트
    if (!token) {
      router.replace(ROUTES.AUTH_ONBOARDING as any);
      return;
    }

    // 이미 처리 중이면 무시
    if (isProcessingRef.current) {
      if (__DEV__) {
        console.log('[AuthCallback] 이미 로그인 처리 중, 스킵');
      }
      return;
    }

    const handleWebLogin = async () => {
      try {
        isProcessingRef.current = true; // 처리 시작

        if (__DEV__) {
          console.log('[AuthCallback] 웹 로그인 시작:', {
            tokenLength: token.length,
            tokenPreview: token.substring(0, 20) + '...',
          });
        }

        const userData = getUserFromToken(token);
        if (!userData) {
          if (__DEV__) {
            console.error('[AuthCallback] 토큰에서 유저 정보 추출 실패');
          }
          Alert.alert('오류', '사용자 정보를 가져올 수 없습니다.');
          return;
        }

        if (__DEV__) {
          console.log('[AuthCallback] 유저 정보 추출 성공:', userData);
        }

        await login(token, userData);

        if (__DEV__) {
          console.log('[AuthCallback] 로그인 처리 완료');
        }

        // AsyncStorage에서 온보딩 상태 확인
        const [friendConsent, locationConsent] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.FRIEND_CONSENT),
          AsyncStorage.getItem(STORAGE_KEYS.LOCATION_CONSENT),
        ]);

        const isFriendConsentDone = friendConsent === 'true';
        const isLocationConsentDone = locationConsent === 'true';

        if (__DEV__) {
          console.log('[AuthCallback] 온보딩 상태:', {
            isFriendConsentDone,
            isLocationConsentDone,
          });
        }

        // 온보딩 상태 확인 후 리다이렉트
        if (!isFriendConsentDone || !isLocationConsentDone) {
          // 온보딩 미완료 → 온보딩 페이지로
          if (__DEV__) {
            console.log('[AuthCallback] 온보딩 미완료 → 온보딩 페이지로 이동');
          }
          router.replace(ROUTES.AUTH_ONBOARDING as any);
        } else {
          // 온보딩 완료 → 저장된 초대 코드 확인 후 리다이렉트
          const pendingInviteCode = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_INVITE_CODE);
          if (pendingInviteCode) {
            // 초대 코드 있음 → 대기실로 이동 후 삭제
            if (__DEV__) {
              console.log('[AuthCallback] 저장된 초대 코드 발견 → 대기실로 이동:', pendingInviteCode);
            }
            await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_INVITE_CODE);
            router.replace(`/(tabs)/room/join?invite_code=${pendingInviteCode}` as any);
          } else {
            // 초대 코드 없음 → 메인 페이지로
            if (__DEV__) {
              console.log('[AuthCallback] 온보딩 완료 → 메인 페이지로 이동');
            }
            router.replace(ROUTES.MAIN as any);
          }
        }
      } catch (error) {
        if (__DEV__) {
          console.error('[AuthCallback] 로그인 처리 중 오류:', error);
        }
        Alert.alert('오류', '로그인 처리 중 오류가 발생했습니다.');
      }
    };

    handleWebLogin();
  }, [token]); // ⚠️ 의존성 배열에서 login, router 제거 → token만 남김

  // 웹 로그인 처리 중
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 16, fontSize: 16, color: '#333' }}>로그인 처리 중...</Text>
    </View>
  );
}
