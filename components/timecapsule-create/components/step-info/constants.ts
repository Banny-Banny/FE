/**
 * components/timecapsule-create/components/step-info/constants.ts
 * 타임캡슐 생성 관련 상수 정의
 */

// ============================================
// 가격 상수 (백엔드 계산 로직 기반)
// ============================================

/** 기본 금액 */
export const BASE_PRICE = 1000;

/** 사진 1개당 가격 */
export const PHOTO_PRICE = 500;

/** 음악 인원당 가격 */
export const MUSIC_PRICE = 1000;

/** 동영상 인원당 가격 */
export const VIDEO_PRICE = 2000;

/**
 * 개봉일 옵션별 추가 요금
 * - 1_WEEK: +1,000원
 * - 1_YEAR: +5,000원
 * - CUSTOM: 기간별 백엔드에서 계산
 */
export const TIME_OPTION_PRICES = {
  '1_WEEK': 1000,
  '1_MONTH': 0,
  '1_YEAR': 5000,
  CUSTOM: 0, // 백엔드에서 기간별로 계산
} as const;

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
 * 개봉일 선택 옵션 (인덱스)
 */
export const DATE_OPTION_INDEX = {
  ONE_WEEK: 0,
  ONE_YEAR: 1,
  THREE_YEARS: 2,
  CUSTOM: 3,
} as const;
