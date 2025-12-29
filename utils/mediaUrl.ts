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

  return response.data.url;
};

/**
 * 여러 미디어 ID를 URL 배열로 변환
 */
export const getMediaUrls = async (mediaIds: string[]): Promise<string[]> => {
  const urls = await Promise.all(mediaIds.map((id) => getMediaUrl(id)));
  return urls;
};
