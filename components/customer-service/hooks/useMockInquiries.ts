/**
 * components/customer-service/hooks/useMockInquiries.ts
 * 문의 내역 Mock 데이터 훅
 */

import { useMemo, useState } from 'react';
import { Inquiry, InquiryStatus } from '../types';
import { mockInquiries as initialMockInquiries } from '../mocks/inquiries';
import { getMockMessagesByInquiryId } from '../mocks/messages';

interface UseMockInquiriesOptions {
  status?: InquiryStatus;
  sortBy?: 'latest' | 'oldest';
}

/**
 * 문의별 읽지 않은 메시지 개수를 반환하는 함수
 */
function getUnreadCountForInquiry(inquiryId: string): number {
  const messages = getMockMessagesByInquiryId(inquiryId);
  return messages.filter((msg) => msg.sender_type === 'ADMIN' && !msg.is_read_by_user).length;
}

export interface InquiryWithUnreadCount extends Inquiry {
  unreadCount: number;
}

interface UseMockInquiriesReturn {
  inquiries: InquiryWithUnreadCount[];
  updateInquiryStatus: (inquiryId: string, status: InquiryStatus, isResolved: boolean) => void;
  isLoading: boolean;
  error: null;
}

export function useMockInquiries(options: UseMockInquiriesOptions = {}): UseMockInquiriesReturn {
  const { status, sortBy = 'latest' } = options;

  // 문의 내역 상태 관리 (Mock)
  const [mockInquiries, setMockInquiries] = useState<Inquiry[]>(initialMockInquiries);

  /**
   * 문의 상태 업데이트 (Mock)
   */
  const updateInquiryStatus = (inquiryId: string, newStatus: InquiryStatus, isResolved: boolean) => {
    setMockInquiries((prev) =>
      prev.map((inquiry) =>
        inquiry.id === inquiryId
          ? { ...inquiry, status: newStatus, is_resolved: isResolved, updated_at: new Date().toISOString() }
          : inquiry
      )
    );
  };

  const inquiries = useMemo(() => {
    let filtered = [...mockInquiries];

    // 상태별 필터링
    if (status) {
      filtered = filtered.filter((inquiry) => inquiry.status === status);
    }

    // 정렬
    if (sortBy === 'latest') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.last_message_at || a.created_at).getTime();
        const dateB = new Date(b.last_message_at || b.created_at).getTime();
        return dateB - dateA;
      });
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.last_message_at || a.created_at).getTime();
        const dateB = new Date(b.last_message_at || b.created_at).getTime();
        return dateA - dateB;
      });
    }

    // 읽지 않은 메시지 개수 추가
    return filtered.map((inquiry) => ({
      ...inquiry,
      unreadCount: getUnreadCountForInquiry(inquiry.id),
    }));
  }, [status, sortBy]);

  return {
    inquiries,
    updateInquiryStatus,
    isLoading: false,
    error: null,
  };
}
