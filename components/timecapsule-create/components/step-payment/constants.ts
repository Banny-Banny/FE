/**
 * step-payment/constants.ts
 * 결제 관련 상수 정의
 */

// ============================================
// 날짜 가격 계산 상수
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
