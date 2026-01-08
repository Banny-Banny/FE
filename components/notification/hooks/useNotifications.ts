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
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
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
}

/**
 * 알림 타입에 따른 아이콘 매핑
 */
const getNotificationIcon = (type: NotificationType): string => {
  const iconMap: Record<string, string> = {
    CAPSULE_OPEN: '🥚',
    FRIEND_INVITE: '👋',
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
  // React Query로 알림 목록 조회
  const {
    data: notifications = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 30 * 1000, // 30초 동안 fresh 상태 유지
    gcTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });

  // 에러 메시지 변환
  const error = queryError
    ? (queryError as any).response?.data?.message ||
      (queryError as Error).message ||
      '알림 목록을 불러오는 중 오류가 발생했습니다.'
    : null;

  /**
   * 읽지 않은 알림과 읽은 알림으로 구분 (useMemo로 최적화)
   */
  const newNotifications = useMemo(() => notifications.filter((n) => !n.isRead), [notifications]);

  const oldNotifications = useMemo(() => notifications.filter((n) => n.isRead), [notifications]);

  /**
   * 수동 새로고침 함수
   */
  const refreshNotifications = async () => {
    await refetch();
  };

  return {
    notifications,
    newNotifications,
    oldNotifications,
    isLoading,
    error,
    refreshNotifications,
  };
}
