/**
 * utils/format.ts
 * 포맷팅 관련 순수 함수들
 */

/**
 * 숫자를 천단위 콤마 형식으로 변환
 * @param value 숫자
 * @returns 포맷된 문자열 (예: "5,000")
 */
export const formatPrice = (value: number): string => {
  return value.toLocaleString('ko-KR');
};

/**
 * 가격을 원화 형식으로 변환
 * @param value 숫자
 * @returns 원화 형식 문자열 (예: "₩5,000")
 */
export const formatCurrency = (value: number): string => {
  return `₩${formatPrice(value)}`;
};

/**
 * 숫자를 통화 형식으로 변환 (formatCurrency의 별칭)
 * @param amount 금액
 * @returns 포맷된 문자열 (예: ₩5,000)
 */
export const formatPriceWithSymbol = (amount: number): string => {
  return `₩${amount.toLocaleString('ko-KR')}`;
};
