/**
 * OAuth 콜백 페이지
 * ⚠️ 중요: (auth) 그룹 밖에 위치하여 인증 가드와 충돌하지 않음
 * 로그인 성공 후 토큰을 받아 처리하고, AuthProvider 가드가 자동으로 메인으로 리다이렉트함
 */
import { ROUTES } from '@/commons/constants/routes';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { getUserFromToken } from '@/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';

export default function AuthCallback() {
  const params = useLocalSearchParams<{ token?: string; isNewUser?: string }>();
  const { login } = useAuth();
  const router = useRouter();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // 중복 실행 방지
      if (isProcessingRef.current) {
        return;
      }

      const token = params.token;

      if (!token) {
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        router.replace(ROUTES.AUTH_LOGIN);
        return;
      }

      // 처리 시작
      isProcessingRef.current = true;

      try {
        // 토큰에서 사용자 정보 추출
        const userData = getUserFromToken(token);

        if (userData) {
          console.log('[AuthCallback] 로그인 시작, token:', token?.substring(0, 20) + '...');

          // AuthProvider의 login 함수를 통해 토큰 저장 및 상태 업데이트
          // login() 함수 내부에서 이미 router.replace(ROUTES.MAIN)을 호출함
          await login(token, userData);

          console.log('[AuthCallback] login() 완료');
          
          // ⚠️ 웹 환경에서는 login() 함수 내부의 router.replace()만으로 충분
          // 중복 호출을 제거하여 무한 리다이렉트 방지
          // 모바일 환경에서만 보험용으로 추가 호출
          if (Platform.OS !== 'web') {
            router.replace(ROUTES.MAIN);
            console.log('[AuthCallback] router.replace() 호출 완료 (모바일)');
          }
        } else {
          Alert.alert('오류', '사용자 정보를 가져올 수 없습니다.');
          router.replace(ROUTES.AUTH_LOGIN);
        }
      } catch (error) {
        if (__DEV__) {
          console.error('로그인 콜백 처리 오류:', error);
        }
        Alert.alert('오류', '로그인 처리 중 오류가 발생했습니다.');
        router.replace(ROUTES.AUTH_LOGIN);
      } finally {
        isProcessingRef.current = false;
      }
    };

    handleCallback();
  }, [params.token, login, router]);

  // 처리 중에는 아무것도 렌더링하지 않음 (빈 화면)
  // AuthProvider 가드가 자동으로 메인으로 리다이렉트함
  return null;
}
