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
   * ⚠️ 중요: 모든 라우팅 책임은 여기서만 처리함
   * - 비로그인 사용자 → 로그인 페이지
   * - 로그인 성공 → 무조건 index.tsx (ROUTES.MAIN = '/')
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

    // 현재 경로 확인
    // segments 예시:
    // - ['(auth)', 'login'] → 로그인 페이지
    // - ['(auth)', 'auth', 'callback'] → OAuth 콜백 (app/(auth)/auth/callback.tsx)
    // - ['(tabs)', 'index'] → 메인 페이지
    const inAuthGroup = segments[0] === '(auth)';
    // 콜백 페이지는 app/(auth)/auth/callback.tsx에 있으므로 segments가 ['(auth)', 'auth', 'callback']이 됨
    const isAuthCallback =
      (segments[0] === 'auth' && segments[1] === 'callback') ||
      (segments[0] === '(auth)' && segments[1] === 'auth' && segments[2] === 'callback');
    const isAuthenticated = !!accessToken;

    if (__DEV__) {
      console.log('[Auth Guard] 상태 확인:', {
        segments,
        inAuthGroup,
        isAuthCallback,
        isAuthenticated,
        isLoading,
      });
    }

    // ✅ 로그인 성공: 인증된 사용자가 auth 페이지에 있으면 메인으로 이동
    // ⚠️ 중요: 콜백 페이지는 제외 (콜백 페이지에서 login() 함수가 이미 리다이렉트 처리)
    // 콜백 페이지에서 중복 리다이렉트를 방지하기 위해 가드에서 제외
    if (isAuthenticated && inAuthGroup) {
      if (__DEV__) {
        console.log('[Auth Guard] 로그인 성공, 메인으로 이동');
      }
      router.replace(ROUTES.MAIN); // '/' → index.tsx
      return;
    }

    // ❌ 비로그인: 인증되지 않은 사용자가 보호된 페이지에 있으면 로그인 페이지로 이동
    // ⚠️ 중요: 콜백 페이지는 제외 (콜백 처리 중일 수 있음)
    if (!isAuthenticated && !inAuthGroup && !isAuthCallback) {
      if (__DEV__) {
        console.log('[Auth Guard] 비로그인, 로그인 페이지로 이동');
      }
      router.replace(ROUTES.AUTH_LOGIN);
      return;
    }
  }, [isLoading, accessToken, segments, router]);

  /**
   * 로그인 함수
   * @param token - 액세스 토큰
   * @param userData - 유저 정보
   *
   * ⚠️ 중요: 상태 업데이트 후 즉시 메인으로 이동
   * 가드가 실행되기 전에 명시적으로 이동하여 타이밍 문제 해결
   */
  const login = async (token: string, userData: User): Promise<void> => {
    try {
      // 로딩 상태로 설정하여 가드가 실행되지 않도록 함
      setIsLoading(true);

      // AsyncStorage에 토큰과 유저 정보 저장
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
      ]);

      // Context 상태 업데이트 (동기적으로 실행)
      setAccessToken(token);
      setUser(userData);

      // 로딩 완료
      setIsLoading(false);

      // ⚠️ 핵심: 상태 업데이트 후 즉시 메인으로 이동
      // 가드가 실행되기 전에 명시적으로 이동하여 타이밍 문제 해결
      // 웹 환경에서는 한 번만 호출하여 무한 리다이렉트 방지
      if (__DEV__) {
        console.log('[Login] 상태 업데이트 완료, 메인으로 이동:', ROUTES.MAIN);
      }

      // 현재 경로 확인하여 중복 리다이렉트 방지
      const currentPath = segments.join('/');
      const isAlreadyAtMain = currentPath === '(tabs)' || currentPath === '';

      if (!isAlreadyAtMain) {
        router.replace(ROUTES.MAIN);
        if (__DEV__) {
          console.log('[Login] router.replace() 호출 완료');
        }
      } else {
        if (__DEV__) {
          console.log('[Login] 이미 메인 페이지에 있음, 리다이렉트 스킵');
        }
      }
    } catch (error) {
      setIsLoading(false);
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
