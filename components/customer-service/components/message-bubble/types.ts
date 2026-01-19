/**
 * components/customer-service/components/message-bubble/types.ts
 * 메시지 버블 컴포넌트 Props 타입 정의
 */

import { ChatMessageWithStatus } from '../../types';

export interface MessageBubbleProps {
  message: ChatMessageWithStatus;
  showTime?: boolean;
  showStatus?: boolean;
  onRetry?: (messageId: string) => void;
}
