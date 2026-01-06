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

// 온보딩 상태 타입 정의
interface OnboardingStatus {
  isFriendConsentDone: boolean;
  isLocationConsentDone: boolean;
}

// AuthContext 타입 정의
interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  onboardingStatus: OnboardingStatus;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  completeFriendConsent: () => Promise<void>;
  completeLocationConsent: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>({
    isFriendConsentDone: false,
    isLocationConsentDone: false,
  });
  const router = useRouter();
  const segments = useSegments();

  // 앱 시작 시 저장된 인증 정보 및 온보딩 상태 복구
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [token, userData, friendConsent, locationConsent] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
          AsyncStorage.getItem(STORAGE_KEYS.FRIEND_CONSENT),
          AsyncStorage.getItem(STORAGE_KEYS.LOCATION_CONSENT),
        ]);

        if (token && userData) {
          setAccessToken(token);
          setUser(JSON.parse(userData));
        }

        // 온보딩 상태 복구
        setOnboardingStatus({
          isFriendConsentDone: friendConsent === 'true',
          isLocationConsentDone: locationConsent === 'true',
        });
      } catch (error) {
        // 초기화 오류 처리
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 인증 상태 및 온보딩 단계에 따른 자동 리다이렉트
  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = segments[0] === '(auth)';
    const isAuthenticated = !!accessToken;
    const currentRoute = segments[1]; // (auth) 그룹 내의 실제 라우트 (예: 'login', 'friend-consent', 'location-consent')

    if (isAuthenticated) {
      // 온보딩 단계 확인 및 리다이렉트
      if (!onboardingStatus.isFriendConsentDone) {
        // 친구 연동 동의 미완료
        if (currentRoute !== 'friend-consent') {
          router.replace(ROUTES.AUTH_FRIEND_CONSENT);
        }
      } else if (!onboardingStatus.isLocationConsentDone) {
        // 위치 연동 동의 미완료
        if (currentRoute !== 'location-consent') {
          router.replace(ROUTES.AUTH_LOCATION_CONSENT);
        }
      } else if (isAuthPage && currentRoute !== 'login') {
        // 온보딩 완료 + 인증 페이지 (로그인 제외) → 메인으로
        router.replace(ROUTES.MAIN);
      }
    } else if (!isAuthPage) {
      // 미인증 + 메인 페이지 → 로그인으로
      router.replace(ROUTES.AUTH_LOGIN);
    }
  }, [isLoading, accessToken, onboardingStatus, segments, router]);

  /**
   * 로그인: 토큰과 유저 정보 저장 및 메인으로 이동
   */
  const login = async (token: string, userData: User): Promise<void> => {
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
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      AsyncStorage.removeItem(STORAGE_KEYS.FRIEND_CONSENT),
      AsyncStorage.removeItem(STORAGE_KEYS.LOCATION_CONSENT),
    ]);

    setAccessToken(null);
    setUser(null);
    setOnboardingStatus({
      isFriendConsentDone: false,
      isLocationConsentDone: false,
    });

    // 자동 리다이렉트는 useEffect에서 처리
  };

  /**
   * 친구 연동 동의 완료
   */
  const completeFriendConsent = async (): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.FRIEND_CONSENT, 'true');
    setOnboardingStatus((prev) => ({
      ...prev,
      isFriendConsentDone: true,
    }));

    // 자동 리다이렉트는 useEffect에서 처리
  };

  /**
   * 위치 연동 동의 완료
   */
  const completeLocationConsent = async (): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.LOCATION_CONSENT, 'true');
    setOnboardingStatus((prev) => ({
      ...prev,
      isLocationConsentDone: true,
    }));

    // 자동 리다이렉트는 useEffect에서 처리
  };

  const value: AuthContextType = {
    accessToken,
    user,
    isLoading,
    onboardingStatus,
    login,
    logout,
    completeFriendConsent,
    completeLocationConsent,
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
