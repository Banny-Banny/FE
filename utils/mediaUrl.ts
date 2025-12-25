/**
 * utils/mediaUrl.ts
 * 미디어 ID를 URL로 변환하는 유틸리티 함수
 */

import { API_ENDPOINTS } from '@/commons/constants/endpoints';
import { buildApiUrl, normalizeApiBaseUrl } from '@/utils';
import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';

/**
 * 미디어 ID를 URL로 변환
 * @param mediaId 미디어 ID
 * @param token 인증 토큰
 * @returns 미디어 URL
 */
export const getMediaUrl = async (mediaId: string, token: string): Promise<string> => {
  const rawApiBaseUrl =
    Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;

  const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

  if (!apiBaseUrl) {
    throw new Error(
      'API Base URL이 설정되지 않았습니다. .env 파일에 EXPO_PUBLIC_API_BASE_URL을 설정해주세요.',
    );
  }

  try {
    const response = await axios.get<{ url: string }>(
      buildApiUrl(apiBaseUrl, `${API_ENDPOINTS.MEDIA.URL}/${mediaId}/url`),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.url;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(`미디어 URL 조회 실패: ${axiosError.response?.status} ${axiosError.message}`);
  }
};

/**
 * 여러 미디어 ID를 URL 배열로 변환
 * @param mediaIds 미디어 ID 배열
 * @param token 인증 토큰
 * @returns 미디어 URL 배열
 */
export const getMediaUrls = async (mediaIds: string[], token: string): Promise<string[]> => {
  const urls = await Promise.all(mediaIds.map((id) => getMediaUrl(id, token)));
  return urls;
};
