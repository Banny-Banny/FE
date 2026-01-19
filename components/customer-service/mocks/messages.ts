/**
 * components/customer-service/mocks/messages.ts
 * 채팅 메시지 Mock 데이터
 */

import { ChatMessage, SenderType } from '../types';

/**
 * inquiryId별 Mock 메시지 데이터
 */
export const mockMessagesByInquiry: Record<string, ChatMessage[]> = {
  'inquiry-1': [
    {
      id: 'msg-1-1',
      customer_service_id: 'inquiry-1',
      sender_type: 'USER' as SenderType,
      sender_user_id: 'user-1',
      content: '결제가 정상적으로 완료되었는지 확인하고 싶습니다.',
      is_read_by_admin: true,
      is_read_by_user: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 'msg-1-2',
      customer_service_id: 'inquiry-1',
      sender_type: 'ADMIN' as SenderType,
      sender_admin_id: 'admin-1',
      content: '안녕하세요. 결제 내역을 확인해보니 정상적으로 완료되었습니다.',
      is_read_by_admin: true,
      is_read_by_user: false,
      created_at: '2024-01-15T10:15:00Z',
      updated_at: '2024-01-15T10:15:00Z',
    },
    {
      id: 'msg-1-3',
      customer_service_id: 'inquiry-1',
      sender_type: 'USER' as SenderType,
      sender_user_id: 'user-1',
      content: '감사합니다!',
      is_read_by_admin: false,
      is_read_by_user: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
    },
  ],
  'inquiry-2': [
    {
      id: 'msg-2-1',
      customer_service_id: 'inquiry-2',
      sender_type: 'USER' as SenderType,
      sender_user_id: 'user-1',
      content: '타임캡슐을 어떻게 만드는지 모르겠어요.',
      is_read_by_admin: true,
      is_read_by_user: true,
      created_at: '2024-01-14T14:00:00Z',
      updated_at: '2024-01-14T14:00:00Z',
    },
    {
      id: 'msg-2-2',
      customer_service_id: 'inquiry-2',
      sender_type: 'ADMIN' as SenderType,
      sender_admin_id: 'admin-1',
      content: '타임캡슐 생성 방법을 안내해드리겠습니다.',
      is_read_by_admin: true,
      is_read_by_user: true,
      created_at: '2024-01-14T14:30:00Z',
      updated_at: '2024-01-14T14:30:00Z',
    },
    {
      id: 'msg-2-3',
      customer_service_id: 'inquiry-2',
      sender_type: 'ADMIN' as SenderType,
      sender_admin_id: 'admin-1',
      content: '홈 화면에서 "+" 버튼을 누르시면 타임캡슐을 생성할 수 있습니다.',
      is_read_by_admin: true,
      is_read_by_user: true,
      created_at: '2024-01-14T15:00:00Z',
      updated_at: '2024-01-14T15:00:00Z',
    },
    {
      id: 'msg-2-4',
      customer_service_id: 'inquiry-2',
      sender_type: 'USER' as SenderType,
      sender_user_id: 'user-1',
      content: '알겠습니다. 감사합니다!',
      is_read_by_admin: true,
      is_read_by_user: true,
      created_at: '2024-01-14T15:20:00Z',
      updated_at: '2024-01-14T15:20:00Z',
    },
  ],
  'inquiry-3': [
    {
      id: 'msg-3-1',
      customer_service_id: 'inquiry-3',
      sender_type: 'USER' as SenderType,
      sender_user_id: 'user-1',
      content: '배송이 언제 도착하나요?',
      is_read_by_admin: true,
      is_read_by_user: true,
      created_at: '2024-01-13T10:00:00Z',
      updated_at: '2024-01-13T10:00:00Z',
    },
    {
      id: 'msg-3-2',
      customer_service_id: 'inquiry-3',
      sender_type: 'ADMIN' as SenderType,
      sender_admin_id: 'admin-1',
      content: '배송은 주문 완료 후 3-5일 소요됩니다.',
      is_read_by_admin: true,
      is_read_by_user: true,
      created_at: '2024-01-13T11:00:00Z',
      updated_at: '2024-01-13T11:00:00Z',
    },
  ],
  'inquiry-4': [
    {
      id: 'msg-4-1',
      customer_service_id: 'inquiry-4',
      sender_type: 'USER' as SenderType,
      sender_user_id: 'user-1',
      content: '계정을 삭제하고 싶습니다.',
      is_read_by_admin: true,
      is_read_by_user: true,
      created_at: '2024-01-10T08:00:00Z',
      updated_at: '2024-01-10T08:00:00Z',
    },
    {
      id: 'msg-4-2',
      customer_service_id: 'inquiry-4',
      sender_type: 'ADMIN' as SenderType,
      sender_admin_id: 'admin-1',
      content: '계정 삭제가 완료되었습니다.',
      is_read_by_admin: true,
      is_read_by_user: true,
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-10T09:00:00Z',
    },
  ],
};

/**
 * inquiryId로 메시지 목록 조회
 */
export const getMockMessagesByInquiryId = (inquiryId: string): ChatMessage[] => {
  return mockMessagesByInquiry[inquiryId] || [];
};
