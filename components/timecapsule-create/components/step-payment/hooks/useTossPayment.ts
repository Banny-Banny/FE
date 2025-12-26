/**
 * hooks/useTossPayment.ts
 * 생성 시각: 2024-12-26
 * 토스페이먼츠 결제 Hook
 */

import { useCallback, useState } from 'react';
import TossPayments from '@tosspayments/payment-sdk-react-native';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { confirmTossPayment } from '../api/payment';
import type {
  TossPaymentConfirmResponse,
  PaymentError,
} from '../api/types/payment';

// ============================================
// Hook 반환 타입
// ============================================

interface UseTossPaymentReturn {
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 정보 */
  error: PaymentError | null;
  /** 토스페이먼츠 결제 요청 */
  requestPayment: (
    orderId: string,
    amount: number,
    orderName: string,
    customerName?: string,
  ) => Promise<void>;
  /** 결제 승인 */
  confirmPayment: (
    paymentKey: string,
    orderId: string,
    amount: number,
  ) => Promise<TossPaymentConfirmResponse>;
  /** 에러 클리어 */
  clearError: () => void;
}

// ============================================
// Hook
// ============================================

/**
 * 토스페이먼츠 결제 Hook
 * @returns 결제 관련 상태 및 함수
 *
 * @example
 * const { isLoading, error, requestPayment, confirmPayment } = useTossPayment();
 *
 * // 결제 요청
 * try {
 *   await requestPayment(orderId, amount, '타임캡슐 생성', '홍길동');
 * } catch (err) {
 *   console.error('결제 요청 실패:', err);
 * }
 *
 * // 결제 승인 (딥링크 복귀 시)
 * try {
 *   const result = await confirmPayment(paymentKey, orderId, amount);
 * } catch (err) {
 *   console.error('결제 승인 실패:', err);
 * }
 */
export const useTossPayment = (): UseTossPaymentReturn => {
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
  // 토스페이먼츠 결제 요청
  // ============================================

  /**
   * 토스페이먼츠 결제 요청
   */
  const requestPayment = useCallback(
    async (
      orderId: string,
      amount: number,
      orderName: string,
      customerName?: string,
    ): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // 토스페이먼츠 클라이언트 키 (환경 변수)
        const clientKey = process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY;

        if (!clientKey) {
          throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다');
        }

        console.log('💳 [토스페이먼츠 결제 시작]');
        console.log('  - 주문 ID:', orderId);
        console.log('  - 금액:', amount);
        console.log('  - 주문명:', orderName);

        // 토스페이먼츠 SDK 초기화
        const tossPayments = await TossPayments(clientKey);

        // 결제 요청
        await tossPayments.requestPayment('카드', {
          amount,
          orderId,
          orderName,
          customerName: customerName || '고객',
          successUrl: 'myapp://pay/toss/success',
          failUrl: 'myapp://pay/toss/fail',
        });

        console.log('✅ [토스페이먼츠 결제 페이지 열림]');
      } catch (err) {
        console.error('❌ [토스페이먼츠 결제 실패]', err);

        const paymentError: PaymentError = {
          status: 0,
          message: err instanceof Error ? err.message : '결제 페이지를 열 수 없습니다',
        };

        setError(paymentError);
        throw paymentError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ============================================
  // 결제 승인
  // ============================================

  /**
   * 결제 승인
   */
  const confirmPayment = useCallback(
    async (
      paymentKey: string,
      orderId: string,
      amount: number,
    ): Promise<TossPaymentConfirmResponse> => {
      try {
        setIsLoading(true);
        setError(null);

        if (!accessToken) {
          throw new Error('로그인이 필요합니다');
        }

        console.log('💳 [결제 승인 시작]');
        console.log('  - paymentKey:', paymentKey);
        console.log('  - orderId:', orderId);
        console.log('  - amount:', amount);

        const response = await confirmTossPayment(
          paymentKey,
          orderId,
          amount,
          accessToken,
        );

        console.log('✅ [결제 승인 성공]');
        console.log('  - 주문번호:', response.order_id);
        console.log('  - 상태:', response.status);
        console.log('  - 금액:', response.amount);

        return response;
      } catch (err) {
        console.error('❌ [결제 승인 실패]', err);

        const paymentError =
          err instanceof Error && 'status' in err
            ? (err as PaymentError)
            : {
                status: 0,
                message: err instanceof Error ? err.message : '결제 승인에 실패했습니다',
              };

        setError(paymentError);
        throw paymentError;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken],
  );

  // ============================================
  // 에러 클리어
  // ============================================

  /**
   * 에러 클리어
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
    requestPayment,
    confirmPayment,
    clearError,
  };
};
