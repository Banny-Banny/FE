/**
 * components/timecapsule-create/components/step-info/constants.ts
 * 타임캡슐 생성 관련 상수 정의
 */

// ============================================
// 가격 상수
// ============================================

/** 텍스트 가격 (무료) */
export const TEXT_PRICE = 0;

/** 사진 1개당 가격 */
export const PHOTO_PRICE = 500;

/** 음악 가격 */
export const MUSIC_PRICE = 1000;

/** 동영상 가격 */
export const VIDEO_PRICE = 2000;

/**
 * 개봉일 옵션별 가격 정의
 */
export const DATE_PRICE_OPTIONS = {
  ONE_WEEK: 1000, // 1주일 후
  ONE_YEAR: 5000, // 1년 후
  THREE_YEARS: 10000, // 3년 후
  CUSTOM_BASE: 3000, // 직접 선택 기본 금액
} as const;

/**
 * 인원당 단가
 */
export const PERSONNEL_UNIT_PRICE = 500;

/**
 * 이미지 슬롯당 단가
 */
export const STORAGE_UNIT_PRICE = 500;

/**
 * 추가 옵션 정보 및 가격
 */
export const ADDITIONAL_OPTIONS = {
  MUSIC: {
    id: 'music',
    title: '음악 파일',
    price: MUSIC_PRICE,
  },
  VIDEO: {
    id: 'video',
    title: '영상 추가',
    price: VIDEO_PRICE,
  },
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
