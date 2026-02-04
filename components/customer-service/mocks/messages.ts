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
  // 파일 첨부가 포함된 Mock 메시지 샘플
  'inquiry-5': [
    {
      id: 'msg-5-1',
      customer_service_id: 'inquiry-5',
      sender_type: 'USER' as SenderType,
      sender_user_id: 'user-1',
      content: '이미지를 첨부했습니다. 확인 부탁드립니다.',
      attachments: [
        {
          id: 'att-5-1-1',
          type: 'IMAGE' as const,
          name: 'screenshot.png',
          url: 'https://picsum.photos/400/300?random=1',
          size: 1024 * 512, // 512KB
          mimeType: 'image/png',
        },
      ],
      is_read_by_admin: false,
      is_read_by_user: true,
      created_at: '2024-01-16T10:00:00Z',
      updated_at: '2024-01-16T10:00:00Z',
    },
    {
      id: 'msg-5-2',
      customer_service_id: 'inquiry-5',
      sender_type: 'USER' as SenderType,
      sender_user_id: 'user-1',
      content: '파일도 첨부합니다.',
      attachments: [
        {
          id: 'att-5-2-1',
          type: 'FILE' as const,
          name: 'document.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: 1024 * 1024 * 2, // 2MB
          mimeType: 'application/pdf',
        },
      ],
      is_read_by_admin: false,
      is_read_by_user: true,
      created_at: '2024-01-16T10:05:00Z',
      updated_at: '2024-01-16T10:05:00Z',
    },
    {
      id: 'msg-5-3',
      customer_service_id: 'inquiry-5',
      sender_type: 'USER' as SenderType,
      sender_user_id: 'user-1',
      content: '', // 텍스트 없이 이미지만 첨부하는 경우
      attachments: [
        {
          id: 'att-5-3-1',
          type: 'IMAGE' as const,
          name: 'photo.jpg',
          url: 'https://picsum.photos/400/300?random=2',
          size: 1024 * 768, // 768KB
          mimeType: 'image/jpeg',
        },
        {
          id: 'att-5-3-2',
          type: 'IMAGE' as const,
          name: 'photo2.jpg',
          url: 'https://picsum.photos/400/300?random=3',
          size: 1024 * 900, // 900KB
          mimeType: 'image/jpeg',
        },
      ],
      is_read_by_admin: false,
      is_read_by_user: true,
      created_at: '2024-01-16T10:10:00Z',
      updated_at: '2024-01-16T10:10:00Z',
    },
    {
      id: 'msg-5-4',
      customer_service_id: 'inquiry-5',
      sender_type: 'ADMIN' as SenderType,
      sender_admin_id: 'admin-1',
      content: '첨부해주신 파일들을 확인했습니다. 처리해드리겠습니다.',
      is_read_by_admin: true,
      is_read_by_user: false,
      created_at: '2024-01-16T10:20:00Z',
      updated_at: '2024-01-16T10:20:00Z',
    },
  ],
};

/**
 * inquiryId로 메시지 목록 조회
 */
export const getMockMessagesByInquiryId = (inquiryId: string): ChatMessage[] => {
  return mockMessagesByInquiry[inquiryId] || [];
};
