/**
 * components/onboarding/hooks/useOnboardingFlow.ts
 * 온보딩 플로우 단계 관리 Hook
 * AuthProvider의 onboardingStatus와 연동하여 현재 단계 결정
 */

import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { useEffect, useState } from 'react';
import { useKakaoLogin } from './useKakaoLogin';
import { useFriendConsent } from './useFriendConsent';
import { useLocationConsent } from './useLocationConsent';

export type OnboardingStep = 'login' | 'friend-consent' | 'location-consent' | 'complete';

/**
 * 온보딩 플로우 단계 관리 Hook
 * @returns {currentStep, login, friendConsent, locationConsent}
 */
export function useOnboardingFlow() {
  const { onboardingStatus, accessToken } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('login');

  // AuthProvider 상태에 따라 현재 단계 결정
  useEffect(() => {
    if (!accessToken) {
      setCurrentStep('login');
    } else if (!onboardingStatus.isFriendConsentDone) {
      setCurrentStep('friend-consent');
    } else if (!onboardingStatus.isLocationConsentDone) {
      setCurrentStep('location-consent');
    } else {
      setCurrentStep('complete');
    }
  }, [accessToken, onboardingStatus]);

  // 각 단계별 hook
  const login = useKakaoLogin();
  const friendConsent = useFriendConsent();
  const locationConsent = useLocationConsent();

  return {
    currentStep,
    login,
    friendConsent,
    locationConsent,
  };
}

