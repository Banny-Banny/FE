/**
 * components/onboarding/hooks/useLocationConsent.ts
 * 위치 연동 동의 비즈니스 로직 Hook
 */

import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { useCallback, useState } from 'react';
import * as Location from 'expo-location';

/**
 * 위치 연동 동의 Hook
 * @returns {isLoading, handleConsent}
 */
export function useLocationConsent() {
  const [isLoading, setIsLoading] = useState(false);
  const { completeLocationConsent } = useAuth();

  /**
   * 위치 권한 요청 및 동의 처리
   */
  const handleConsent = useCallback(async () => {
    try {
      setIsLoading(true);

      // 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // 권한이 거부되어도 동의 완료로 처리 (사용자가 나중에 설정에서 변경 가능)
      }

      await completeLocationConsent();
      // 자동 리다이렉트는 AuthProvider에서 처리
    } catch (error) {
      // 동의 처리 오류 처리
    } finally {
      setIsLoading(false);
    }
  }, [completeLocationConsent]);

  return {
    isLoading,
    handleConsent,
  };
}

