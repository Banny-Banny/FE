/**
 * components/onboarding/hooks/useLocationConsent.ts
 * 위치 연동 동의 비즈니스 로직 Hook
 */

import { STORAGE_KEYS } from '@/commons/constants';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { completeOnboarding } from '../api/onboarding';

/**
 * 위치 연동 동의 Hook
 * @returns {isLoading, handleConsent, handleSkip}
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

      // 위치 권한 요청 (디바이스 네이티브 팝업)
      const { status } = await Location.requestForegroundPermissionsAsync();
      const locationConsentGranted = status === 'granted';

      if (__DEV__) {
        console.log('[LocationConsent] 위치 권한 상태:', status);
      }

      // 권한이 거부되어도 동의 완료로 처리 (사용자가 나중에 설정에서 변경 가능)
      // 로컬 스토리지에 저장
      await completeLocationConsent();

      // 친구 동의 상태 확인
      const friendConsent = (await AsyncStorage.getItem(STORAGE_KEYS.FRIEND_CONSENT)) === 'true';

      if (__DEV__) {
        console.log('[LocationConsent] 동의 상태 확인:', {
          friendConsent,
          locationConsent: locationConsentGranted,
        });
      }

      // 모든 동의가 완료되었는지 확인
      if (friendConsent) {
        // 마지막 동의 완료 시 API 호출 (한 번만)
        try {
          await completeOnboarding(friendConsent, locationConsentGranted);

          if (__DEV__) {
            console.log('[LocationConsent] 온보딩 완료 API 호출 성공');
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
            console.error('[LocationConsent] 온보딩 완료 API 호출 실패:', apiError);
          }
          // API 실패해도 로컬 저장은 완료되었으므로 계속 진행
        }
      } else {
        // 친구 동의가 아직 완료되지 않은 경우 (이론적으로는 발생하지 않아야 함)
        if (__DEV__) {
          console.warn('[LocationConsent] 친구 동의가 아직 완료되지 않음');
        }
      }

      // 자동 리다이렉트는 AuthProvider에서 처리
      // 온보딩 완료 후 초대코드가 있으면 대기실로 이동
      const pendingInviteCode = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_INVITE_CODE);
      if (pendingInviteCode) {
        console.log(
          '🔗 [LocationConsent] 온보딩 완료 후 초대코드 발견 → 대기실로 이동:',
          pendingInviteCode,
        );
        await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_INVITE_CODE);
        router.replace(`/room/join?invite_code=${pendingInviteCode}`);
        return;
      }

      // 초대코드가 없으면 AuthProvider가 자동으로 메인으로 리다이렉트
    } catch (error) {
      // 동의 처리 오류 처리
      if (__DEV__) {
        console.error('[LocationConsent] 위치 동의 처리 중 오류:', error);
      }

      Alert.alert('오류', '위치 권한 요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [completeLocationConsent, router]);

  /**
   * 위치 권한 건너뛰기 처리 (권한 거부)
   */
  const handleSkip = useCallback(async () => {
    try {
      setIsLoading(true);

      // 위치 권한을 false로 처리
      const locationConsentGranted = false;

      // 로컬 스토리지에 저장
      await completeLocationConsent();

      // 친구 동의 상태 확인
      const friendConsent = (await AsyncStorage.getItem(STORAGE_KEYS.FRIEND_CONSENT)) === 'true';

      if (__DEV__) {
        console.log('[LocationConsent] 건너뛰기 - 동의 상태 확인:', {
          friendConsent,
          locationConsent: locationConsentGranted,
        });
      }

      // 모든 동의가 완료되었는지 확인
      if (friendConsent) {
        // 마지막 동의 완료 시 API 호출 (한 번만)
        try {
          await completeOnboarding(friendConsent, locationConsentGranted);

          if (__DEV__) {
            console.log('[LocationConsent] 온보딩 완료 API 호출 성공 (건너뛰기)');
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
            console.error('[LocationConsent] 온보딩 완료 API 호출 실패:', apiError);
          }
          // API 실패해도 로컬 저장은 완료되었으므로 계속 진행
        }
      } else {
        // 친구 동의가 아직 완료되지 않은 경우 (이론적으로는 발생하지 않아야 함)
        if (__DEV__) {
          console.warn('[LocationConsent] 친구 동의가 아직 완료되지 않음');
        }
      }

      // 자동 리다이렉트는 AuthProvider에서 처리
      // 온보딩 완료 후 초대코드가 있으면 대기실로 이동
      const pendingInviteCode = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_INVITE_CODE);
      if (pendingInviteCode) {
        console.log(
          '🔗 [LocationConsent] 온보딩 완료 후 초대코드 발견 → 대기실로 이동:',
          pendingInviteCode,
        );
        await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_INVITE_CODE);
        router.replace(`/room/join?invite_code=${pendingInviteCode}`);
        return;
      }

      // 초대코드가 없으면 AuthProvider가 자동으로 메인으로 리다이렉트
    } catch (error) {
      // 동의 처리 오류 처리
      if (__DEV__) {
        console.error('[LocationConsent] 건너뛰기 처리 중 오류:', error);
      }

      Alert.alert('오류', '처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [completeLocationConsent, router]);

  return {
    isLoading,
    handleConsent,
    handleSkip,
  };
}
