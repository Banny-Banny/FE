/**
 * step-payment/api/payment.ts
 * 토스페이먼츠 결제 API 함수
 */

import { apiClient } from '@/utils';
import type {
  PaymentError,
  TossPaymentCancelResponse,
  TossPaymentConfirmResponse,
  TossPaymentResponse,
} from './types/payment';

/**
 * 토스페이먼츠 결제 승인
 */
export const confirmTossPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<TossPaymentConfirmResponse> => {
  try {
    const response = await apiClient.post<TossPaymentConfirmResponse>(
      '/api/payments/toss/confirm',
      { paymentKey, orderId, amount },
    );
    return response.data;
  } catch (error: any) {
    const status = error.response?.status || 0;
    let message = '결제 승인에 실패했습니다';

    const errorCode = error.response?.data?.code;
    if (status === 400) {
      if (errorCode === 'AMOUNT_MISMATCH') {
        message = '결제 금액이 일치하지 않습니다';
      } else if (errorCode === 'ORDER_ALREADY_PAID') {
        message = '이미 결제가 완료된 주문입니다';
      } else if (errorCode === 'TOSS_SECRET_KEY_REQUIRED') {
        message = '결제 시스템 설정 오류입니다. 관리자에게 문의해주세요';
      } else if (errorCode === 'TOSS_CONFIRM_FAILED') {
        message = `결제 승인에 실패했습니다: ${error.response?.data?.message || ''}`;
      } else {
        message = error.response?.data?.message || message;
      }
    } else if (status === 401) {
      message = errorCode === 'ORDER_NOT_OWNED' ? '다른 사용자의 주문입니다' : '로그인이 필요합니다';
    } else if (status === 404) {
      if (errorCode === 'ORDER_NOT_FOUND') {
        message = '주문 정보를 찾을 수 없습니다';
      } else if (errorCode === 'PRODUCT_NOT_FOUND_OR_INVALID') {
        message = '상품 정보가 유효하지 않습니다';
      }
    } else if (status === 500) {
      message = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요';
    } else if (!status) {
      message = '네트워크 연결을 확인해주세요';
    }

    const paymentError: PaymentError = { status, message };
    throw paymentError;
  }
};

/**
 * 토스페이먼츠 결제 조회 (paymentKey)
 */
export const getTossPaymentByKey = async (paymentKey: string): Promise<TossPaymentResponse> => {
  const response = await apiClient.get<TossPaymentResponse>(`/api/payments/toss/${paymentKey}`);
  return response.data;
};

/**
 * 토스페이먼츠 결제 조회 (orderNo)
 */
export const getTossPaymentByOrderNo = async (orderNo: string): Promise<TossPaymentResponse> => {
  const response = await apiClient.get<TossPaymentResponse>(`/api/payments/toss/orders/${orderNo}`);
  return response.data;
};

/**
 * 토스페이먼츠 결제 취소
 */
export const cancelTossPayment = async (
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number,
): Promise<TossPaymentCancelResponse> => {
  try {
    const response = await apiClient.post<TossPaymentCancelResponse>(
      `/api/payments/toss/${paymentKey}/cancel`,
      {
        cancelReason,
        ...(cancelAmount !== undefined && { cancelAmount }),
      },
    );
    return response.data;
  } catch (error: any) {
    const status = error.response?.status || 0;
    let message = '결제 취소에 실패했습니다';

    const errorCode = error.response?.data?.code;
    if (status === 400) {
      if (errorCode === 'TOSS_SECRET_KEY_REQUIRED') {
        message = '결제 시스템 설정 오류입니다. 관리자에게 문의해주세요';
      } else if (errorCode === 'TOSS_CANCEL_FAILED') {
        message = `결제 취소에 실패했습니다: ${error.response?.data?.message || ''}`;
      } else {
        message = error.response?.data?.message || message;
      }
    } else if (status === 401) {
      message =
        errorCode === 'ORDER_NOT_OWNED'
          ? '다른 사용자의 결제는 취소할 수 없습니다'
          : '로그인이 필요합니다';
    } else if (status === 404) {
      message = '결제 정보를 찾을 수 없습니다';
    } else if (!status) {
      message = '네트워크 연결을 확인해주세요';
    }

    const paymentError: PaymentError = { status, message };
    throw paymentError;
  }
};
