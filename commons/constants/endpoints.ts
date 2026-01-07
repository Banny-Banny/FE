/**
 * API 엔드포인트 상수 정의
 * 백엔드 API 경로를 중앙에서 관리하여 타입 안정성과 일관성을 보장합니다.
 */

export const API_ENDPOINTS = {
  // 기본
  BASE: 'api',
  HEALTH: 'api/health',

  // 인증 (Auth)
  AUTH: {
    // 카카오 로그인 시작: 서버가 카카오 인증 페이지로 리다이렉트 후 콜백으로 돌아옴
    KAKAO: 'api/auth/kakao',
    ME: 'api/auth/me', // 내 정보 조회 (GET)
    VERIFY: 'api/auth/verify', // 토큰 유효성 검증 (GET)
    FRIENDS: 'api/me/friends', // 친구 목록 조회 (GET) - 페이지네이션 파라미터: limit, offset
  },

  // 캡슐 (Capsules)
  CAPSULE: {
    CREATE: 'api/capsules', // 이스터에그 생성 (POST)
    DETAIL: 'api/capsule', // 이스터에그(캡슐) 조회 (GET) - {id} 파라미터 필요
    LIST: 'api/capsules', // 캡슐 목록 조회 (GET)
    SLOTS: 'api/capsules/slots', // 슬롯 정보 조회 (GET)
    SLOTS_RESET: 'api/capsules/slots/reset', // 이스터에그 슬롯 초기화 (POST)
  },

  // 주문 (Order)
  ORDER: {
    CREATE: 'api/order', // 타임캡슐 주문 생성 (POST)
    UPDATE_STATUS: 'api/orders', // 주문 상태 변경 (PATCH) - {orderId}/status 파라미터 필요
  },

  // 결제 (Payment)
  PAYMENT: {
    KAKAO_READY: 'api/payments/kakao/ready', // 카카오페이 결제 준비 (POST)
    KAKAO_APPROVE: 'api/payments/kakao/approve', // 카카오페이 결제 (POST)
    TOSS_CONFIRM: 'api/payments/toss/confirm', // 토스페이먼츠 결제 승인 (POST)
    TOSS_GET_BY_KEY: 'api/payments/toss', // 토스 결제 조회 (paymentKey) (GET) - {paymentKey} 파라미터 필요
    TOSS_GET_BY_ORDER: 'api/payments/toss/orders', // 토스 결제 조회 (orderId) (GET) - {orderNo} 파라미터 필요
    TOSS_CANCEL: 'api/payments/toss', // 토스 결제 취소 (POST) - {paymentKey}/cancel 파라미터 필요
    // 토스페이먼츠 결제 리다이렉트 URL
    TOSS_SUCCESS_URL: 'https://timeegg.com/payment/success', // 결제 성공 리다이렉트 URL
    TOSS_FAIL_URL: 'https://timeegg.com/payment/fail', // 결제 실패 리다이렉트 URL
  },

  // 미디어 (Media/S3)
  MEDIA: {
    PRESIGN: 'api/media/presign', // 미디어 업로드용 URL (POST)
    COMPLETE: 'api/media/complete', // 미디어 업로드 완료 (POST)
    URL: 'api/media', // 미디어 URL 조회 (GET) - {id}/url 파라미터 필요
  },
} as const;

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;
export type ApiEndpointPath =
  (typeof API_ENDPOINTS)[ApiEndpointKey][keyof (typeof API_ENDPOINTS)[ApiEndpointKey]];
