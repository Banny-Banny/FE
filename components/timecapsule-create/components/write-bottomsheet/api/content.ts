/**
 * components/timecapsule-create/components/write-bottomsheet/api/content.ts
 * 타임캡슐 콘텐츠 제출 API 함수
 *
 * 체크리스트:
 * - [✓] submitMyContent 함수 구현
 * - [✓] POST /api/capsules/step-rooms/:capsuleId/my-content 호출
 * - [✓] ⭐ multipart/form-data 형식으로 파일 직접 전송
 * - [✓] JWT 토큰 인증 처리 (apiClient 자동 처리)
 * - [✓] 에러 처리 (400, 401, 403, 404, 500)
 */

import { apiClient } from '@/utils/apiClient';
import type { ContentSubmitResponse, MyContentResponse, ContentPatchFormData } from '../types';

/**
 * 404 에러를 구분하기 위한 커스텀 에러 클래스
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 타임캡슐 콘텐츠 제출 API
 * @param capsuleId 캡슐 ID (UUID)
 * @param formData 요청 Body (FormData) - multipart/form-data 형식
 * @returns 제출 결과 정보
 * @throws 400: text_message 누락, 허용되지 않은 미디어, 이미지 개수 초과
 * @throws 401: JWT 토큰 없음 또는 유효하지 않음
 * @throws 403: 결제 미완료, 참여자가 아님, 슬롯 미배정
 * @throws 404: 존재하지 않는 capsuleId
 * @throws 500: 서버 내부 오류
 */
export async function submitMyContent(
  capsuleId: string,
  formData: FormData,
): Promise<ContentSubmitResponse> {
  try {
    // ⭐ apiClient는 자동으로 JWT 토큰을 헤더에 포함시킴
    // ⭐ FormData를 전송하면 apiClient가 자동으로 Content-Type을 multipart/form-data로 설정
    // ⭐ headers에 Content-Type을 명시하지 않음 (apiClient가 자동 처리)
    const response = await apiClient.post<ContentSubmitResponse>(
      `/api/capsules/step-rooms/${capsuleId}/my-content`,
      formData,
    );

    return response.data;
  } catch (error: any) {
    // 에러 처리
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || '유효하지 않은 요청입니다.';
      throw new Error(errorMessage);
    }
    if (error.response?.status === 401) {
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '권한이 없습니다.';
      throw new Error(errorMessage);
    }
    if (error.response?.status === 404) {
      throw new Error('캡슐을 찾을 수 없습니다.');
    }
    if (error.response?.status === 500) {
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}

/**
 * 본인이 작성한 콘텐츠 조회 API
 * @param capsuleId 캡슐 ID (UUID)
 * @returns 본인이 작성한 콘텐츠 정보
 * @throws 401: 인증 실패
 * @throws 403: 참여자가 아님
 * @throws 404: 콘텐츠를 작성하지 않음 (NotFoundError)
 */
export async function fetchMyContent(
  capsuleId: string,
): Promise<MyContentResponse> {
  try {
    const response = await apiClient.get<MyContentResponse>(
      `/api/capsules/step-rooms/${capsuleId}/my-content`,
    );

    return response.data;
  } catch (error: any) {
    // 401: 인증 실패
    if (error.response?.status === 401) {
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    // 403: 참여자가 아님
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '이 캡슐의 참여자가 아닙니다.';
      throw new Error(errorMessage);
    }
    // 404: 콘텐츠를 작성하지 않음 (정상적인 경우, NotFoundError로 구분)
    if (error.response?.status === 404) {
      const notFoundError = new NotFoundError('아직 작성하지 않았습니다');
      // 상태 코드 정보를 에러 객체에 포함 (React Native 호환성)
      (notFoundError as any).statusCode = 404;
      (notFoundError as any).response = error.response;
      throw notFoundError;
    }
    // 500: 서버 내부 오류
    if (error.response?.status === 500) {
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}

/**
 * 타임캡슐 콘텐츠 부분 수정 API (PATCH)
 * 전달된 필드만 수정하고, 미전달 필드는 기존 값 유지
 *
 * @param capsuleId 캡슐 ID (UUID)
 * @param formData 요청 Body (FormData) - multipart/form-data 형식
 * @returns 수정 결과 정보
 * @throws 400: 유효하지 않은 요청, 이미지 개수 초과
 * @throws 401: JWT 토큰 없음 또는 유효하지 않음
 * @throws 403: 권한 없음 (참여자가 아님, 슬롯 미배정 등)
 * @throws 404: 존재하지 않는 capsuleId 또는 수정할 콘텐츠 없음
 * @throws 500: 서버 내부 오류
 */
export async function patchMyContent(
  capsuleId: string,
  formData: FormData,
): Promise<ContentSubmitResponse> {
  try {
    // ⭐ PATCH 메서드 사용, FormData 그대로 전송
    // ⭐ Content-Type은 apiClient가 자동 설정 (명시하지 않음)
    const response = await apiClient.patch<ContentSubmitResponse>(
      `/api/capsules/step-rooms/${capsuleId}/my-content`,
      formData,
    );

    return response.data;
  } catch (error: any) {
    // 400: 유효하지 않은 요청
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || '유효하지 않은 요청입니다.';
      throw new Error(errorMessage);
    }
    // 401: 인증 실패
    if (error.response?.status === 401) {
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    // 403: 권한 없음
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '수정 권한이 없습니다.';
      throw new Error(errorMessage);
    }
    // 404: 캡슐 또는 콘텐츠 없음
    if (error.response?.status === 404) {
      throw new Error('수정할 콘텐츠를 찾을 수 없습니다.');
    }
    // 500: 서버 내부 오류
    if (error.response?.status === 500) {
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}
