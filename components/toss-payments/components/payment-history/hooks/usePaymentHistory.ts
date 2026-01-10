/**
 * components/toss-payments/components/payment-history/hooks/usePaymentHistory.ts
 * 결제 내역 조회 Hook
 */

import { useQuery } from '@tanstack/react-query';
import { getTossPaymentByOrderNo } from '../../../api/payment';
import type { PaymentDetailData, PaymentQueryError } from '../types';

/**
 * 결제 내역 조회 Hook
 * 주문번호로 결제 정보를 조회합니다.
 *
 * @param orderNo 주문번호
 * @returns React Query result
 */
export const usePaymentHistory = (orderNo: string | null) => {
  return useQuery<PaymentDetailData, PaymentQueryError>({
    queryKey: ['payment', 'detail', orderNo] as const,
    queryFn: async () => {
      if (!orderNo) {
        throw new Error('주문번호를 입력해주세요');
      }
      return await getTossPaymentByOrderNo(orderNo);
    },
    enabled: !!orderNo && orderNo.trim().length > 0,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};
