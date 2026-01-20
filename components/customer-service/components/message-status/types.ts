/**
 * components/customer-service/components/message-status/types.ts
 * 메시지 상태 컴포넌트 Props 타입 정의
 */

export interface MessageStatusProps {
  status: 'sending' | 'sent' | 'failed';
  isRead?: boolean;
  onRetry?: () => void;
}
