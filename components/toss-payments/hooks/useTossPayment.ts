/**
 * hooks/useTossPayment.ts
 * 토스페이먼츠 결제 Hook (WebView 기반)
 */

import { useCallback, useState } from 'react';
import { confirmTossPayment } from '../api/payment';
import type { PaymentError, TossPaymentConfirmResponse } from '../api/types/types';

interface PaymentRequestData {
  orderId: string;
  amount: number;
  orderName: string;
  customerName?: string;
}

// ============================================
// 개발 모드 설정
// ============================================

/**
 * 개발 모드에서 결제 우회 (백엔드 연결 없이 개발 시 true로 설정)
 * true로 설정하면 토스페이먼츠 결제를 건너뛰고 Mock 데이터로 다음 단계로 진행합니다.
 */
export const SKIP_PAYMENT = __DEV__ && true;

// ============================================
// Hook 반환 타입
// ============================================

interface UseTossPaymentReturn {
  isLoading: boolean;
  error: PaymentError | null;
  paymentData: PaymentRequestData | null;
  setPaymentData: (data: PaymentRequestData | null) => void;
  confirmPayment: (
    paymentKey: string,
    orderId: string,
    amount: number,
  ) => Promise<TossPaymentConfirmResponse>;
  clearError: () => void;
}

/**
 * 토스페이먼츠 결제 Hook
 * WebView를 사용하여 결제창을 띄우고 결제 승인 처리
 */
export const useTossPayment = (): UseTossPaymentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentRequestData | null>(null);

  const confirmPayment = useCallback(
    async (
      paymentKey: string,
      orderId: string,
      amount: number,
    ): Promise<TossPaymentConfirmResponse> => {
      try {
        setIsLoading(true);
        setError(null);

        // ============================================
        // 개발 모드: 결제 승인 우회
        // ============================================
        if (SKIP_PAYMENT) {
          console.log('🔧 [개발 모드] 결제 승인 우회 - Mock 데이터 사용');
          console.log('  - paymentKey:', paymentKey);
          console.log('  - orderId:', orderId);
          console.log('  - amount:', amount);

          // Mock 데이터 반환 (실제 백엔드 응답 형식과 동일하게)
          const mockResponse: TossPaymentConfirmResponse = {
            order_id: orderId,
            payment_key: 'mock-payment-key-' + Date.now(),
            status: 'DONE',
            amount: amount,
            approved_at: new Date().toISOString(),
          };

          // 로딩 상태 시뮬레이션 (500ms 대기)
          await new Promise((resolve) => setTimeout(resolve, 500));

          console.log('✅ [개발 모드] Mock 결제 승인 완료');
          return mockResponse;
        }

        // ============================================
        // 프로덕션 모드: 실제 결제 승인
        // ============================================

        const response = await confirmTossPayment(paymentKey, orderId, amount);
        return response;
      } catch (err) {
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
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    paymentData,
    setPaymentData,
    confirmPayment,
    clearError,
  };
};
