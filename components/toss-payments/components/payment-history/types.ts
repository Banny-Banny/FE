/**
 * components/toss-payments/components/payment-history/types.ts
 * 결제 내역 컴포넌트 타입 정의
 */

import type { TossPaymentResponse } from '../../api/types/types';

/**
 * 결제 필터 타입
 * - all: 전체 결제 내역
 * - done: 완료된 결제만
 * - canceled: 취소된 결제만
 */
export type PaymentFilterType = 'all' | 'done' | 'canceled';

/**
 * PaymentHistory 컴포넌트 Props
 */
export interface PaymentHistoryProps {
  /**
   * 기본 주문번호 (선택사항)
   * 제공되면 해당 주문번호로 자동 조회
   */
  defaultOrderNo?: string;
}

/**
 * 결제 상세 데이터
 * TossPaymentResponse를 재사용
 */
export type PaymentDetailData = TossPaymentResponse;

/**
 * 결제 조회 에러 타입
 */
export interface PaymentQueryError {
  status: number;
  message: string;
}

/**
 * 결제 목록 아이템 (요약 정보)
 */
export interface PaymentListItem {
  paymentKey: string;
  orderNo: string;
  orderName?: string; // 주문명 (선택적, UI 표시용)
  tossStatus: 'DONE' | 'CANCELED';
  method: string;
  currency: string;
  amount: number;
  approvedAt: string;
  receiptUrl: string;
}

/**
 * 결제 목록 응답
 * 백엔드 API: GET /api/payments/toss/my-payments
 */
export interface PaymentListResponse {
  payments: PaymentListItem[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 결제 목록 조회 파라미터
 */
export interface GetMyPaymentsParams {
  page?: number;
  limit?: number;
  status?: 'ALL' | 'DONE' | 'CANCELED';
}
