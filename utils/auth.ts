/**
 * utils/auth.ts
 * 인증 관련 유틸리티 함수
 */

import { User } from '@/commons/layout/provider/auth/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage 키 상수 (AuthProvider와 동일)
const STORAGE_KEYS = {
  ACCESS_TOKEN: '@auth/accessToken',
  USER_DATA: '@auth/userData',
} as const;

/**
 * JWT 토큰 디코딩
 * @param token - JWT 토큰 문자열
 * @returns 디코딩된 페이로드 또는 null
 */
export function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    // JWT는 base64url로 인코딩된 3부분으로 구성: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // payload 부분 디코딩
    const payload = parts[1];

    // base64url 디코딩 (base64와 약간 다름: - -> +, _ -> /)
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    if (__DEV__) {
      console.error('JWT decode error:', error);
    }
    return null;
  }
}

/**
 * JWT 토큰에서 User 객체 생성
 * @param token - JWT 토큰 문자열
 * @returns User 객체 또는 null
 */
export function getUserFromToken(token: string): User | null {
  const decoded = decodeJWT(token);
  if (!decoded) {
    return null;
  }

  // JWT payload에서 사용자 정보 추출
  // sub는 보통 사용자 ID를 의미
  const userId = decoded.sub as string;
  const nickname = decoded.nickname as string | undefined;

  if (!userId) {
    return null;
  }

  return {
    id: userId,
    displayName: nickname,
    username: nickname,
  };
}

/**
 * AsyncStorage에서 저장된 토큰 가져오기
 * @returns 저장된 토큰 또는 null
 */
export async function getStoredToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    if (__DEV__) {
      console.error('Get stored token error:', error);
    }
    return null;
  }
}

/**
 * AsyncStorage에서 저장된 사용자 정보 가져오기
 * @returns 저장된 사용자 정보 또는 null
 */
export async function getStoredUser(): Promise<User | null> {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userData) {
      return null;
    }
    return JSON.parse(userData) as User;
  } catch (error) {
    if (__DEV__) {
      console.error('Get stored user error:', error);
    }
    return null;
  }
}

/**
 * 토큰과 사용자 정보를 함께 가져오기
 * @returns 토큰과 사용자 정보 객체 또는 null
 */
export async function getStoredAuth(): Promise<{ token: string; user: User } | null> {
  try {
    const [token, user] = await Promise.all([getStoredToken(), getStoredUser()]);
    if (token && user) {
      return { token, user };
    }
    return null;
  } catch (error) {
    if (__DEV__) {
      console.error('Get stored auth error:', error);
    }
    return null;
  }
}
