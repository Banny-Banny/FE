/**
 * components/onboarding/index.tsx
 * 온보딩 플로우 Feature Container
 * - 로그인 → 친구 연동 동의 → 위치 연동 동의 순서로 진행
 */

import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { getUserFromToken } from '@/utils';
import { FriendConsentStep } from './components/friend-consent-step';
import { LocationConsentStep } from './components/location-consent-step';
import { LoginStep } from './components/login-step';
import { useOnboardingFlow } from './hooks/useOnboardingFlow';

/**
 * 온보딩 Feature Container
 * - 비즈니스 로직(Hook) + UI 컴포넌트 연결
 * - AuthProvider 상태에 따라 현재 단계 자동 결정
 */
export default function OnboardingFeature() {
  const { currentStep, login, friendConsent, locationConsent } = useOnboardingFlow();
  const { login: authLogin } = useAuth();

  // 로그인 핸들러 (토큰 처리 포함)
  const handleKakaoLogin = async () => {
    const result = await login.loginWithKakao();

    // 웹 환경이거나 취소/에러인 경우
    if (!result || !result.token) {
      if (__DEV__) {
        console.warn('[Onboarding] 로그인 결과 없음:', result);
      }
      return;
    }

    if (__DEV__) {
      console.log('[Onboarding] 로그인 토큰 받음:', {
        tokenLength: result.token.length,
        tokenPreview: result.token.substring(0, 20) + '...',
        isNewUser: result.isNewUser,
      });
    }

    // 토큰으로 유저 정보 추출
    const userData = getUserFromToken(result.token);
    if (!userData) {
      if (__DEV__) {
        console.error('[Onboarding] 토큰에서 유저 정보 추출 실패');
      }
      return;
    }

    if (__DEV__) {
      console.log('[Onboarding] 유저 정보 추출 성공:', userData);
    }

    // 로그인 처리 (Provider가 자동으로 다음 단계로 리다이렉트)
    await authLogin(result.token, userData);

    if (__DEV__) {
      console.log('[Onboarding] 로그인 처리 완료');
    }
  };

  // 단계별 컴포넌트 렌더링
  switch (currentStep) {
    case 'login':
      return <LoginStep isLoading={login.isLoading} onKakaoLogin={handleKakaoLogin} />;
    case 'friend-consent':
      return (
        <FriendConsentStep
          isLoading={friendConsent.isLoading}
          onConsent={friendConsent.handleConsent}
        />
      );
    case 'location-consent':
      return (
        <LocationConsentStep
          isLoading={locationConsent.isLoading}
          onConsent={locationConsent.handleConsent}
        />
      );
    case 'complete':
      // 완료 시 AuthProvider가 자동으로 메인으로 리다이렉트
      return null;
    default:
      return null;
  }
}
