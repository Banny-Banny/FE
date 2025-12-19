/**
 * lib/api/types/order.ts
 * 타임캡슐 주문 API 타입 정의
 * 생성 시각: 2024-12-18
 */

// ============================================
// API 요청 타입
// ============================================

/**
 * 타임캡슐 주문 생성 요청 타입
 */
export interface CreateOrderRequest {
  /** 상품 ID (UUID) */
  product_id: string;
  /** 개봉 시간 옵션 */
  time_option: '1_WEEK' | '1_MONTH' | '1_YEAR' | '3_YEAR' | 'CUSTOM';
  /** 직접 선택한 개봉일 (ISO 8601 형식) */
  custom_open_at?: string;
  /** 인원 수 (1~10) */
  headcount: number;
  /** 이미지 슬롯 수 (0 이상, headcount * 5 이하) */
  photo_count?: number;
  /** 음악 파일 추가 여부 */
  add_music?: boolean;
  /** 영상 추가 여부 */
  add_video?: boolean;
}

// ============================================
// API 응답 타입
// ============================================

/**
 * 타임캡슐 주문 생성 응답 타입
 */
export interface CreateOrderResponse {
  /** 생성된 주문 ID (UUID) */
  order_id: string;
  /** 총 결제 금액 */
  total_amount: number;
  /** 기본 금액 */
  base_amount: number;
  /** 사진 추가 금액 */
  photo_amount: number;
  /** 음악 추가 금액 */
  music_amount: number;
  /** 영상 추가 금액 */
  video_amount: number;
  /** 개봉 시간 옵션 */
  time_option: string;
  /** 직접 선택한 개봉일 */
  custom_open_at: string | null;
  /** 인원 수 */
  headcount: number;
  /** 이미지 슬롯 수 */
  photo_count: number;
  /** 음악 파일 추가 여부 */
  add_music: boolean;
  /** 영상 추가 여부 */
  add_video: boolean;
  /** 주문 상태 */
  status: 'PENDING_PAYMENT' | 'COMPLETED' | 'CANCELLED';
}

// ============================================
// 에러 응답 타입
// ============================================

/**
 * API 에러 응답 타입
 */
export interface ApiError {
  /** HTTP 상태 코드 */
  statusCode: number;
  /** 에러 메시지 */
  message: string;
  /** 에러 타입 */
  error?: string;
}
