/**
 * hooks/useKakaoPayment.ts
 * 생성 시각: 2024-12-24
 * 카카오페이 결제 Hook
 */

import { useCallback, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { approveKakaoPay, readyKakaoPay } from '../api/payment';
import type {
  KakaoPayApproveResponse,
  KakaoPayReadyResponse,
  PaymentError,
} from '../api/types/payment';

// ============================================
// Hook 반환 타입
// ============================================

interface UseKakaoPaymentReturn {
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 정보 */
  error: PaymentError | null;
  /** 결제 준비 함수 */
  readyPayment: (orderId: string) => Promise<KakaoPayReadyResponse>;
  /** 결제 승인 함수 */
  approvePayment: (orderId: string, pgToken: string) => Promise<KakaoPayApproveResponse>;
  /** 카카오페이 브라우저 열기 */
  openKakaoPayBrowser: (redirectUrl: string) => Promise<void>;
  /** 에러 클리어 함수 */
  clearError: () => void;
}

// ============================================
// Hook
// ============================================

/**
 * 카카오페이 결제 Hook
 * @returns 결제 관련 상태 및 함수
 *
 * @example
 * const { isLoading, error, readyPayment, approvePayment, openKakaoPayBrowser } = useKakaoPayment();
 *
 * // 결제 준비
 * try {
 *   const { redirect_url } = await readyPayment(orderId);
 *   await openKakaoPayBrowser(redirect_url);
 * } catch (err) {
 *   console.error('결제 준비 실패:', err);
 * }
 */
export const useKakaoPayment = (): UseKakaoPaymentReturn => {
  // ============================================
  // 인증 정보
  // ============================================

  /** 로그인된 사용자의 토큰 */
  const { accessToken } = useAuth();

  // ============================================
  // 상태 관리
  // ============================================

  /** 로딩 상태 */
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** 에러 정보 */
  const [error, setError] = useState<PaymentError | null>(null);

  // ============================================
  // 결제 준비 함수
  // ============================================

  /**
   * 결제 준비 함수
   * @param orderId 주문 ID
   * @returns 결제 준비 응답 (tid, redirect_url 포함)
   * @throws 결제 준비 실패 시 에러
   */
  const readyPayment = useCallback(
    async (orderId: string): Promise<KakaoPayReadyResponse> => {
      try {
        setIsLoading(true);
        setError(null);

        // 로그인된 사용자의 토큰 확인
        if (!accessToken) {
          const authError: PaymentError = {
            status: 401,
            message: '로그인이 필요합니다',
          };
          setError(authError);
          throw new Error(authError.message);
        }

        console.log('💳 [결제 준비 시작]');
        console.log('  - 주문 ID:', orderId);

        // API 호출
        const response = await readyKakaoPay(orderId, accessToken);

        console.log('✅ [결제 준비 성공]');
        console.log('  - TID:', response.tid);
        console.log('  - Redirect URL:', response.redirect_url);

        return response;
      } catch (err) {
        // 에러 처리
        console.error('❌ [결제 준비 실패]', err);

        let paymentError: PaymentError;
        if (err instanceof Error) {
          paymentError = {
            status: 0,
            message: err.message,
          };
        } else {
          paymentError = {
            status: 0,
            message: '결제 준비에 실패했습니다',
          };
        }

        setError(paymentError);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken],
  );

  // ============================================
  // 결제 승인 함수
  // ============================================

  /**
   * 결제 승인 함수
   * @param orderId 주문 ID
   * @param pgToken 카카오페이 pg_token
   * @returns 결제 승인 응답
   * @throws 결제 승인 실패 시 에러
   */
  const approvePayment = useCallback(
    async (orderId: string, pgToken: string): Promise<KakaoPayApproveResponse> => {
      try {
        setIsLoading(true);
        setError(null);

        // 로그인된 사용자의 토큰 확인
        if (!accessToken) {
          const authError: PaymentError = {
            status: 401,
            message: '로그인이 필요합니다',
          };
          setError(authError);
          throw new Error(authError.message);
        }

        console.log('💳 [결제 승인 시작]');
        console.log('  - 주문 ID:', orderId);
        console.log('  - pg_token:', pgToken);

        // API 호출
        const response = await approveKakaoPay(orderId, pgToken, accessToken);

        console.log('✅ [결제 승인 성공]');
        console.log('  - 주문 ID:', response.order_id);
        console.log('  - 상태:', response.status);
        console.log('  - 금액:', response.amount);

        return response;
      } catch (err) {
        // 에러 처리
        console.error('❌ [결제 승인 실패]', err);

        let paymentError: PaymentError;
        if (err instanceof Error) {
          paymentError = {
            status: 0,
            message: err.message,
          };
        } else {
          paymentError = {
            status: 0,
            message: '결제 승인에 실패했습니다',
          };
        }

        setError(paymentError);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken],
  );

  // ============================================
  // 카카오페이 브라우저 열기
  // ============================================

  /**
   * 카카오페이 결제 페이지 브라우저 열기
   * @param redirectUrl 카카오페이 리다이렉트 URL
   */
  const openKakaoPayBrowser = useCallback(async (redirectUrl: string): Promise<void> => {
    try {
      console.log('🌐 [카카오페이 브라우저 열기]');
      console.log('  - URL:', redirectUrl);

      // expo-web-browser로 카카오페이 결제 페이지 열기
      const result = await WebBrowser.openBrowserAsync(redirectUrl);

      console.log('🌐 [브라우저 결과]', result.type);
    } catch (err) {
      console.error('❌ [브라우저 열기 실패]', err);
      throw new Error('카카오페이 결제 페이지를 열 수 없습니다');
    }
  }, []);

  // ============================================
  // 에러 클리어 함수
  // ============================================

  /**
   * 에러 정보 클리어
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // 반환값
  // ============================================

  return {
    isLoading,
    error,
    readyPayment,
    approvePayment,
    openKakaoPayBrowser,
    clearError,
  };
};
