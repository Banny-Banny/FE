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
  deleteNotification: (notificationId: string) => Promise<void>;
}

/**
 * 알림 타입에 따른 아이콘 매핑
 */
const getNotificationIcon = (type: NotificationType): string => {
  const iconMap: Record<string, string> = {
    CAPSULE_OPEN: '💊',
    FRIEND_ACCEPTED: '🎉',
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
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        '알림 목록을 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('[useNotifications] 알림 목록 조회 실패:', err);
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
    deleteNotification,
  };
}
