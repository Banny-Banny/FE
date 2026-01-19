/**
 * components/customer-service/components/chat-header/types.ts
 * 채팅 헤더 컴포넌트 Props 타입 정의
 */

import { ConnectionStatus } from '../../../types';

export interface ChatHeaderProps {
  title?: string;
  connectionStatus: ConnectionStatus;
  onBack?: () => void;
}
