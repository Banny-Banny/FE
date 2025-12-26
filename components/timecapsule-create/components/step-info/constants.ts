/**
 * components/timecapsule-create/components/step-info/constants.ts
 * 타임캡슐 생성 관련 상수 정의
 */

// ============================================
// 백엔드 가격 정책 (복제)
// ⚠️ 백엔드 가격 변경 시 이 파일도 함께 수정 필요
// ============================================

/** 기본 금액 (없음) */
export const BASE_PRICE = 0;

/** 이미지 1장당 가격 */
export const PHOTO_PRICE = 500;

/** 음악 파일 가격 (파일당, 인원 무관) */
export const MUSIC_PRICE = 1000;

/** 동영상 파일 가격 (파일당, 인원 무관) */
export const VIDEO_PRICE = 2000;

/**
 * 개봉일 옵션별 가격 (duration_options 기반)
 * 백엔드 API 응답과 동일한 구조
 */
export const DURATION_OPTIONS = [
  { id: 'week_1', label: '1주일', duration_days: 7, price: 1000 },
  { id: 'month_1', label: '1개월', duration_days: 30, price: 5000 },
  { id: 'year_1', label: '1년', duration_days: 365, price: 10000 },
  { id: 'year_2', label: '2년', duration_days: 730, price: 20000 },
  { id: 'year_3', label: '3년', duration_days: 1095, price: 30000 },
] as const;

// ============================================
// 검증 규칙
// ============================================

/**
 * 캡슐 이름 최대 길이
 */
export const MAX_CAPSULE_NAME_LENGTH = 20;

/** 최소 참가자 수 */
export const MIN_PARTICIPANTS = 1;

/** 최대 참가자 수 */
export const MAX_PARTICIPANTS = 10;

/** 최소 저장 개수 */
export const MIN_STORAGE_COUNT = 1;

/** 최대 저장 개수 */
export const MAX_STORAGE_COUNT = 20;

/**
 * 최소 인원 (MIN_PARTICIPANTS의 별칭)
 */
export const MIN_PERSONNEL = MIN_PARTICIPANTS;

/**
 * 최대 인원 (MAX_PARTICIPANTS의 별칭)
 */
export const MAX_PERSONNEL = MAX_PARTICIPANTS;

/**
 * 최소 이미지 슬롯
 */
export const MIN_STORAGE = 1;

/**
 * 최대 이미지 슬롯
 */
export const MAX_STORAGE = 5;

// ============================================
// 개봉일 옵션 타입
// ============================================

/**
 * 개봉일 선택 옵션 (UI 버튼 인덱스)
 */
export const DATE_OPTION_INDEX = {
  ONE_WEEK: 0,
  ONE_MONTH: 1,
  ONE_YEAR: 2,
  CUSTOM: 3,
} as const;
