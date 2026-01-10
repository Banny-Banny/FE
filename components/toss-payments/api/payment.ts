/**
 * step-payment/api/payment.ts
 * 토스페이먼츠 결제 API 함수
 */

import { API_ENDPOINTS } from '@/commons/constants';
import { apiClient } from '@/utils';
import type {
  GetMyPaymentsParams,
  PaymentListResponse,
} from '../components/payment-history/types';
import type {
  PaymentError,
  TossPaymentCancelResponse,
  TossPaymentConfirmResponse,
  TossPaymentResponse,
} from './types/types';

/**
 * 토스페이먼츠 결제 승인
 * @param paymentKey 토스페이먼츠에서 발급한 결제 키
 * @param orderId 주문 ID (백엔드에서 생성한 order_id)
 * @param amount 결제 금액
 * @returns 결제 승인 응답 (order_id, payment_key, status, amount, approved_at, capsule_id, receipt_url)
 */
export const confirmTossPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<TossPaymentConfirmResponse> => {
  try {
    const endpoint = `/${API_ENDPOINTS.PAYMENT.TOSS_CONFIRM}`;
    const requestBody = { paymentKey, orderId, amount };

    console.log('🌐 [confirmTossPayment] API 호출 시작');
    console.log('  - Endpoint:', endpoint);
    console.log('  - Method: POST');
    console.log('  - Request Body:', {
      paymentKey: paymentKey.substring(0, 20) + '...', // 보안을 위해 일부만 표시
      orderId,
      amount,
    });
    console.log('  - Base URL:', apiClient.defaults.baseURL || '설정되지 않음');
    console.log('  - Full URL:', `${apiClient.defaults.baseURL || ''}${endpoint}`);

    const response = await apiClient.post<TossPaymentConfirmResponse>(endpoint, requestBody);

    console.log('✅ [confirmTossPayment] API 호출 성공');
    console.log('  - Status:', response.status);
    console.log('  - Response Data:', {
      order_id: response.data.order_id,
      payment_key: response.data.payment_key?.substring(0, 20) + '...',
      status: response.data.status,
      amount: response.data.amount,
    });

    return response.data;
  } catch (error: any) {
    const status = error.response?.status || error.response?.data?.statusCode || 0;
    let message = '결제 승인에 실패했습니다';

    // 백엔드 응답 구조 확인 (여러 가능한 구조 지원)
    const responseData = error.response?.data;
    const errorCode = responseData?.code || responseData?.errorCode || responseData?.data?.code;
    const errorMessage =
      responseData?.message || responseData?.errorMessage || responseData?.data?.message;

    console.log('🔍 [confirmTossPayment] 에러 응답 구조 분석:', {
      status,
      responseDataKeys: responseData ? Object.keys(responseData) : [],
      errorCode,
      errorMessage,
      fullResponse: responseData,
    });

    if (status === 400) {
      // errorCode가 없어도 errorMessage에 에러 코드가 포함되어 있을 수 있음
      // 예: "TOSS_CONFIRM_FAILED: {...}" 형식
      const isTossConfirmFailed =
        errorCode === 'TOSS_CONFIRM_FAILED' ||
        (errorMessage && errorMessage.includes('TOSS_CONFIRM_FAILED'));

      if (errorCode === 'AMOUNT_MISMATCH') {
        message = '결제 금액이 일치하지 않습니다';
      } else if (errorCode === 'ORDER_ALREADY_PAID') {
        message = '이미 결제가 완료된 주문입니다';
      } else if (errorCode === 'TOSS_SECRET_KEY_REQUIRED') {
        message = '결제 시스템 설정 오류입니다. 관리자에게 문의해주세요';
      } else if (isTossConfirmFailed) {
        // TOSS_CONFIRM_FAILED 에러는 토스페이먼츠의 실제 에러가 JSON 문자열로 중첩되어 있음
        // 예: "TOSS_CONFIRM_FAILED: {\"code\":\"NOT_FOUND_PAYMENT_SESSION\",\"message\":\"결제 시간이 만료되어...\"}"
        let tossErrorMessage = errorMessage || '';

        // JSON 문자열이 포함되어 있는지 확인하고 파싱 시도
        try {
          // "TOSS_CONFIRM_FAILED: {...}" 형식에서 JSON 부분 추출
          const jsonMatch = tossErrorMessage.match(/\{.*\}/);
          if (jsonMatch) {
            const tossError = JSON.parse(jsonMatch[0]);
            const tossErrorCode = tossError.code;
            const tossErrorMsg = tossError.message;

            console.log('🔍 [confirmTossPayment] 토스 에러 파싱 성공:', {
              tossErrorCode,
              tossErrorMsg,
            });

            // 토스페이먼츠 에러 코드에 따른 메시지 매핑
            if (tossErrorCode === 'NOT_FOUND_PAYMENT_SESSION') {
              message = '결제 시간이 만료되었습니다. 다시 시도해주세요.';
            } else if (tossErrorCode === 'INVALID_PAYMENT_KEY') {
              message = '유효하지 않은 결제 정보입니다.';
            } else if (tossErrorCode === 'ALREADY_PROCESSED_PAYMENT') {
              message = '이미 처리된 결제입니다.';
            } else {
              message = `결제 승인에 실패했습니다: ${
                tossErrorMsg || tossErrorCode || '알 수 없는 오류'
              }`;
            }
          } else {
            // JSON 형식이 아닌 경우 원본 메시지 사용
            message = `결제 승인에 실패했습니다: ${tossErrorMessage}`;
          }
        } catch (parseError) {
          // JSON 파싱 실패 시 원본 메시지 사용
          console.warn('[confirmTossPayment] 토스 에러 메시지 파싱 실패:', parseError);
          message = `결제 승인에 실패했습니다: ${tossErrorMessage}`;
        }
      } else {
        message = errorMessage || message;
      }
    } else if (status === 401) {
      message =
        errorCode === 'ORDER_NOT_OWNED' ? '다른 사용자의 주문입니다' : '로그인이 필요합니다';
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
    console.error('[TossPayment API] 결제 승인 실패:', { status, errorCode, errorMessage });
    throw paymentError;
  }
};

/**
 * 토스페이먼츠 결제 조회 (paymentKey)
 * @param paymentKey 토스페이먼츠 결제 키
 * @returns 결제 정보 및 취소 내역
 */
export const getTossPaymentByKey = async (paymentKey: string): Promise<TossPaymentResponse> => {
  try {
    const response = await apiClient.get<TossPaymentResponse>(
      `/${API_ENDPOINTS.PAYMENT.TOSS_GET_BY_KEY}/${paymentKey}`,
    );
    return response.data;
  } catch (error: any) {
    console.error('[TossPayment API] 결제 조회 실패 (paymentKey):', error.response?.data);
    throw error;
  }
};

/**
 * 토스페이먼츠 결제 조회 (orderNo)
 * @param orderNo 주문 번호
 * @returns 결제 정보 및 취소 내역
 */
export const getTossPaymentByOrderNo = async (orderNo: string): Promise<TossPaymentResponse> => {
  try {
    const response = await apiClient.get<TossPaymentResponse>(
      `/${API_ENDPOINTS.PAYMENT.TOSS_GET_BY_ORDER}/${orderNo}`,
    );
    return response.data;
  } catch (error: any) {
    console.error('[TossPayment API] 결제 조회 실패 (orderNo):', error.response?.data);
    throw error;
  }
};

/**
 * 토스페이먼츠 결제 취소
 * @param paymentKey 토스페이먼츠 결제 키
 * @param cancelReason 취소 사유 (1~200자)
 * @param cancelAmount 취소 금액 (선택, 없으면 전액 취소)
 * @returns 취소 응답 (payment_key, status, balance_amount, cancels, receipt_url)
 */
export const cancelTossPayment = async (
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number,
): Promise<TossPaymentCancelResponse> => {
  try {
    const response = await apiClient.post<TossPaymentCancelResponse>(
      `/${API_ENDPOINTS.PAYMENT.TOSS_CANCEL}/${paymentKey}/cancel`,
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
    const errorMessage = error.response?.data?.message;

    if (status === 400) {
      if (errorCode === 'TOSS_SECRET_KEY_REQUIRED') {
        message = '결제 시스템 설정 오류입니다. 관리자에게 문의해주세요';
      } else if (errorCode === 'TOSS_CANCEL_FAILED') {
        message = `결제 취소에 실패했습니다: ${errorMessage || ''}`;
      } else {
        message = errorMessage || message;
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
    console.error('[TossPayment API] 결제 취소 실패:', { status, errorCode, errorMessage });
    throw paymentError;
  }
};

/**
 * 주문 상태 변경
 * @param orderId 주문 ID
 * @param status 변경할 주문 상태 ('PAID' | 'CANCELLED' | 'PENDING_PAYMENT')
 * @returns 주문 상태 변경 응답 (order_id, order_status, payment_status, updated_at)
 */
export const updateOrderStatus = async (
  orderId: string,
  status: 'PAID' | 'CANCELLED' | 'PENDING_PAYMENT',
): Promise<{
  order_id: string;
  order_status: string;
  payment_status?: string;
  updated_at: string;
}> => {
  try {
    const endpoint = `/${API_ENDPOINTS.ORDER.UPDATE_STATUS}/${orderId}/status`;
    const requestBody = { status };

    console.log('🌐 [updateOrderStatus] API 호출 시작');
    console.log('  - Endpoint:', endpoint);
    console.log('  - Method: POST');
    console.log('  - Request Body:', requestBody);
    console.log('  - Base URL:', apiClient.defaults.baseURL || '설정되지 않음');
    console.log('  - Full URL:', `${apiClient.defaults.baseURL || ''}${endpoint}`);

    const response = await apiClient.post<{
      order_id: string;
      order_status: string;
      payment_status?: string;
      updated_at: string;
    }>(endpoint, requestBody);

    console.log('✅ [updateOrderStatus] API 호출 성공');
    console.log('  - Status:', response.status);
    console.log('  - Response Data:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    const status = error.response?.status || 0;
    let message = '주문 상태 변경에 실패했습니다';

    const errorCode = error.response?.data?.code;
    const errorMessage = error.response?.data?.message;

    if (status === 400) {
      message = errorMessage || message;
    } else if (status === 401) {
      message =
        errorCode === 'ORDER_NOT_OWNED' ? '다른 사용자의 주문입니다' : '로그인이 필요합니다';
    } else if (status === 404) {
      if (errorCode === 'ORDER_NOT_FOUND') {
        message = '주문 정보를 찾을 수 없습니다';
      }
    } else if (status === 500) {
      message = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요';
    } else if (!status) {
      message = '네트워크 연결을 확인해주세요';
    }

    console.error('[updateOrderStatus] 주문 상태 변경 실패:', { status, errorCode, errorMessage });
    throw new Error(message);
  }
};

/**
 * 내 결제 내역 목록 조회
 * @param params 조회 파라미터 { page, limit, status }
 * @returns 결제 목록 및 페이지네이션 정보
 */
export const getMyPayments = async ({
  page = 1,
  limit = 10,
  status = 'ALL',
}: GetMyPaymentsParams = {}): Promise<PaymentListResponse> => {
  try {
    const response = await apiClient.get<PaymentListResponse>(
      `/${API_ENDPOINTS.PAYMENT.TOSS_MY_PAYMENTS}`,
      {
        params: { page, limit, status },
      },
    );
    return response.data;
  } catch (error: any) {
    const statusCode = error.response?.status || 0;
    let message = '결제 내역을 불러오는데 실패했습니다';

    const errorCode = error.response?.data?.code;
    const errorMessage = error.response?.data?.message;

    if (statusCode === 401) {
      message = '로그인이 필요합니다';
    } else if (statusCode === 500) {
      message = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요';
    } else if (!statusCode) {
      message = '네트워크 연결을 확인해주세요';
    } else if (errorMessage) {
      message = errorMessage;
    }

    const paymentError: PaymentError = { status: statusCode, message };
    console.error('[TossPayment API] 결제 내역 조회 실패:', { statusCode, errorCode, errorMessage });
    throw paymentError;
  }
};
