/**
 * components/customer-service/mocks/inquiries.ts
 * 문의 내역 Mock 데이터
 */

import { Inquiry, InquiryStatus } from '../types';

/**
 * Mock 문의 내역 데이터
 */
export const mockInquiries: Inquiry[] = [
  {
    id: 'inquiry-1',
    user_id: 'user-1',
    title: '결제 관련 문의',
    content: '결제가 정상적으로 완료되었는지 확인하고 싶습니다.',
    is_resolved: false,
    status: 'PENDING' as InquiryStatus,
    last_message_at: '2024-01-15T10:30:00Z',
    last_message_preview: '결제가 정상적으로 완료되었는지 확인하고 싶습니다.',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'inquiry-2',
    user_id: 'user-1',
    title: '앱 사용법 문의',
    content: '타임캡슐을 어떻게 만드는지 모르겠어요.',
    admin_reply: '타임캡슐 생성 방법을 안내해드리겠습니다.',
    is_resolved: false,
    status: 'IN_PROGRESS' as InquiryStatus,
    last_message_at: '2024-01-14T15:20:00Z',
    last_message_preview: '타임캡슐 생성 방법을 안내해드리겠습니다.',
    created_at: '2024-01-14T14:00:00Z',
    updated_at: '2024-01-14T15:20:00Z',
  },
  {
    id: 'inquiry-3',
    user_id: 'user-1',
    title: '배송 관련 문의',
    content: '배송이 언제 도착하나요?',
    admin_reply: '배송은 주문 완료 후 3-5일 소요됩니다.',
    is_resolved: true,
    status: 'RESOLVED' as InquiryStatus,
    last_message_at: '2024-01-13T11:00:00Z',
    last_message_preview: '배송은 주문 완료 후 3-5일 소요됩니다.',
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T11:00:00Z',
  },
  {
    id: 'inquiry-4',
    user_id: 'user-1',
    title: '계정 삭제 문의',
    content: '계정을 삭제하고 싶습니다.',
    is_resolved: true,
    status: 'CLOSED' as InquiryStatus,
    last_message_at: '2024-01-10T09:00:00Z',
    last_message_preview: '계정 삭제가 완료되었습니다.',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
  {
    id: 'inquiry-5',
    user_id: 'user-1',
    title: '파일 첨부 문의',
    content: '이미지를 첨부했습니다. 확인 부탁드립니다.',
    is_resolved: false,
    status: 'PENDING' as InquiryStatus,
    last_message_at: '2024-01-16T10:20:00Z',
    last_message_preview: '첨부해주신 파일들을 확인했습니다. 처리해드리겠습니다.',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:20:00Z',
  },
];

/**
 * inquiryId로 문의 조회
 */
export const getMockInquiryById = (inquiryId: string): Inquiry | undefined => {
  return mockInquiries.find((inquiry) => inquiry.id === inquiryId);
};
