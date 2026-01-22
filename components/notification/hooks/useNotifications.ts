/**
 * Notifications API Hook
 * Version: 2.0.0 (React Query)
 * Created: 2025-01-XX
 *
 * [Business Logic] 알림 목록 조회 API 통신
 * - 알림 목록 조회 (GET /api/me/notifications)
 * - 최신순 정렬 (서버에서 처리)
 * - 페이지네이션 지원 (limit, offset)
 * - React Query로 캐싱 및 중복 요청 방지
 */

import { API_ENDPOINTS } from '@/commons/constants';
import { apiClient } from '@/utils/apiClient';
import { formatRelativeTime } from '@/utils/format';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { notificationEvents } from '../utils/notificationEvents';
import type {
  Notification,
  NotificationApiResponse,
  NotificationsListResponse,
  NotificationType,
} from '../types';

export interface UseNotificationsReturn {
  notifications: Notification[];
  newNotifications: Notification[];
  oldNotifications: Notification[];
  isLoading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

/**
 * 알림 타입에 따른 아이콘 매핑
 */
const getNotificationIcon = (type: NotificationType): string => {
  const iconMap: Record<string, string> = {
    CAPSULE_OPEN: '💊',
    FRIEND_INVITE: '👥',
    FRIEND_ACCEPTED: '🎉',
    EASTER_EGG_VIEWED: '🥚',
    SYSTEM: '📢', // 관리자 시스템 알림
  };
  return iconMap[type] || '🔔';
};

/**
 * API 응답을 Notification 타입으로 변환
 */
const mapApiResponseToNotification = (item: NotificationApiResponse): Notification => {
  return {
    id: item.id,
    icon: getNotificationIcon(item.type),
    title: item.title,
    description: item.content,
    time: formatRelativeTime(item.createdAt),
    isRead: item.isRead,
    type: item.type,
  };
};

/**
 * 알림 목록 조회 함수 (React Query용)
 */
const fetchNotifications = async (): Promise<Notification[]> => {
  const endpoint = `/${API_ENDPOINTS.AUTH.NOTIFICATIONS}`;
  const response = await apiClient.get<NotificationsListResponse>(endpoint, {
    params: {
      limit: 20,
      offset: 0,
    },
  });

  return response.data.items.map(mapApiResponseToNotification);
};

/**
 * 알림 목록을 관리하는 Hook (React Query)
 *
 * @description
 * - GET /api/me/notifications API를 통해 알림 목록 조회
 * - React Query로 캐싱 및 중복 요청 방지
 * - 페이지네이션 파라미터: limit (기본값: 20), offset (기본값: 0)
 * - 최신순 정렬 (서버에서 처리)
 * - 읽지 않은 알림과 읽은 알림으로 구분
 */
export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 알림 목록 조회
   *
   * @description
   * - GET /api/me/notifications
   * - Query Parameters: limit (기본값: 20), offset (기본값: 0)
   */
  const refreshNotifications = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // API 호출
      const endpoint = `/${API_ENDPOINTS.AUTH.NOTIFICATIONS}`;
      const response = await apiClient.get<NotificationsListResponse>(endpoint, {
        params: {
          limit: 20, // 한 페이지에 표시할 아이템 수
          offset: 0, // 건너뛸 아이템 수
        },
      });

      // API 응답을 Notification 타입으로 변환
      const mappedNotifications = response.data.items.map(mapApiResponseToNotification);

      setNotifications(mappedNotifications);

      // 읽지 않은 알림 개수 새로고침을 위한 이벤트 발생
      notificationEvents.emit();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '알림 목록을 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  /**
   * 초기 알림 목록 로드
   */
  useEffect(() => {
    refreshNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 앱이 포그라운드로 돌아올 때 즉시 알림 목록 새로고침
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // 앱이 포그라운드로 돌아올 때 즉시 새로고침
        refreshNotifications();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshNotifications]);

  /**
   * 푸시 알림 수신 시 즉시 알림 목록 새로고침
   * - usePushNotifications에서 이벤트 발생 시 자동 새로고침
   */
  useEffect(() => {
    const unsubscribe = notificationEvents.subscribe(() => {
      refreshNotifications();
    });

    return unsubscribe;
  }, [refreshNotifications]);

  /**
   * 앱이 포그라운드에 있을 때 주기적으로 알림 목록 확인
   * - 30초마다 자동 새로고침
   * - 앱이 백그라운드에 있으면 중단
   */
  useEffect(() => {
    const interval = setInterval(() => {
      // 앱이 포그라운드에 있을 때만 새로고침
      if (AppState.currentState === 'active') {
        refreshNotifications();
      }
    }, 30000); // 30초마다

    return () => clearInterval(interval);
  }, [refreshNotifications]);

  /**
   * 모든 알림 읽음 처리
   *
   * @description
   * - PATCH /api/me/notifications/read-all
   * - 성공 시 로컬 상태의 모든 알림을 읽음 처리
   * - 읽지 않은 알림 개수도 자동으로 새로고침
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const endpoint = `/${API_ENDPOINTS.AUTH.NOTIFICATIONS_READ_ALL}`;
      await apiClient.patch(endpoint);

      // 로컬 상태 업데이트: 모든 알림을 읽음 처리
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      // 읽지 않은 알림 개수 새로고침을 위한 이벤트 발생
      notificationEvents.emit();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || '알림 읽음 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * 개별 알림 읽음 처리
   *
   * @description
   * - POST /api/me/notifications/{notificationId}/read
   * - 성공 시 로컬 상태의 해당 알림을 읽음 처리
   * - 읽지 않은 알림 개수도 자동으로 새로고침
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const endpoint = `/${API_ENDPOINTS.AUTH.NOTIFICATIONS}/${notificationId}/read`;
      await apiClient.post(endpoint);

      // 로컬 상태 업데이트: 해당 알림을 읽음 처리
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      // 읽지 않은 알림 개수 새로고침을 위한 이벤트 발생
      notificationEvents.emit();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || '알림 읽음 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * 알림 삭제
   *
   * @description
   * - POST /api/me/notifications/{notificationId}/delete
   * - 성공 시 로컬 상태에서 해당 알림 제거
   */
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const endpoint = `/${API_ENDPOINTS.AUTH.NOTIFICATIONS}/${notificationId}/delete`;
      await apiClient.post(endpoint);

      // 로컬 상태 업데이트: 해당 알림 제거
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || '알림 삭제 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * 읽지 않은 알림과 읽은 알림으로 구분
   */
  const newNotifications = notifications.filter((n) => !n.isRead);
  const oldNotifications = notifications.filter((n) => n.isRead);

  return {
    notifications,
    newNotifications,
    oldNotifications,
    isLoading,
    error,
    refreshNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
  };
}
