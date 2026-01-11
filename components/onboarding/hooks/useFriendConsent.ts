/**
 * components/onboarding/hooks/useFriendConsent.ts
 * 친구 연동 동의 비즈니스 로직 Hook
 */

import { STORAGE_KEYS } from '@/commons/constants';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { completeOnboarding } from '../api/onboarding';

/**
 * 친구 연동 동의 Hook
 * @returns {isLoading, handleConsent, handleSkip}
 */
export function useFriendConsent() {
  const [isLoading, setIsLoading] = useState(false);
  const { completeFriendConsent } = useAuth();
  const router = useRouter();

  /**
   * 친구 연동 동의 처리
   */
  const handleConsent = useCallback(async () => {
    try {
      setIsLoading(true);

      // 친구 동의를 true로 처리
      const friendConsent = true;

      // 로컬 스토리지에 저장
      await completeFriendConsent();

      // 위치 동의 상태 확인
      const locationConsent = (await AsyncStorage.getItem(STORAGE_KEYS.LOCATION_CONSENT)) === 'true';

      if (__DEV__) {
        console.log('[FriendConsent] 동의 상태 확인:', {
          friendConsent,
          locationConsent,
        });
      }

      // 모든 동의가 완료되었는지 확인
      if (locationConsent) {
        // 마지막 동의 완료 시 API 호출 (한 번만)
        try {
          await completeOnboarding(friendConsent, locationConsent);

          if (__DEV__) {
            console.log('[FriendConsent] 온보딩 완료 API 호출 성공');
          }
        } catch (apiError) {
          // API 호출 실패 시 사용자에게 알림
          const errorMessage =
            apiError instanceof Error
              ? apiError.message
              : '온보딩 완료 처리 중 오류가 발생했습니다.';

          Alert.alert(
            '알림',
            errorMessage + '\n\n앱은 정상적으로 사용할 수 있지만, 일부 기능이 제한될 수 있습니다.',
            [{ text: '확인' }],
          );

          if (__DEV__) {
            console.error('[FriendConsent] 온보딩 완료 API 호출 실패:', apiError);
          }
          // API 실패해도 로컬 저장은 완료되었으므로 계속 진행
        }
      } else {
        // 위치 동의가 아직 완료되지 않은 경우 (정상적인 플로우)
        if (__DEV__) {
          console.log('[FriendConsent] 위치 동의가 아직 완료되지 않음 - 다음 단계로 진행');
        }
      }

      // 자동 리다이렉트는 AuthProvider에서 처리
    } catch (error) {
      // 동의 처리 오류 처리
      if (__DEV__) {
        console.error('[FriendConsent] 친구 동의 처리 중 오류:', error);
      }
      Alert.alert('오류', '처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [completeFriendConsent]);

  /**
   * 친구 연동 건너뛰기 처리 (권한 거부)
   */
  const handleSkip = useCallback(async () => {
    try {
      setIsLoading(true);

      // 친구 동의를 false로 저장 (로컬 스토리지에 저장하지 않고 바로 API 호출)
      // 위치 동의 상태 확인
      const locationConsent = (await AsyncStorage.getItem(STORAGE_KEYS.LOCATION_CONSENT)) === 'true';

      // 위치 동의가 완료되어 있으면 바로 API 호출
      if (locationConsent) {
        try {
          await completeOnboarding(false, locationConsent);

          if (__DEV__) {
            console.log('[FriendConsent] 온보딩 완료 API 호출 성공 (건너뛰기)');
          }
        } catch (apiError) {
          const errorMessage =
            apiError instanceof Error
              ? apiError.message
              : '온보딩 완료 처리 중 오류가 발생했습니다.';

          Alert.alert(
            '알림',
            errorMessage + '\n\n앱은 정상적으로 사용할 수 있지만, 일부 기능이 제한될 수 있습니다.',
            [{ text: '확인' }],
          );

          if (__DEV__) {
            console.error('[FriendConsent] 온보딩 완료 API 호출 실패:', apiError);
          }
        }
      }

      // 친구 동의 완료 처리 (다음 단계로 이동하기 위해)
      await completeFriendConsent();
    } catch (error) {
      if (__DEV__) {
        console.error('[FriendConsent] 건너뛰기 처리 중 오류:', error);
      }
      Alert.alert('오류', '처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [completeFriendConsent, router]);

  return {
    isLoading,
    handleConsent,
    handleSkip,
  };
}

