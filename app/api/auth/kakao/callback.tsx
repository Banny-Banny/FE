/**
 * app/api/auth/kakao/callback.tsx
 * 백엔드 OAuth 콜백 처리 (임시 해결책)
 *
 * ⚠️ 주의: 백엔드가 /api/auth/kakao/callback으로 리다이렉트하고 있어서
 * 프론트엔드에서 이 경로를 처리할 수 있도록 추가했습니다.
 *
 * 백엔드가 프론트엔드의 redirect_uri를 사용하도록 수정되면 이 파일은 제거해야 합니다.
 */

import { ROUTES } from '@/commons/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

export default function ApiAuthKakaoCallback() {
  const { token, isNewUser } = useLocalSearchParams<{ token?: string; isNewUser?: string }>();
  const router = useRouter();
  const hasRedirectedRef = useRef(false); // 리다이렉트 중복 방지

  useEffect(() => {
    // 이미 리다이렉트했으면 무시
    if (hasRedirectedRef.current) {
      if (__DEV__) {
        console.log('[ApiAuthKakaoCallback] 이미 리다이렉트 완료, 스킵');
      }
      return;
    }

    hasRedirectedRef.current = true; // 리다이렉트 시작

    if (__DEV__) {
      console.log('[ApiAuthKakaoCallback] 백엔드 콜백 처리:', { token: !!token, isNewUser });
    }

    // 토큰이 있으면 프론트엔드 콜백 라우트로 리다이렉트
    if (token) {
      const params = new URLSearchParams({ token });
      if (isNewUser) {
        params.append('isNewUser', isNewUser);
      }
      router.replace(`${ROUTES.AUTH_CALLBACK}?${params.toString()}` as any);
    } else {
      // 토큰이 없으면 온보딩 페이지로
      router.replace(ROUTES.AUTH_ONBOARDING as any);
    }
  }, [token, isNewUser]); // ⚠️ 의존성 배열에서 router 제거

  // 리다이렉트 중 표시할 내용 (빈 화면)
  return null;
}
