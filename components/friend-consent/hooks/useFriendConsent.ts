/**
 * components/friend-consent/hooks/useFriendConsent.ts
 * 친구 연동 동의 비즈니스 로직 Hook
 */

import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { useCallback, useState } from 'react';

/**
 * 친구 연동 동의 Hook
 * @returns {isLoading, handleConsent}
 */
export function useFriendConsent() {
  const [isLoading, setIsLoading] = useState(false);
  const { completeFriendConsent } = useAuth();

  /**
   * 친구 연동 동의 처리
   */
  const handleConsent = useCallback(async () => {
    try {
      setIsLoading(true);
      await completeFriendConsent();
      // 자동 리다이렉트는 AuthProvider에서 처리
    } catch (error) {
      if (__DEV__) console.error('[FriendConsent] 동의 처리 오류:', error);
    } finally {
      setIsLoading(false);
    }
  }, [completeFriendConsent]);

  return {
    isLoading,
    handleConsent,
  };
}

