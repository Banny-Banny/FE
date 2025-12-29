/**
 * hooks/useTossPayment.ts
 * 토스페이먼츠 결제 Hook
 */

import TossPayments from '@tosspayments/payment-sdk-react-native';
import { useCallback, useState } from 'react';
import { confirmTossPayment } from '../api/payment';
import type { PaymentError, TossPaymentConfirmResponse } from '../api/types/payment';

interface UseTossPaymentReturn {
  isLoading: boolean;
  error: PaymentError | null;
  requestPayment: (
    orderId: string,
    amount: number,
    orderName: string,
    customerName?: string,
  ) => Promise<void>;
  confirmPayment: (
    paymentKey: string,
    orderId: string,
    amount: number,
  ) => Promise<TossPaymentConfirmResponse>;
  clearError: () => void;
}

export const useTossPayment = (): UseTossPaymentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);

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

        const clientKey = process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) {
          throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다');
        }

        // @ts-ignore - deprecated 패키지의 타입 정의 문제 우회
        const tossPayments = await TossPayments(clientKey);
        await tossPayments.requestPayment('카드', {
          amount,
          orderId,
          orderName,
          customerName: customerName || '고객',
          successUrl: 'myapp://pay/toss/success',
          failUrl: 'myapp://pay/toss/fail',
        });
      } catch (err) {
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
    requestPayment,
    confirmPayment,
    clearError,
  };
};
