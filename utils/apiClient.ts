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
  const url = Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || '';

  if (!url || url === 'your_api_url' || url.includes('your_api')) {
    if (__DEV__) {
    }
    return null;
  }

  // 끝의 슬래시 제거
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const BASE_URL = getBaseUrl();

if (__DEV__) {
  if (BASE_URL) {
  } else {
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
      
      if (__DEV__) {
        // 토큰이 제대로 전달되는지 확인 (처음 20자만 로깅)
        const tokenPreview = token.length > 20 ? `${token.substring(0, 20)}...` : token;
      }
    } else if (__DEV__) {
    }

    // ⭐ FormData를 보낼 때는 Content-Type 헤더 제거 (axios가 자동으로 boundary 포함하여 설정)
    // React Native FormData를 보낼 때는 Content-Type을 제거해야 함
    // axios가 자동으로 'multipart/form-data; boundary=...' 형식으로 설정함
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
      // ⭐ 파일 업로드는 시간이 오래 걸릴 수 있으므로 타임아웃 60초로 연장
      config.timeout = 60000;
      if (__DEV__) {
      }
    }

    if (__DEV__) {
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 에러 시 자동 로그아웃
apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
    }
    return response;
  },
  async (error) => {
    if (__DEV__) {
      const statusCode = error.response?.status || 'Network';
      const url = error.config?.url || 'Unknown';
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || error.message || '알 수 없는 오류';

      // 409 Conflict는 정상적인 비즈니스 로직 케이스 (이미 참여 중, 이미 존재 등)
      const isExpectedConflict = statusCode === 409;

      // 404 중에서도 정상적인 케이스 (예: /my-content는 아직 작성하지 않은 경우 404가 정상)
      const isExpectedNotFound =
        statusCode === 404 &&
        (url.includes('/my-content') ||
          errorMessage.includes('아직 작성하지 않았습니다') ||
          errorMessage.includes('작성하지 않았습니다'));

      if (isExpectedConflict || isExpectedNotFound) {
      } else {
      }
    }

    if (error.response?.status === 401) {
      // 토큰 만료 또는 유효하지 않음
      const errorMessage = error.response?.data?.message || '사용자를 찾을 수 없습니다.';
      
      if (__DEV__) {
        // 401 에러 발생 시 상세 정보 로깅
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const tokenInfo = token
          ? {
              exists: true,
              length: token.length,
              preview: token.length > 20 ? `${token.substring(0, 20)}...` : token,
            }
          : { exists: false };
        
      }
      
      await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.USER_DATA]);
      router.replace('/(auth)/onboarding');
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

// Public API 요청 인터셉터: URL 검증 및 로깅
publicApiClient.interceptors.request.use(
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

    if (__DEV__) {
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Public API 응답 인터셉터: 로깅
publicApiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      const statusCode = error.response?.status || 'Network';
      const url = error.config?.url || 'Unknown';
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || error.message || '알 수 없는 오류';

    }
    return Promise.reject(error);
  },
);
