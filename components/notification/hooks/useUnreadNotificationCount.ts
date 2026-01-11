/**
 * components/notification/hooks/useUnreadNotificationCount.ts
 * 읽지 않은 알림 개수 조회 Hook
 *
 * [Business Logic] 읽지 않은 알림 개수 조회 API 통신
 * - GET /api/me/notifications/unread-count
 * - 앱이 포그라운드로 돌아올 때 자동 새로고침
 * - 푸시 알림 수신 시 자동 새로고침
 */

import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { API_ENDPOINTS } from '@/commons/constants';
import { apiClient } from '@/utils/apiClient';
import { notificationEvents } from '../utils/notificationEvents';

export interface UnreadNotificationCountResponse {
  count: number;
}

/**
 * 읽지 않은 알림 개수를 조회하는 Hook
 *
 * @description
 * - GET /api/me/notifications/unread-count API를 통해 읽지 않은 알림 개수 조회
 * - 앱이 포그라운드로 돌아올 때 자동 새로고침
 * - 푸시 알림 수신 시 자동 새로고침
 */
export function useUnreadNotificationCount() {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 읽지 않은 알림 개수 조회
   */
  const fetchUnreadCount = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoint = `/${API_ENDPOINTS.AUTH.NOTIFICATIONS_UNREAD_COUNT}`;
      const response = await apiClient.get<UnreadNotificationCountResponse>(endpoint);

      setCount(response.data.count);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '읽지 않은 알림 개수를 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('[useUnreadNotificationCount] 읽지 않은 알림 개수 조회 실패:', err);
      // 에러 발생 시에도 0으로 설정하여 UI가 깨지지 않도록 함
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 초기 알림 개수 로드
   */
  useEffect(() => {
    fetchUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 앱이 포그라운드로 돌아올 때 즉시 알림 개수 새로고침
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        fetchUnreadCount();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  /**
   * 푸시 알림 수신 시 즉시 알림 개수 새로고침
   * - usePushNotifications에서 이벤트 발생 시 자동 새로고침
   */
  useEffect(() => {
    const unsubscribe = notificationEvents.subscribe(() => {
      fetchUnreadCount();
    });

    return unsubscribe;
  }, []);

  return {
    count,
    isLoading,
    error,
    refreshCount: fetchUnreadCount,
  };
}

