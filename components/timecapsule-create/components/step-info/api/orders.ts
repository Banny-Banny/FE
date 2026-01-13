/**
 * lib/api/orders.ts
 * 타임캡슐 주문 API 함수
 */

import { DATE_OPTION_INDEX } from '@/components/timecapsule-create/components/step-info/constants';
import type { StepInfoFormData } from '@/components/timecapsule-create/components/step-info/types';
import { apiClient } from '@/utils/apiClient';
import dayjs from 'dayjs';
import type { CreateOrderRequest, CreateOrderResponse, TimeOption } from './types/order';

/**
 * 타임캡슐 주문 생성 API 호출
 */
export async function createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  try {
    // 🔍 요청 데이터 확인 (개발 모드)
    if (__DEV__) {
    }

    const response = await apiClient.post<CreateOrderResponse>('/api/orders', data);

    // 🔍 응답 데이터 확인 (개발 모드)
    if (__DEV__) {
    }

    return response.data;
  } catch (error: any) {
    const status = error.response?.status || 0;
    let errorMessage = '주문 생성에 실패했습니다';

    // 개발 모드에서 상세 오류 정보 로깅
    if (__DEV__) {
      if (error.response?.data) {
      }
      if (error.response?.headers) {
      }
    }

    if (status === 400) {
      const msg = error.response?.data?.message;
      if (msg === 'PHOTO_COUNT_EXCEEDS_LIMIT') {
        errorMessage = '사진 개수가 인원당 제한(최대 인원 × 5)을 초과했습니다';
      } else if (msg === 'CUSTOM_OPEN_AT_MUST_BE_FUTURE') {
        errorMessage = '개봉일은 현재 시각보다 미래여야 합니다';
      } else {
        errorMessage = '입력값이 올바르지 않습니다. 다시 확인해주세요';
      }
    } else if (status === 404) {
      errorMessage =
        error.response?.data?.message === 'PRODUCT_NOT_FOUND_OR_INVALID'
          ? '유효하지 않은 상품입니다'
          : '요청한 리소스를 찾을 수 없습니다';
    } else if (status === 500) {
      // 서버 에러 메시지가 있으면 사용 (개발 모드에서만)
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      if (__DEV__ && serverMessage) {
        errorMessage = `서버 오류: ${serverMessage}`;
      } else {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요';
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (!error.response) {
      // 네트워크 오류 또는 서버 연결 실패
      errorMessage = '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요';
    }

    throw new Error(errorMessage);
  }
}

/**
 * 폼 데이터를 API 요청 형식으로 변환
 */
export function mapFormToOrderRequest(formData: StepInfoFormData): CreateOrderRequest {
  const productId = process.env.EXPO_PUBLIC_TIMECAPSULE_PRODUCT_ID;
  if (!productId) throw new Error('상품 ID가 설정되지 않았습니다');

  let timeOption: TimeOption;
  let customOpenAt: string | undefined;

  const dateIndex = formData.selectedDateOptionIndex;
  if (dateIndex === DATE_OPTION_INDEX.ONE_WEEK) {
    timeOption = '1_WEEK';
  } else if (dateIndex === DATE_OPTION_INDEX.ONE_MONTH) {
    timeOption = '1_MONTH';
  } else if (dateIndex === DATE_OPTION_INDEX.ONE_YEAR) {
    timeOption = '1_YEAR';
  } else if (dateIndex === DATE_OPTION_INDEX.CUSTOM) {
    timeOption = 'CUSTOM';
    customOpenAt = formData.selectedDate ? dayjs(formData.selectedDate).toISOString() : undefined;
  } else {
    timeOption = '1_YEAR';
  }

  return {
    product_id: productId,
    capsule_title: formData.capsuleName,
    time_option: timeOption,
    custom_open_at: customOpenAt,
    headcount: formData.personnelCount,
    photo_count: formData.storageCount,
    add_music: formData.selectedOptions.music || false,
    add_video: formData.selectedOptions.video || false,
  };
}
