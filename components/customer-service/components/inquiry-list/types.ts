/**
 * components/customer-service/components/inquiry-list/types.ts
 * 문의 내역 리스트 컴포넌트 Props 타입 정의
 */

import { Inquiry } from '../../types';

export interface InquiryListProps {
  inquiries?: Inquiry[];
  onInquiryPress?: (inquiry: Inquiry) => void;
  onNewInquiryPress?: () => void;
  isLoading?: boolean;
}
