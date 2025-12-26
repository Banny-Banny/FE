/**
 * step-payment/api/types/payment.ts
 * 생성 시각: 2024-12-24
 * 카카오페이 결제 API 타입 정의
 */

// ============================================
// 결제 준비 API 타입
// ============================================

/**
 * 카카오페이 결제 준비 요청 타입
 */
export interface KakaoPayReadyRequest {
  /** 주문 ID */
  order_id: string;
}

/**
 * 카카오페이 결제 준비 응답 타입
 */
export interface KakaoPayReadyResponse {
  /** 주문 ID */
  order_id: string;
  /** 카카오페이 거래 ID */
  tid: string;
  /** 카카오페이 결제 페이지 리다이렉트 URL */
  redirect_url: string;
}

// ============================================
// 결제 승인 API 타입
// ============================================

/**
 * 카카오페이 결제 승인 요청 타입
 */
export interface KakaoPayApproveRequest {
  /** 주문 ID */
  order_id: string;
  /** 카카오페이 pg_token */
  pg_token: string;
}

/**
 * 카카오페이 결제 승인 응답 타입
 */
export interface KakaoPayApproveResponse {
  /** 주문 ID */
  order_id: string;
  /** 결제 상태 */
  status: string;
  /** 결제 금액 */
  amount: number;
  /** 승인 일시 (ISO 8601 형식) */
  approved_at: string;
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
