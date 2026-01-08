/**
 * components/notification/types.ts
 * 알림 Feature 타입 정의
 */

/**
 * 알림 타입
 */
export type NotificationType = 'CAPSULE_OPEN' | 'FRIEND_INVITE' | string;

/**
 * API 응답 알림 아이템
 */
export interface NotificationApiResponse {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

/**
 * 알림 목록 API 응답
 */
export interface NotificationsListResponse {
  items: NotificationApiResponse[];
}

/**
 * UI에서 사용하는 알림 타입
 */
export interface Notification {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

/**
 * 알림 아이템 컴포넌트 Props
 */
export interface NotificationItemProps {
  icon: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  onDelete?: () => void;
}

