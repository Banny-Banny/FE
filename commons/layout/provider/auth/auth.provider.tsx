/**
 * commons/layout/provider/auth/auth.provider.tsx
i * 인증 상태 전역 관리 Provider
 */

import { ROUTES, STORAGE_KEYS } from '@/commons/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from './types';

// 개발 모드에서 인증 체크 우회 (백엔드 연결 없이 개발 시 true로 설정)
const SKIP_AUTH_CHECK = __DEV__ && true; // true로 설정하면 인증 체크를 건너뜁니다

// AuthContext 타입 정의
interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // 앱 시작 시 저장된 인증 정보 복구
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [token, userData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        ]);

        if (token && userData) {
          setAccessToken(token);
          setUser(JSON.parse(userData));
          if (__DEV__) console.log('[Auth] 인증 정보 복구 완료:', { token: token.substring(0, 20) + '...', user: JSON.parse(userData) });
        } else {
          if (__DEV__) console.log('[Auth] 저장된 인증 정보 없음');
        }
      } catch (error) {
        if (__DEV__) console.error('[Auth] 초기화 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 인증 상태에 따른 자동 리다이렉트
  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = segments[0] === '(auth)';
    const isAuthenticated = !!accessToken;

    // 인증됨 + 인증 페이지 → 메인으로
    if (isAuthenticated && isAuthPage) {
      if (__DEV__) console.log('[Auth] 메인 페이지로 이동');
      router.replace(ROUTES.MAIN);
    }
    // 미인증 + 메인 페이지 → 로그인으로
    else if (!isAuthenticated && !isAuthPage) {
      if (__DEV__) console.log('[Auth] 로그인 페이지로 이동');
      router.replace(ROUTES.AUTH_LOGIN);
    }
  }, [isLoading, accessToken, segments, router]);

  /**
   * 로그인: 토큰과 유저 정보 저장 및 메인으로 이동
   */
  const login = async (token: string, userData: User): Promise<void> => {
    if (__DEV__) console.log('[Auth] 로그인:', userData.displayName);

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
      AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
    ]);

    setAccessToken(token);
    setUser(userData);
    
    // 자동 리다이렉트는 useEffect에서 처리
  };

  /**
   * 로그아웃: 토큰과 유저 정보 삭제 및 로그인으로 이동
   */
  const logout = async (): Promise<void> => {
    if (__DEV__) console.log('[Auth] 로그아웃');

    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
    ]);

    setAccessToken(null);
    setUser(null);
    
    // 자동 리다이렉트는 useEffect에서 처리
  };

  const value: AuthContextType = {
    accessToken,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * 인증 상태와 함수를 가져옴
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
