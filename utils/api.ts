/**
 * utils/api.ts
 * API 관련 유틸리티 함수
 */

/**
 * API Base URL을 정규화합니다.
 * 프로토콜이 없으면 자동으로 추가합니다.
 * @param url API Base URL
 * @returns 정규화된 API Base URL
 */
export const normalizeApiBaseUrl = (url: string | undefined): string | null => {
  if (!url || url === 'your_api_url' || url.includes('your_api')) {
    return null;
  }

  // 이미 프로토콜이 포함되어 있으면 그대로 반환
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // 프로토콜이 없으면 http:// 추가
  return `http://${url}`;
};
