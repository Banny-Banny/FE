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
    KAKAO: 'api/auth/kakao/callback', // 카카오톡 소셜 로그인 시작 (GET) - 서버가 카카오 인증 후 프론트엔드 콜백으로 리다이렉트
    ME: 'api/auth/me', // 내 정보 조회 (GET)
    VERIFY: 'api/auth/verify', // 토큰 유효성 검증 (GET)
  },

  // 캡슐 (Capsules)
  CAPSULE: {
    CREATE: 'api/capsule', // 이스터에그 생성 (POST)
    DETAIL: 'api/capsule', // 이스터에그(캡슐) 조회 (GET) - {id} 파라미터 필요
    LIST: 'api/capsules', // 캡슐 목록 조회 (GET)
  },

  // 주문 (Order)
  ORDER: {
    CREATE: 'api/order', // 타임캡슐 주문 생성 (POST)
  },

  // 결제 (Payment)
  PAYMENT: {
    KAKAO_READY: 'api/payments/kakao/ready', // 카카오페이 결제 준비 (POST)
    KAKAO_APPROVE: 'api/payments/kakao/approve', // 카카오페이 결제 (POST)
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
