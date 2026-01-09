/**
 * components/onboarding/hooks/useLocationConsent.ts
 * 위치 연동 동의 비즈니스 로직 Hook
 */

import { STORAGE_KEYS } from '@/commons/constants';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import * as Location from 'expo-location';

/**
 * 위치 연동 동의 Hook
 * @returns {isLoading, handleConsent}
 */
export function useLocationConsent() {
  const [isLoading, setIsLoading] = useState(false);
  const { completeLocationConsent } = useAuth();
  const router = useRouter();

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

      // 온보딩 완료 후 초대코드가 있으면 대기실로 이동
      const pendingInviteCode = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_INVITE_CODE);
      if (pendingInviteCode) {
        console.log('🔗 [LocationConsent] 온보딩 완료 후 초대코드 발견 → 대기실로 이동:', pendingInviteCode);
        await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_INVITE_CODE);
        router.replace(`/room/join?invite_code=${pendingInviteCode}`);
        return;
      }

      // 초대코드가 없으면 AuthProvider가 자동으로 메인으로 리다이렉트
    } catch (error) {
      // 동의 처리 오류 처리
    } finally {
      setIsLoading(false);
    }
  }, [completeLocationConsent, router]);

  return {
    isLoading,
    handleConsent,
  };
}

