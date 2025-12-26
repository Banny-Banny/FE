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
  MY_PAGE: '/my-page',

  // 타임캡슐
  TIMECAPSULE_CREATE: '/timecapsule/create',
  TIMECAPSULE_DETAIL: '/timecapsule/detail',

  // 인증
  AUTH_LOGIN: '/(auth)/login',
  AUTH_SIGNUP: '/(auth)/signup',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
