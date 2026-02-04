/**
 * AsyncStorage 키 상수
 * 인증 관련 데이터 저장 키 중앙 관리
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@auth/accessToken',
  USER_DATA: '@auth/userData',
  FRIEND_CONSENT: '@onboarding/friendConsent',
  LOCATION_CONSENT: '@onboarding/locationConsent',
  PENDING_INVITE_CODE: '@auth/pendingInviteCode', // 로그인 전 저장된 초대코드
} as const;

