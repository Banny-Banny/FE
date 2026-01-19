/**
 * components/customer-service/types.ts
 * 고객센터 기능 관련 타입 정의
 */

/**
 * 문의 상태 enum
 */
export type InquiryStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

/**
 * 발신자 타입 enum
 */
export type SenderType = 'USER' | 'ADMIN';

/**
 * 메시지 전송 상태
 */
export type MessageStatus = 'sending' | 'sent' | 'failed';

/**
 * WebSocket 연결 상태
 */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * 문의 타입
 */
export interface Inquiry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  admin_reply?: string;
  is_resolved: boolean;
  status: InquiryStatus;
  last_message_at?: string; // ISO 8601 형식
  last_message_preview?: string;
  created_at: string; // ISO 8601 형식
  updated_at: string; // ISO 8601 형식
  deleted_at?: string; // ISO 8601 형식
}

/**
 * 채팅 메시지 타입
 */
export interface ChatMessage {
  id: string;
  customer_service_id: string; // inquiry_id
  sender_type: SenderType;
  sender_user_id?: string;
  sender_admin_id?: string;
  content: string;
  is_read_by_admin: boolean;
  is_read_by_user: boolean;
  created_at: string; // ISO 8601 형식
  updated_at: string; // ISO 8601 형식
  deleted_at?: string; // ISO 8601 형식
}

/**
 * 메시지 전송 상태가 포함된 메시지 타입 (UI용)
 */
export interface ChatMessageWithStatus extends ChatMessage {
  status?: MessageStatus;
}
