/**
 * components/toss-payments/components/payment-history/hooks/usePaymentHistory.ts
 * 결제 내역 조회 Hook
 */

import { useQuery } from '@tanstack/react-query';
import { getMyPayments, getTossPaymentByOrderNo } from '../../../api/payment';
import type { GetMyPaymentsParams, PaymentDetailData, PaymentQueryError } from '../types';

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

/**
 * 내 결제 내역 목록 조회 Hook
 * 로그인한 사용자의 결제 내역을 페이지네이션하여 조회합니다.
 *
 * @param params 조회 파라미터 { page, limit, status }
 * @returns React Query result
 */
export const useMyPayments = ({ page = 1, limit = 10, status = 'ALL' }: GetMyPaymentsParams = {}) => {
  return useQuery({
    queryKey: ['payments', 'my-list', page, limit, status] as const,
    queryFn: () => getMyPayments({ page, limit, status }),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};
