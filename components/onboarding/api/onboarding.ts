/**
 * components/onboarding/api/onboarding.ts
 * 온보딩 완료 API 함수
 */

import { API_ENDPOINTS } from '@/commons/constants';
import { apiClient } from '@/utils/apiClient';

export interface CompleteOnboardingRequest {
  friend_consent: boolean;
  location_consent: boolean;
}

export interface CompleteOnboardingResponse {
  // 백엔드 응답 형식에 맞게 수정 필요
  success: boolean;
}

/**
 * 온보딩 완료 API 호출
 * @param friendConsent 친구 연동 동의 여부
 * @param locationConsent 위치 권한 허용 여부
 * @throws 400: 잘못된 요청
 * @throws 401: JWT 토큰 없음 또는 유효하지 않음
 * @throws 500: 서버 내부 오류
 */
export async function completeOnboarding(
  friendConsent: boolean,
  locationConsent: boolean,
): Promise<CompleteOnboardingResponse> {
  try {
    if (__DEV__) {
    }

    const response = await apiClient.post<CompleteOnboardingResponse>(
      API_ENDPOINTS.AUTH.ONBOARDING_COMPLETE,
      {
        friend_consent: friendConsent,
        location_consent: locationConsent,
      },
    );

    if (__DEV__) {
    }

    return response.data;
  } catch (error: any) {
    const status = error.response?.status || 0;
    const errorMessage = error.response?.data?.message || error.message || '온보딩 완료 처리 중 오류가 발생했습니다.';

    if (__DEV__) {
    }

    // 에러를 다시 throw하여 호출한 곳에서 처리할 수 있도록 함
    throw new Error(errorMessage);
  }
}

