/**
 * 앱 내 라우트 경로 상수 정의
 * 페이지 이동 시 타입 안정성과 일관성을 보장합니다.
 */

export const ROUTES = {
  // 메인 탭
  // ⚠️ 중요: MAIN은 '/(tabs)'로 설정하여 로그인 성공 시 무조건 tabs의 index.tsx로 이동
  MAIN: '/(tabs)', // (tabs)/index.tsx로 이동
  HOME: '/',
  ALARM: '/alarm',
  CALENDAR: '/calendar',
  MY_PAGE: '/(tabs)/mypage',

  // 타임캡슐
  TIMECAPSULE_CREATE: '/timecapsule/info', // 리팩토링: step별 분리 (/info → /payment → /room)
  TIMECAPSULE_DETAIL: '/timecapsule/detail',

  // 인증
  AUTH_SIGNUP: '/(auth)/signup',
  AUTH_CALLBACK: '/auth/callback', // OAuth 콜백 (웹 전용) - Expo Router에서 (auth) 그룹은 URL에 포함되지 않음

  // 온보딩 (로그인 → 친구 연동 → 위치 동의 통합)
  AUTH_ONBOARDING: '/(auth)/onboarding',
  // 하위 호환성을 위한 별칭 (deprecated)
  AUTH_LOGIN: '/(auth)/onboarding',
  AUTH_FRIEND_CONSENT: '/(auth)/onboarding',
  AUTH_LOCATION_CONSENT: '/(auth)/onboarding',

  // 프로필
  PROFILE_EDIT: '/profile/edit',

  // 내 알 목록
  MY_EGG_LIST: '/(tabs)/myegglist',

  // 내 캡슐
  MY_CAPSULE: '/(tabs)/my-capsule',

  // 고객센터
  CUSTOMER_SERVICE: '/(tabs)/customer-service',

  // 공지사항
  NOTICES: '/(tabs)/notices',
  NOTICE_DETAIL: '/(tabs)/notices/[id]',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
