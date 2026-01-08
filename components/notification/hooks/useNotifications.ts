/**
 * Notifications API Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 알림 목록 조회 API 통신
 * - 알림 목록 조회 (GET /api/me/notifications)
 * - 최신순 정렬 (서버에서 처리)
 * - 페이지네이션 지원 (limit, offset)
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
 * 알림 목록을 관리하는 Hook
 *
 * @description
 * - GET /api/me/notifications API를 통해 알림 목록 조회
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
   * 모든 알림 읽음 처리
   *
   * @description
   * - POST /api/me/notifications/{notificationId}/read API를 사용
   * - 읽지 않은 모든 알림에 대해 개별적으로 읽음 처리 API 호출
   * - 성공 시 알림 목록 자동 갱신
   */
  const markAllAsRead = useCallback(async () => {
    try {
      // 읽지 않은 알림들의 ID 수집
      const unreadNotificationIds = notifications
        .filter((notification) => !notification.isRead)
        .map((notification) => notification.id);

      // 읽지 않은 알림이 없으면 종료
      if (unreadNotificationIds.length === 0) {
        return;
      }

      // 모든 읽지 않은 알림에 대해 읽음 처리 API 호출 (병렬 처리)
      const readPromises = unreadNotificationIds.map((notificationId) => {
        const endpoint = `/${API_ENDPOINTS.AUTH.NOTIFICATIONS}/${notificationId}/read`;
        return apiClient.post(endpoint);
      });

      await Promise.all(readPromises);

      // 성공 시 알림 목록 갱신
      await refreshNotifications();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || '알림 읽음 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('[useNotifications] 알림 읽음 처리 실패:', err);
      throw err;
    }
  }, [notifications, refreshNotifications]);

  /**
   * 알림 삭제
   *
   * @description
   * - DELETE /api/me/notifications/{notificationId} API를 우선 시도
   * - 404/405일 경우 POST /delete, POST /remove 순차 시도
   * - 모두 실패하면 로컬 상태에서 제거해 UI만 갱신 (서버 미지원 대비)
   */
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      const deleteEndpoints = [
        {
          method: 'delete' as const,
          path: `/${API_ENDPOINTS.AUTH.NOTIFICATIONS}/${notificationId}`,
        },
        {
          method: 'post' as const,
          path: `/${API_ENDPOINTS.AUTH.NOTIFICATIONS}/${notificationId}/delete`,
        },
        {
          method: 'post' as const,
          path: `/${API_ENDPOINTS.AUTH.NOTIFICATIONS}/${notificationId}/remove`,
        },
      ];

      let succeeded = false;

      for (const { method, path } of deleteEndpoints) {
        try {
          if (method === 'delete') {
            await apiClient.delete(path);
          } else {
            await apiClient.post(path);
          }
          succeeded = true;
          break;
        } catch (err: any) {
          const status = err.response?.status;
          if (status === 404 || status === 405) {
            // 다음 엔드포인트로 fallback
            continue;
          }
          // 기타 오류는 즉시 중단
          throw err;
        }
      }

      if (!succeeded) {
        // 서버가 삭제 API를 지원하지 않을 때: 로컬 상태만 제거하여 UI 갱신
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        console.warn('[useNotifications] 서버 삭제 API 미지원으로 로컬에서만 제거했습니다.');
        return;
      }

      // 성공 시 알림 목록 갱신
      await refreshNotifications();
    },
    [refreshNotifications],
  );

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
