/**
 * MapView 지도 설정 상수
 * iOS, Android, Web 환경에서 공통으로 사용되는 지도 설정 상수들
 */

// 기본 지도 설정
export const DEFAULT_MAP_LEVEL = 4;

// 기본 지도 중심점 (서울시청)
export const DEFAULT_MAP_CENTER = {
  lat: 37.5665,
  lng: 126.978,
} as const;

// 지도 이벤트 디바운싱 시간 (ms)
export const MAP_CENTER_CHANGED_DEBOUNCE_MS = 500;

// WebView 로드 대기 시간 (ms)
export const WEBVIEW_INIT_DELAY_MS = 1000;
export const WEBVIEW_MARKER_DELAY_MS = 1500;

// 캡슐 조회 설정
export const CAPSULE_SEARCH_RADIUS_M = 300;
export const CAPSULE_SEARCH_LIMIT = 50;
