/**
 * utils/mediaUrl.ts
 * 미디어 ID를 URL로 변환하는 유틸리티 함수
 */

import { API_ENDPOINTS } from '@/commons/constants/endpoints';
import Constants from 'expo-constants';
import { buildApiUrl, normalizeApiBaseUrl } from './api';
import { apiClient } from './apiClient';

/**
 * 미디어 ID를 URL로 변환
 */
export const getMediaUrl = async (mediaId: string): Promise<string> => {
  const rawApiBaseUrl =
    Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;
  const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

  if (!apiBaseUrl) {
    throw new Error('API Base URL이 설정되지 않았습니다.');
  }

  const response = await apiClient.get<{ url: string }>(
    buildApiUrl(apiBaseUrl, `${API_ENDPOINTS.MEDIA.URL}/${mediaId}/url`),
  );

  // 응답에서 url 필드 추출
  if (!response.data || !response.data.url) {
    if (__DEV__) {
      console.error('[getMediaUrl] 응답 데이터 구조 오류:', response.data);
    }
    throw new Error('미디어 URL을 가져올 수 없습니다. 응답 형식이 올바르지 않습니다.');
  }

  return response.data.url;
};

/**
 * 여러 미디어 ID를 URL 배열로 변환
 */
export const getMediaUrls = async (mediaIds: string[]): Promise<string[]> => {
  const urls = await Promise.all(mediaIds.map((id) => getMediaUrl(id)));
  return urls;
};

/**
 * 프로필 이미지 URL 유효성 검사
 * @param url 검사할 URL (string | null | undefined)
 * @returns 유효한 URL인지 여부
 */
export const isValidImageUrl = (url: string | null | undefined): url is string => {
  return (
    url !== undefined &&
    url !== null &&
    typeof url === 'string' &&
    url.trim() !== '' &&
    url !== 'null'
  );
};
