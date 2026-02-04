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

/**
 * ISO 8601 날짜 문자열을 상대 시간으로 변환
 * @param dateString ISO 8601 형식의 날짜 문자열 (예: "2024-01-01T00:00:00.000Z")
 * @returns 상대 시간 문자열 (예: "방금 전", "10분 전", "1시간 전", "3일 전")
 */
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 음수인 경우 (미래 시간) 또는 0초 이하인 경우
  if (diffInSeconds <= 0) {
    return '방금 전';
  }

  if (diffInSeconds < 60) {
    return '방금 전';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}년 전`;
};

