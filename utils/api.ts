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
  let normalizedUrl: string;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    normalizedUrl = url;
  } else {
    // 프로토콜이 없으면 http:// 추가
    normalizedUrl = `http://${url}`;
  }

  // 끝의 슬래시 제거 (buildApiUrl에서 처리하므로)
  return normalizedUrl.endsWith('/') ? normalizedUrl.slice(0, -1) : normalizedUrl;
};

/**
 * API Base URL과 endpoint를 조합하여 완전한 API URL을 생성합니다.
 * @param baseUrl API Base URL (슬래시로 끝나거나 끝나지 않아도 됨)
 * @param endpoint API endpoint (슬래시로 시작하거나 시작하지 않아도 됨)
 * @returns 완전한 API URL
 * @throws baseUrl이 비어있으면 에러 발생
 */
export const buildApiUrl = (baseUrl: string, endpoint: string): string => {
  if (!baseUrl) {
    throw new Error('API Base URL이 설정되지 않았습니다.');
  }

  // apiBaseUrl이 슬래시로 끝나지 않으면 추가
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  // endpoint가 슬래시로 시작하면 제거
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  return `${normalizedBaseUrl}${cleanEndpoint}`;
};
