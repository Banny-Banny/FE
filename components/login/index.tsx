/**
 * components/login/index.tsx
 * 로그인 Feature Container
 */

import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { getUserFromToken } from '@/utils';
import { LoginForm } from './components/login-form';
import { useKakaoLogin } from './hooks/useKakaoLogin';

/**
 * 로그인 Feature Container
 * - 비즈니스 로직(Hook) + UI 컴포넌트 연결
 */
export default function LoginFeature() {
  const { isLoading, loginWithKakao } = useKakaoLogin();
  const { login } = useAuth();

  const handleKakaoLogin = async () => {
    const result = await loginWithKakao();

    // 웹 환경이거나 취소/에러인 경우
    if (!result || !result.token) {
      return;
    }

    // 토큰으로 유저 정보 추출
    const userData = getUserFromToken(result.token);
    if (!userData) {
      return;
    }

    // 로그인 처리 (Provider가 자동으로 메인 페이지로 리다이렉트)
    await login(result.token, userData);
  };

  return <LoginForm isLoading={isLoading} onKakaoLogin={handleKakaoLogin} />;
}
