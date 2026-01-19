/**
 * components/customer-service/components/chat-message-list/types.ts
 * 채팅 메시지 리스트 컴포넌트 Props 타입 정의
 */

import { ChatMessageWithStatus } from '../../types';

export interface MessageBubbleProps {
  message: ChatMessageWithStatus;
  showTime?: boolean;
  showStatus?: boolean;
}

export interface MessageTimeProps {
  timestamp: string;
}

export interface MessageStatusProps {
  status: 'sending' | 'sent' | 'failed';
  isRead?: boolean;
}

export interface ChatMessageListProps {
  messages: ChatMessageWithStatus[];
  onLoadMore?: () => void;
  isLoading?: boolean;
}
