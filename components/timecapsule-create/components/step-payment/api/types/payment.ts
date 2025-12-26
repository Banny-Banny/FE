/**
 * step-payment/api/types/payment.ts
 * 생성 시각: 2024-12-24
 * 수정 시각: 2024-12-26
 * 토스페이먼츠 결제 API 타입 정의
 */

// ============================================
// 토스페이먼츠 결제 승인 API 타입
// ============================================

/**
 * 토스페이먼츠 결제 승인 요청
 */
export interface TossPaymentConfirmRequest {
  /** 결제 키 (1~200자) */
  paymentKey: string;
  /** 주문 ID (6~200자) */
  orderId: string;
  /** 결제 금액 */
  amount: number;
}

/**
 * 토스페이먼츠 결제 승인 응답
 */
export interface TossPaymentConfirmResponse {
  /** 주문 ID */
  order_id: string;
  /** 결제 키 */
  payment_key: string;
  /** 결제 상태 (예: "PAID") */
  status: string;
  /** 결제 금액 */
  amount: number;
  /** 승인 일시 (ISO 8601) */
  approved_at: string;
  /** 타임캡슐 ID */
  capsule_id: string;
  /** 영수증 URL */
  receipt_url: string;
}

// ============================================
// 토스페이먼츠 결제 조회 API 타입 (선택사항)
// ============================================

/**
 * 토스페이먼츠 결제 조회 응답
 * GET /api/payments/toss/{paymentKey} 또는 /api/payments/toss/orders/{orderNo}
 */
export interface TossPaymentResponse {
  payment: {
    paymentKey: string;
    orderNo: string;
    tossStatus: string; // "DONE", "CANCELED" 등
    method: string; // "카드" 등
    currency: string; // "KRW"
    amount: number; // balance_amount (잔액)
    approvedAt: string; // ISO 8601
    receiptUrl: string;
  };
  cancels: Array<{
    transactionKey: string;
    cancelAmount: number;
    cancelReason: string;
    cancelStatus: string;
    canceledAt: string;
  }>;
}

// ============================================
// 토스페이먼츠 결제 취소 API 타입 (선택사항)
// ============================================

/**
 * 토스페이먼츠 결제 취소 요청
 * POST /api/payments/toss/{paymentKey}/cancel
 */
export interface TossPaymentCancelRequest {
  /** 취소 사유 (1~200자, 필수) */
  cancelReason: string;
  /** 취소 금액 (선택, 없으면 전액 취소) */
  cancelAmount?: number;
  /** 환불 계좌 정보 (선택, 가상계좌 환불용) */
  refundReceiveAccount?: {
    bank: string;
    accountNumber: string;
    holderName: string;
  };
}

/**
 * 토스페이먼츠 결제 취소 응답
 */
export interface TossPaymentCancelResponse {
  payment_key: string;
  status: string; // "CANCELED" 또는 "DONE" (부분 취소 시)
  balance_amount: number; // 잔액
  cancels: Array<{
    transactionKey: string;
    cancelAmount: number;
    cancelReason: string;
    cancelStatus: string;
    canceledAt: string;
  }>;
  receipt_url: string;
}

// ============================================
// 에러 타입
// ============================================

/**
 * 결제 에러 타입
 */
export interface PaymentError {
  /** HTTP 상태 코드 */
  status: number;
  /** 에러 메시지 */
  message: string;
}
