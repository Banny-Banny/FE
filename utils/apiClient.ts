/**
 * utils/apiClient.ts
 * 중앙화된 API 클라이언트 (인증 자동 처리)
 */

import { STORAGE_KEYS } from '@/commons/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Alert } from 'react-native';

// API Base URL 가져오기 (app.config.js 또는 .env)
const getBaseUrl = (): string | null => {
  const url =
    Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || '';

  if (!url || url === 'your_api_url' || url.includes('your_api')) {
    if (__DEV__) {
      console.error(
        '[API Client] ⚠️ API Base URL이 설정되지 않았습니다!\n' +
          '다음 중 하나를 수행하세요:\n' +
          '1. 프로젝트 루트에 .env 파일 생성\n' +
          '2. EXPO_PUBLIC_API_BASE_URL=http://your-server:3000 추가\n' +
          '3. 개발 서버 재시작 (npm start)',
      );
    }
    return null;
  }

  // 끝의 슬래시 제거
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const BASE_URL = getBaseUrl();

if (__DEV__) {
  if (BASE_URL) {
    console.log('[API Client] ✅ Base URL:', BASE_URL);
  } else {
    console.error('[API Client] ❌ Base URL이 설정되지 않았습니다!');
  }
}

/**
 * 인증이 필요한 API 클라이언트
 * - 자동으로 JWT 토큰 헤더 추가
 * - 401 에러 시 자동 로그아웃
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL || undefined,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰 자동 추가 및 URL 검증
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Base URL 검증
    if (!BASE_URL) {
      const errorMsg =
        'API 서버 주소가 설정되지 않았습니다.\n\n' +
        '해결 방법:\n' +
        '1. 프로젝트 루트에 .env 파일 생성\n' +
        '2. 다음 내용 추가:\n' +
        '   EXPO_PUBLIC_API_BASE_URL=http://your-server:3000\n' +
        '3. 개발 서버 재시작 (npm start)';

      Alert.alert('설정 오류', errorMsg);
      throw new Error(errorMsg);
    }

    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 에러 시 자동 로그아웃
apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API] ✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    if (__DEV__) {
      console.error(
        `[API] ❌ ${error.response?.status || 'Network'} ${error.config?.url}`,
        error.response?.data || error.message,
      );
    }

    if (error.response?.status === 401) {
      // 토큰 만료 또는 유효하지 않음
      await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.USER_DATA]);
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  },
);

/**
 * 인증이 필요없는 API 클라이언트
 */
export const publicApiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL || undefined,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
