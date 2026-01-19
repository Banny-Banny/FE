/**
 * components/customer-service/hooks/useMockInquiries.ts
 * 문의 내역 Mock 데이터 훅
 */

import { useMemo } from 'react';
import { Inquiry, InquiryStatus } from '../types';
import { mockInquiries } from '../mocks/inquiries';

interface UseMockInquiriesOptions {
  status?: InquiryStatus;
  sortBy?: 'latest' | 'oldest';
}

export function useMockInquiries(options: UseMockInquiriesOptions = {}) {
  const { status, sortBy = 'latest' } = options;

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

    return filtered;
  }, [status, sortBy]);

  return {
    inquiries,
    isLoading: false,
    error: null,
  };
}
