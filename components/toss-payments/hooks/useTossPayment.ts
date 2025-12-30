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
