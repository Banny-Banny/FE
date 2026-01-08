/**
 * egg/constants/MOCK_DATA.d.ts
 * MOCK_DATA.js 타입 선언 파일
 */

export interface Friend {
  id: string;
  name: string;
  emoji: string;
  isBlocked: boolean;
}

export interface NotificationData {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

export const DEFAULT_FRIENDS: Friend[];
export const DEFAULT_NEW_NOTIFICATIONS: NotificationData[];
export const DEFAULT_OLD_NOTIFICATIONS: NotificationData[];
