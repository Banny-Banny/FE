/**
 * utils/auth.ts
 * 인증 관련 유틸리티 함수
 */

import { User } from '@/commons/layout/provider/auth/types';

/**
 * JWT 토큰 디코딩
 * @param token - JWT 토큰 문자열
 * @returns 디코딩된 페이로드 또는 null
 */
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    if (__DEV__) console.error('[Auth] JWT 디코딩 오류:', error);
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
  if (!decoded) return null;

  const userId = decoded.sub as string;
  const nickname = decoded.nickname as string | undefined;

  if (!userId) return null;

  return {
    id: userId,
    displayName: nickname,
    username: nickname,
  };
}
