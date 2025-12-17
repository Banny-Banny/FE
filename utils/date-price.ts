/**
 * utils/date-price.ts
 * 날짜 기반 가격 계산 유틸리티
 */

/**
 * 날짜 차이(일)에 따른 가격 계산
 * @param days 오늘부터 선택된 날짜까지의 일수
 * @param dateRanges 날짜 범위별 가격 매핑 배열
 * @param customBasePrice 직접 선택 기본 금액 (기본값: 3000)
 * @returns 계산된 가격
 */
export const calculateDatePrice = (
  days: number,
  dateRanges: ReadonlyArray<{ maxDays: number; price: number }>,
  customBasePrice = 3000,
): number => {
  const range = dateRanges.find((r) => days <= r.maxDays);
  return range ? range.price : customBasePrice;
};
