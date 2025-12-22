/**
 * lib/api/orders.ts
 * 생성 시각: 2024-12-19
 * 타임캡슐 주문 API 함수
 */

import dayjs from 'dayjs';
import type { StepInfoFormData } from '@/components/timecapsule-create/components/step-info/types';
import type { CreateOrderRequest, CreateOrderResponse, TimeOption } from './types/order';

// ============================================
// API 함수
// ============================================

/**
 * 타임캡슐 주문 생성 API 호출
 * @param data 주문 생성 요청 데이터
 * @param token JWT 토큰
 * @returns 주문 생성 응답
 * @throws 요청 실패 시 에러
 */
export async function createOrder(
  data: CreateOrderRequest,
  token: string,
): Promise<CreateOrderResponse> {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('API 베이스 URL이 설정되지 않았습니다');
  }

  const response = await fetch(`${baseUrl}api/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = '주문 생성에 실패했습니다';

    try {
      const errorData = await response.json();

      // 에러 메시지 매핑
      if (response.status === 400) {
        if (errorData.message === 'PHOTO_COUNT_EXCEEDS_LIMIT') {
          errorMessage = '사진 개수가 인원당 제한(최대 인원 × 5)을 초과했습니다';
        } else if (errorData.message === 'CUSTOM_OPEN_AT_MUST_BE_FUTURE') {
          errorMessage = '개봉일은 현재 시각보다 미래여야 합니다';
        } else {
          errorMessage = '입력값이 올바르지 않습니다. 다시 확인해주세요';
        }
      } else if (response.status === 401) {
        errorMessage = '로그인이 필요한 서비스입니다';
      } else if (response.status === 404) {
        if (errorData.message === 'PRODUCT_NOT_FOUND_OR_INVALID') {
          errorMessage = '유효하지 않은 상품입니다';
        } else {
          errorMessage = '요청한 리소스를 찾을 수 없습니다';
        }
      } else if (response.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요';
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (parseError) {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
      console.error('에러 응답 파싱 실패:', parseError);
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

// ============================================
// 데이터 변환 함수
// ============================================

/**
 * 폼 데이터를 API 요청 형식으로 변환
 * @param formData 폼 데이터
 * @returns API 요청 데이터
 */
export function mapFormToOrderRequest(formData: StepInfoFormData): CreateOrderRequest {
  const productId = process.env.EXPO_PUBLIC_TIMECAPSULE_PRODUCT_ID;

  if (!productId) {
    throw new Error('상품 ID가 설정되지 않았습니다');
  }

  // DateOption 인덱스 → time_option 변환
  let timeOption: TimeOption;
  let customOpenAt: string | undefined;

  if (formData.selectedDateOptionIndex === 0) {
    // "1주일 후"
    timeOption = '1_WEEK';
  } else if (formData.selectedDateOptionIndex === 1) {
    // "1년 후"
    timeOption = '1_YEAR';
  } else if (formData.selectedDateOptionIndex === 2) {
    // "3년 후" → CUSTOM with calculated date
    timeOption = 'CUSTOM';
    customOpenAt = dayjs().add(3, 'year').toISOString();
  } else {
    // 인덱스 3: "직접 선택" → CUSTOM with selected date
    timeOption = 'CUSTOM';
    customOpenAt = formData.selectedDate ? dayjs(formData.selectedDate).toISOString() : undefined;
  }

  return {
    product_id: productId,
    time_option: timeOption,
    custom_open_at: customOpenAt,
    headcount: formData.personnelCount,
    photo_count: formData.storageCount,
    add_music: formData.selectedOptions.music || false,
    add_video: formData.selectedOptions.video || false,
  };
}
