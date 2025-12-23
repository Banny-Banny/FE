/**
 * commons/layout/provider/auth/auth.provider.tsx
 * 인증 상태를 전역으로 관리하는 AuthProvider
 */

import { ROUTES } from '@/commons/constants/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from './types';

// 개발 모드에서 인증 체크 우회 (백엔드 연결 없이 개발 시 true로 설정)
const SKIP_AUTH_CHECK = __DEV__ && false; // true로 설정하면 인증 체크를 건너뜁니다

// AsyncStorage 키 상수
const STORAGE_KEYS = {
  ACCESS_TOKEN: '@auth/accessToken',
  USER_DATA: '@auth/userData',
} as const;

// AuthContext 타입 정의
interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Props
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider 컴포넌트
 * 인증 상태를 전역으로 관리하고, AsyncStorage와 동기화합니다.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const segments = useSegments();

  /**
   * 앱 실행 시 인증 상태 초기화
   * AsyncStorage에 저장된 토큰과 유저 정보를 확인하여 상태를 복구합니다.
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // AsyncStorage에서 토큰과 유저 정보 가져오기
        const [storedToken, storedUserData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        ]);

        if (storedToken && storedUserData) {
          // 토큰과 유저 정보가 있으면 상태 복구
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUserData));
        } else {
          // 없으면 비로그인 상태로 초기화
          setAccessToken(null);
          setUser(null);
        }
      } catch (error) {
        // 에러 발생 시 비로그인 상태로 초기화
        if (__DEV__) {
          console.error('Auth initialization error:', error);
        }
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  /**
   * 인증 상태에 따른 자동 리다이렉트
   * 인증되지 않은 사용자가 보호된 라우트에 접근할 때 로그인 페이지로 리다이렉트합니다.
   */
  useEffect(() => {
    // 개발 모드에서 인증 체크 우회 설정이 켜져 있으면 리다이렉트하지 않음
    if (SKIP_AUTH_CHECK) {
      return;
    }

    // 로딩 중이면 리다이렉트하지 않음
    if (isLoading) {
      return;
    }

    // 현재 경로 확인 (segments는 ['(auth)', 'login'] 또는 ['(tabs)', 'index'] 형태)
    const inAuthGroup = segments[0] === '(auth)';
    const isAuthenticated = !!accessToken;

    // 인증되지 않은 사용자가 인증 페이지가 아닌 곳에 있으면 로그인 페이지로 리다이렉트
    if (!isAuthenticated && !inAuthGroup) {
      router.replace(ROUTES.AUTH_LOGIN);
    }

    // 인증된 사용자가 인증 페이지에 있으면 메인 페이지로 리다이렉트
    if (isAuthenticated && inAuthGroup) {
      router.replace(ROUTES.MAIN);
    }
  }, [isLoading, accessToken, segments, router]);

  /**
   * 로그인 함수
   * @param token - 액세스 토큰
   * @param userData - 유저 정보
   */
  const login = async (token: string, userData: User): Promise<void> => {
    try {
      // AsyncStorage에 토큰과 유저 정보 저장
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
      ]);

      // Context 상태 업데이트
      setAccessToken(token);
      setUser(userData);

      // 메인 화면으로 이동
      router.replace(ROUTES.MAIN);
    } catch (error) {
      if (__DEV__) {
        console.error('Login error:', error);
      }
      throw error;
    }
  };

  /**
   * 로그아웃 함수
   * AsyncStorage의 토큰과 유저 정보를 삭제하고 상태를 초기화합니다.
   */
  const logout = async (): Promise<void> => {
    try {
      // AsyncStorage에서 토큰과 유저 정보 삭제
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);

      // Context 상태 초기화
      setAccessToken(null);
      setUser(null);

      // 로그인 화면으로 이동
      router.replace(ROUTES.AUTH_LOGIN);
    } catch (error) {
      if (__DEV__) {
        console.error('Logout error:', error);
      }
      throw error;
    }
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
 * useAuth 커스텀 훅
 * AuthContext를 쉽게 사용할 수 있도록 하는 훅입니다.
 * @throws {Error} AuthProvider 외부에서 사용 시 에러 발생
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
