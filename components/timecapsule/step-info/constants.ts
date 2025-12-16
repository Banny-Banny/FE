/**
 * step-info/constants.ts
 * 생성 시각: 2024-12-16
 * 타임캡슐 정보 입력 화면 상수 정의
 */

// ============================================
// 가격 정책 상수
// ============================================

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
    price: 1000,
  },
  VIDEO: {
    id: 'video',
    title: '영상 추가',
    price: 2000,
  },
} as const;

// ============================================
// 날짜 계산 상수
// ============================================

/**
 * 직접 선택 시 날짜 범위별 가격 매핑
 * 선택된 날짜와 오늘 날짜의 차이(일)에 따라 가격 결정
 */
export const DATE_RANGES = [
  { maxDays: 7, price: 1000 }, // 1주일 이내
  { maxDays: 30, price: 2000 }, // 1개월 이내
  { maxDays: 90, price: 3000 }, // 3개월 이내
  { maxDays: 180, price: 5000 }, // 6개월 이내
  { maxDays: 365, price: 8000 }, // 1년 이내
  { maxDays: Infinity, price: 10000 }, // 1년 이상
] as const;

// ============================================
// 검증 규칙
// ============================================

/**
 * 캡슐 이름 최대 길이
 */
export const MAX_CAPSULE_NAME_LENGTH = 20;

/**
 * 최소 인원
 */
export const MIN_PERSONNEL = 1;

/**
 * 최대 인원
 */
export const MAX_PERSONNEL = 10;

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

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 날짜 차이(일)에 따른 가격 계산
 * @param days 오늘부터 선택된 날짜까지의 일수
 * @returns 계산된 가격
 */
export const calculateDatePrice = (days: number): number => {
  const range = DATE_RANGES.find((r) => days <= r.maxDays);
  return range ? range.price : DATE_PRICE_OPTIONS.CUSTOM_BASE;
};

/**
 * 숫자를 통화 형식으로 변환
 * @param amount 금액
 * @returns 포맷된 문자열 (예: ₩5,000)
 */
export const formatPrice = (amount: number): string => {
  return `₩${amount.toLocaleString('ko-KR')}`;
};
