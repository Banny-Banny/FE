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

/**
 * 시간을 MM:SS 형식으로 포맷팅
 * @param seconds 초 단위 시간
 * @returns 포맷된 문자열 (예: "0:05", "1:23")
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(1, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 밀리초를 MM:SS 형식으로 포맷팅
 * @param millis 밀리초 단위 시간
 * @returns 포맷된 문자열 (예: "0:05", "1:23")
 */
export const formatTimeFromMillis = (millis: number): string => {
  const seconds = Math.floor(millis / 1000);
  return formatTime(seconds);
};

