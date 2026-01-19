/**
 * components/customer-service/components/inquiry-item/types.ts
 * 문의 항목 컴포넌트 Props 타입 정의
 */

import { Inquiry } from '../../types';

export interface InquiryItemProps {
  inquiry: Inquiry;
  onPress?: (inquiry: Inquiry) => void;
}
