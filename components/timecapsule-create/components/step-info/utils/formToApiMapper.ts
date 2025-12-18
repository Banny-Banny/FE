/**
 * formToApiMapper.ts
 * 폼 데이터를 API 요청 형식으로 변환하는 유틸리티
 * 생성 시각: 2024-12-18
 */

import dayjs from 'dayjs';
import type { CreateOrderRequest } from '@/lib/api/types/order';
import type { StepInfoFormData } from '../types';

// ============================================
// 개봉일 옵션 매핑
// ============================================

/**
 * 프론트엔드 개봉일 옵션 인덱스를 API time_option으로 변환
 * @param optionIndex 선택된 옵션 인덱스 (0: 1주일, 1: 1년, 2: 3년, 3: 직접선택)
 * @returns API time_option 값
 */
function mapDateOptionToTimeOption(
  optionIndex: number,
): '1_WEEK' | '1_MONTH' | '1_YEAR' | '3_YEAR' | 'CUSTOM' {
  const optionMap: Record<
    number,
    '1_WEEK' | '1_MONTH' | '1_YEAR' | '3_YEAR' | 'CUSTOM'
  > = {
    0: '1_WEEK', // 1주일 후
    1: '1_YEAR', // 1년 후
    2: '3_YEAR', // 3년 후
    3: 'CUSTOM', // 직접 선택
  };

  return optionMap[optionIndex] || '1_WEEK';
}

// ============================================
// 날짜 포맷 변환
// ============================================

/**
 * Date 객체를 ISO 8601 형식 문자열로 변환
 * @param date Date 객체
 * @returns ISO 8601 형식 문자열 (예: "2025-01-15T00:00:00Z")
 */
function formatDateToISO(date: Date): string {
  return dayjs(date).toISOString();
}

// ============================================
// 메인 변환 함수
// ============================================

/**
 * 타임캡슐 정보 입력 폼 데이터를 API 요청 데이터로 변환
 * @param formData 폼 데이터
 * @param productId 상품 ID (환경변수에서 가져온 값)
 * @returns API 요청 데이터
 */
export function mapFormToApiRequest(
  formData: StepInfoFormData,
  productId: string,
): CreateOrderRequest {
  const timeOption = mapDateOptionToTimeOption(formData.selectedDateOptionIndex);

  const apiRequest: CreateOrderRequest = {
    product_id: productId,
    time_option: timeOption,
    headcount: formData.personnelCount,
    photo_count: formData.storageCount,
    add_music: formData.selectedOptions.music,
    add_video: formData.selectedOptions.video,
  };

  // CUSTOM 옵션인 경우 custom_open_at 추가
  if (timeOption === 'CUSTOM' && formData.selectedDate) {
    apiRequest.custom_open_at = formatDateToISO(formData.selectedDate);
  }

  return apiRequest;
}
