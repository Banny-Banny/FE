/**
 * hooks/useTossPayment.ts
 * 토스페이먼츠 결제 Hook
 */

import TossPayments from '@tosspayments/payment-sdk-react-native';
import { useCallback, useState } from 'react';
import { confirmTossPayment } from '../api/payment';
import type { PaymentError, TossPaymentConfirmResponse } from '../api/types/types';

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

        const candidates = [
          (TossPayments as any)?.default?.default,
          (TossPayments as any)?.default,
          TossPayments,
        ];
        const tossPaymentsFactory = candidates.find((c) => typeof c === 'function');

        if (!tossPaymentsFactory) {
          throw new Error('TossPayments SDK 로딩 실패: 유효한 팩토리를 찾을 수 없습니다');
        }

        const tossPayments = await tossPaymentsFactory(clientKey);
        await tossPayments.requestPayment('카드', {
          amount,
          orderId,
          orderName,
          customerName: customerName || '고객',
          successUrl: 'timeegg://pay/toss/success',
          failUrl: 'timeegg://pay/toss/fail',
        });
      } catch (err: unknown) {
        const status = typeof (err as any)?.status === 'number' ? (err as any).status : 0;
        const message =
          err instanceof Error
            ? err.message
            : typeof (err as any)?.message === 'string'
              ? (err as any).message
              : '결제 페이지를 열 수 없습니다';

        const paymentError: PaymentError = { status, message };
        console.error('❌ [TossPayment] 결제 페이지 오픈 실패:', err);
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
