/**
 * useNavigation
 * Expo Router 기반 페이지 이동을 위한 재사용 가능한 커스텀 훅
 *
 * @example
 * ```tsx
 * import { ROUTES } from '@/commons/constants/routes';
 * const navigation = useNavigation();
 *
 * // 페이지 이동
 * navigation.push(ROUTES.TIMECAPSULE_CREATE);
 *
 * // 쿼리 파라미터와 함께 이동
 * navigation.push(ROUTES.TIMECAPSULE_DETAIL, { id: '123' });
 *
 * // 뒤로가기
 * navigation.back();
 *
 * // 홈으로 이동 (스택 초기화)
 * navigation.toHome();
 * ```
 */

import { ROUTES } from '@/commons/constants/routes';
import { Href, router } from 'expo-router';
import { useCallback } from 'react';

interface NavigationParams {
  [key: string]: string | number | boolean | undefined;
}

export function useNavigation() {
  /**
   * 특정 페이지로 이동 (히스토리 스택에 추가)
   * @param path - 이동할 경로
   * @param params - URL 쿼리 파라미터 (선택사항)
   */
  const push = useCallback((path: string, params?: NavigationParams) => {
    try {
      if (params) {
        const queryString = new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>),
        ).toString();

        const href = `${path}?${queryString}` as Href;
        router.push(href);
      } else {
        router.push(path as Href);
      }
    } catch (error) {
      console.error('Navigation push error:', error);
    }
  }, []);

  /**
   * 특정 페이지로 교체 (현재 페이지를 히스토리에서 제거하고 이동)
   * @param path - 이동할 경로
   * @param params - URL 쿼리 파라미터 (선택사항)
   */
  const replace = useCallback((path: string, params?: NavigationParams) => {
    try {
      if (params) {
        const queryString = new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>),
        ).toString();

        const href = `${path}?${queryString}` as Href;
        router.replace(href);
      } else {
        router.replace(path as Href);
      }
    } catch (error) {
      console.error('Navigation replace error:', error);
    }
  }, []);

  /**
   * 이전 페이지로 돌아가기
   */
  const back = useCallback(() => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        console.warn('Cannot go back: No previous screen in history');
      }
    } catch (error) {
      console.error('Navigation back error:', error);
    }
  }, []);

  /**
   * 뒤로 가기가 가능한지 확인
   */
  const canGoBack = useCallback(() => {
    return router.canGoBack();
  }, []);

  /**
   * 홈 화면으로 이동 (모든 네비게이션 스택 초기화)
   */
  const toHome = useCallback(() => {
    try {
      router.replace(ROUTES.HOME as Href);
    } catch (error) {
      console.error('Navigation toHome error:', error);
    }
  }, []);

  /**
   * 여러 단계 뒤로 가기
   * @param steps - 뒤로 갈 단계 수 (기본값: 1)
   */
  const goBackSteps = useCallback((steps: number = 1) => {
    try {
      for (let i = 0; i < steps; i++) {
        if (router.canGoBack()) {
          router.back();
        } else {
          console.warn(`Can only go back ${i} steps, not ${steps}`);
          break;
        }
      }
    } catch (error) {
      console.error('Navigation goBackSteps error:', error);
    }
  }, []);

  return {
    push,
    replace,
    back,
    canGoBack,
    toHome,
    goBackSteps,
  };
}

