/**
 * components/notification/utils/notificationEvents.ts
 * 알림 이벤트 관리 유틸리티
 *
 * @description
 * - 푸시 알림 수신 시 알림 목록 새로고침을 위한 이벤트 시스템
 * - usePushNotifications와 useNotifications 간 통신
 */

type NotificationRefreshListener = () => void;

class NotificationEventEmitter {
  private listeners: Set<NotificationRefreshListener> = new Set();

  /**
   * 알림 목록 새로고침 이벤트 구독
   */
  subscribe(listener: NotificationRefreshListener): () => void {
    this.listeners.add(listener);
    // 구독 해제 함수 반환
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 알림 목록 새로고침 이벤트 발생
   */
  emit(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
      }
    });
  }
}

// 싱글톤 인스턴스
export const notificationEvents = new NotificationEventEmitter();

