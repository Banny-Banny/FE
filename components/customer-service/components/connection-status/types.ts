/**
 * components/customer-service/components/connection-status/types.ts
 * 연결 상태 컴포넌트 Props 타입 정의
 */

import { ConnectionStatus } from '../../../types';

export interface ConnectionStatusProps {
  status: ConnectionStatus;
  onReconnect?: () => void;
}
