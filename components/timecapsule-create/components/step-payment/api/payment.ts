/**
 * step-payment/api/payment.ts
 * 생성 시각: 2024-12-24
 * 카카오페이 결제 API 함수
 */

import axios from 'axios';
import type {
  KakaoPayApproveRequest,
  KakaoPayApproveResponse,
  KakaoPayReadyRequest,
  KakaoPayReadyResponse,
  PaymentError,
} from './types/payment';

// ============================================
// API 함수
// ============================================

/**
 * 카카오페이 결제 준비 API 호출
 *
 * @param orderId 주문 ID
 * @param token JWT 토큰
 * @returns 결제 준비 응답
 * @throws 요청 실패 시 PaymentError
 */
export async function readyKakaoPay(
  orderId: string,
  token: string,
): Promise<KakaoPayReadyResponse> {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('API 베이스 URL이 설정되지 않았습니다');
  }

  const url = `${baseUrl}api/payments/kakao/ready`;
  console.log('🌐 [카카오페이 준비 API 요청]');
  console.log('  - URL:', url);
  console.log('  - 주문 ID:', orderId);
  console.log('  - 토큰 받음:', token ? '✅' : '❌');

  const requestBody: KakaoPayReadyRequest = {
    order_id: orderId,
  };

  try {
    const response = await axios.post<KakaoPayReadyResponse>(url, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 [카카오페이 준비 API 응답]');
    console.log('  - 상태 코드:', response.status);
    console.log('  - 상태 텍스트:', response.statusText);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const paymentError = handleApiError(error.response.status, error.response.data);
      throw paymentError;
    }
    throw error;
  }
}

/**
 * 카카오페이 결제 승인 API 호출
 *
 * @param orderId 주문 ID
 * @param pgToken 카카오페이 pg_token
 * @param token JWT 토큰
 * @returns 결제 승인 응답
 * @throws 요청 실패 시 PaymentError
 */
export async function approveKakaoPay(
  orderId: string,
  pgToken: string,
  token: string,
): Promise<KakaoPayApproveResponse> {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('API 베이스 URL이 설정되지 않았습니다');
  }

  const url = `${baseUrl}api/payments/kakao/approve`;
  console.log('🌐 [카카오페이 승인 API 요청]');
  console.log('  - URL:', url);
  console.log('  - 주문 ID:', orderId);
  console.log('  - pg_token 받음:', pgToken ? '✅' : '❌');
  console.log('  - 토큰 받음:', token ? '✅' : '❌');

  const requestBody: KakaoPayApproveRequest = {
    order_id: orderId,
    pg_token: pgToken,
  };

  try {
    const response = await axios.post<KakaoPayApproveResponse>(url, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 [카카오페이 승인 API 응답]');
    console.log('  - 상태 코드:', response.status);
    console.log('  - 상태 텍스트:', response.statusText);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const paymentError = handleApiError(error.response.status, error.response.data);
      throw paymentError;
    }
    throw error;
  }
}

// ============================================
// 에러 처리 함수
// ============================================

/**
 * API 에러 응답을 PaymentError로 변환
 *
 * @param status HTTP 상태 코드
 * @param errorData 에러 응답 데이터
 * @returns PaymentError 객체
 */
function handleApiError(status: number, errorData?: any): PaymentError {
  let errorMessage = '결제 처리 중 오류가 발생했습니다';

  console.log('❌ [서버 에러 응답]', JSON.stringify(errorData, null, 2));

  // 상태 코드별 에러 메시지 매핑
  if (status === 400) {
    errorMessage = errorData?.message || '입력값이 올바르지 않습니다';
  } else if (status === 401) {
    errorMessage = '로그인이 필요합니다';
  } else if (status === 404) {
    errorMessage = '주문 정보를 찾을 수 없습니다';
  } else if (status === 409) {
    // 중복 결제 시도
    if (errorData?.message === 'PAYMENT_ALREADY_READY_OR_PAID') {
      errorMessage = '이미 결제가 진행 중이거나 완료되었습니다.\n페이지를 새로고침 후 다시 시도해주세요.';
    } else {
      errorMessage = errorData?.message || '중복된 결제 요청입니다';
    }
  } else if (status === 500) {
    errorMessage = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요';
  } else if (errorData?.message) {
    errorMessage = errorData.message;
  }

  return {
    status,
    message: errorMessage,
  };
}
