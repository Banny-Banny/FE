/**
 * app/api/auth/kakao/callback.tsx
 * 백엔드 OAuth 콜백 처리 (임시 해결책)
 * 
 * ⚠️ 주의: 백엔드가 /api/auth/kakao/callback으로 리다이렉트하고 있어서
 * 프론트엔드에서 이 경로를 처리할 수 있도록 추가했습니다.
 * 
 * 백엔드가 프론트엔드의 redirect_uri를 사용하도록 수정되면 이 파일은 제거해야 합니다.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ApiAuthKakaoCallback() {
  const { token, isNewUser } = useLocalSearchParams<{ token?: string; isNewUser?: string }>();
  const router = useRouter();

  useEffect(() => {
    // 토큰이 있으면 프론트엔드 콜백 라우트로 리다이렉트
    if (token) {
      const params = new URLSearchParams({ token });
      if (isNewUser) {
        params.append('isNewUser', isNewUser);
      }
      router.replace(`/auth/callback?${params.toString()}`);
    } else {
      // 토큰이 없으면 로그인 페이지로
      router.replace('/(auth)/login');
    }
  }, [token, isNewUser, router]);

  // 리다이렉트 중 표시할 내용 (빈 화면)
  return null;
}

