/**
 * components/mypage/components/notification/types.ts
 * 알림 컴포넌트 타입 정의
 */

export interface Notification {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

export interface NotificationItemProps {
  icon: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  onDelete?: () => void;
}
