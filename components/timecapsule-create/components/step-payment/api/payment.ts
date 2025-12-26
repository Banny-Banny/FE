/**
 * step-payment/api/payment.ts
 * 생성 시각: 2024-12-24
 * 수정 시각: 2024-12-26
 * 토스페이먼츠 결제 API 함수
 */

import axios from 'axios';
import type {
  TossPaymentConfirmRequest,
  TossPaymentConfirmResponse,
  TossPaymentResponse,
  TossPaymentCancelResponse,
  PaymentError,
} from './types/payment';

// ============================================
// axios 인스턴스
// ============================================

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

// ============================================
// API 함수
// ============================================

/**
 * 토스페이먼츠 결제 승인
 * @param paymentKey 결제 키
 * @param orderId 주문 ID
 * @param amount 결제 금액
 * @param accessToken JWT 토큰
 * @returns 결제 승인 결과
 */
export const confirmTossPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number,
  accessToken: string,
): Promise<TossPaymentConfirmResponse> => {
  try {
    console.log('🌐 [토스페이먼츠 승인 API 요청]');
    console.log('  - paymentKey:', paymentKey);
    console.log('  - orderId:', orderId);
    console.log('  - amount:', amount);

    const response = await apiClient.post<TossPaymentConfirmResponse>(
      '/api/payments/toss/confirm',
      {
        paymentKey,
        orderId,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log('📥 [토스페이먼츠 승인 API 응답]');
    console.log('  - 상태 코드:', response.status);
    console.log('  - 주문 ID:', response.data.order_id);
    console.log('  - 결제 상태:', response.data.status);

    return response.data;
  } catch (error: any) {
    // 에러 메시지 매핑
    const status = error.response?.status || 0;
    let message = '결제 승인에 실패했습니다';

    console.log('❌ [서버 에러 응답]', JSON.stringify(error.response?.data, null, 2));

    if (status === 400) {
      const errorCode = error.response?.data?.code;
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
      const errorCode = error.response?.data?.code;
      if (errorCode === 'ORDER_NOT_OWNED') {
        message = '다른 사용자의 주문입니다';
      } else {
        message = '로그인이 필요합니다';
      }
    } else if (status === 404) {
      const errorCode = error.response?.data?.code;
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
 * 토스페이먼츠 결제 조회 (paymentKey) - 선택사항
 */
export const getTossPaymentByKey = async (
  paymentKey: string,
  accessToken: string,
): Promise<TossPaymentResponse> => {
  const response = await apiClient.get<TossPaymentResponse>(
    `/api/payments/toss/${paymentKey}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
};

/**
 * 토스페이먼츠 결제 조회 (orderNo) - 선택사항
 */
export const getTossPaymentByOrderNo = async (
  orderNo: string,
  accessToken: string,
): Promise<TossPaymentResponse> => {
  const response = await apiClient.get<TossPaymentResponse>(
    `/api/payments/toss/orders/${orderNo}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
};

/**
 * 토스페이먼츠 결제 취소 - 선택사항
 * @param paymentKey 결제 키
 * @param cancelReason 취소 사유
 * @param cancelAmount 취소 금액 (선택, 없으면 전액 취소)
 * @param accessToken JWT 토큰
 * @returns 결제 취소 결과
 */
export const cancelTossPayment = async (
  paymentKey: string,
  cancelReason: string,
  cancelAmount: number | undefined,
  accessToken: string,
): Promise<TossPaymentCancelResponse> => {
  try {
    const response = await apiClient.post<TossPaymentCancelResponse>(
      `/api/payments/toss/${paymentKey}/cancel`,
      {
        cancelReason,
        ...(cancelAmount !== undefined && { cancelAmount }),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    // 에러 메시지 매핑
    const status = error.response?.status || 0;
    let message = '결제 취소에 실패했습니다';

    if (status === 400) {
      const errorCode = error.response?.data?.code;
      if (errorCode === 'TOSS_SECRET_KEY_REQUIRED') {
        message = '결제 시스템 설정 오류입니다. 관리자에게 문의해주세요';
      } else if (errorCode === 'TOSS_CANCEL_FAILED') {
        message = `결제 취소에 실패했습니다: ${error.response?.data?.message || ''}`;
      } else {
        message = error.response?.data?.message || message;
      }
    } else if (status === 401) {
      const errorCode = error.response?.data?.code;
      if (errorCode === 'ORDER_NOT_OWNED') {
        message = '다른 사용자의 결제는 취소할 수 없습니다';
      } else {
        message = '로그인이 필요합니다';
      }
    } else if (status === 404) {
      message = '결제 정보를 찾을 수 없습니다';
    } else if (!status) {
      message = '네트워크 연결을 확인해주세요';
    }

    const paymentError: PaymentError = { status, message };
    throw paymentError;
  }
};
