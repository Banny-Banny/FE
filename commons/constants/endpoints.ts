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
    // 이메일 로그인
    EMAIL_LOGIN: 'api/auth/local/login', // 자체 로그인 (POST) - body: { phoneNumber?: string, email?: string, password: string }
    EMAIL_SIGNUP: 'api/auth/local/signup', // 자체 회원가입 (POST) - body: { nickname: string, phoneNumber: string, password: string, email?: string, profileImg?: string }
    ME: 'api/auth/me', // 내 정보 조회 (GET)
    VERIFY: 'api/auth/verify', // 토큰 유효성 검증 (GET)
    FRIENDS: 'api/me/friends', // 친구 목록 조회 (GET) - 페이지네이션 파라미터: limit, offset
    NOTIFICATIONS: 'api/me/notifications', // 알림 목록 조회 (GET) - 페이지네이션 파라미터: limit, offset
    NOTIFICATIONS_UNREAD_COUNT: 'api/me/notifications/unread-count', // 읽지 않은 알림 개수 조회 (GET)
    NOTIFICATIONS_READ_ALL: 'api/me/notifications/read-all', // 모든 알림 읽음 처리 (PATCH)
    NOTIFICATIONS_DELETE: 'api/me/notifications', // 알림 삭제 (POST) - {notificationId}/delete 파라미터 필요
    PUSH_TOKEN: 'api/me/push-token', // 푸시 토큰 등록 (POST) - body: { token: string }
    ONBOARDING_COMPLETE: 'api/onboarding/complete', // 온보딩 완료 (POST)
  },

  // 캡슐 (Capsules)
  CAPSULE: {
    CREATE: 'api/capsules', // 이스터에그 생성 (POST)
    DETAIL: 'api/capsule', // 이스터에그(캡슐) 조회 (GET) - {id} 파라미터 필요
    LIST: 'api/capsules', // 캡슐 목록 조회 (GET)
    MY_EGGS: 'api/capsules/my-eggs', // 내 알 목록 조회 (GET) - type, sort 파라미터 필요
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
    TOSS_MY_PAYMENTS: 'api/payments/toss/my-payments', // 내 결제 내역 목록 조회 (GET) - 페이지네이션 파라미터: page, limit, status
    TOSS_CANCEL: 'api/payments/toss', // 토스 결제 취소 (POST) - {paymentKey}/cancel 파라미터 필요
    // 토스페이먼츠 결제 리다이렉트 URL
    // ⚠️ 모바일 앱에서는 WebView의 handleNavigationStateChange에서 이 URL을 감지하여 처리
    // 실제로 서버에 해당 페이지가 존재하지 않아도 WebView에서 URL만 감지하면 됨
    TOSS_SUCCESS_URL: 'https://www.timeegg.com/payment/success', // 결제 성공 리다이렉트 URL (WebView에서 감지)
    TOSS_FAIL_URL: 'https://www.timeegg.com/payment/fail', // 결제 실패 리다이렉트 URL (WebView에서 감지)
  },

  // 미디어 (Media/S3)
  MEDIA: {
    PRESIGN: 'api/media/presign', // 미디어 업로드용 URL (POST)
    COMPLETE: 'api/media/complete', // 미디어 업로드 완료 (POST)
    URL: 'api/media', // 미디어 URL 조회 (GET) - {id}/url 파라미터 필요
  },

  // 고객센터 (Customer Service) - 추후 수정 예정
  CUSTOMER_SERVICE: {
    INQUIRIES: 'api/customer-service/inquiries', // 문의 내역 목록 조회 (GET)
    INQUIRY_DETAIL: 'api/customer-service/inquiries/{id}', // 문의 상세 조회 (GET) - {id} 파라미터 필요
    INQUIRY_CREATE: 'api/customer-service/inquiries', // 새 문의 생성 (POST)
    MESSAGES: 'api/customer-service/inquiries/{inquiryId}/messages', // 채팅 메시지 조회 (GET) - {inquiryId} 파라미터 필요
    MESSAGE_SEND: 'api/customer-service/inquiries/{inquiryId}/messages', // 메시지 전송 (POST) - {inquiryId} 파라미터 필요
    FILE_UPLOAD: 'api/customer-service/chat/upload', // 파일 업로드 (POST)
  },

  // 공지사항 (Notices)
  NOTICES: {
    LIST: 'api/notices', // 공지사항 목록 조회 (GET)
    DETAIL: 'api/notices/{id}', // 공지사항 상세 조회 (GET) - {id} 파라미터 필요
  },
} as const;

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;
export type ApiEndpointPath =
  (typeof API_ENDPOINTS)[ApiEndpointKey][keyof (typeof API_ENDPOINTS)[ApiEndpointKey]];
