/**
 * components/timecapsule-create/components/write-bottomsheet/api/content.ts
 * 타임캡슐 콘텐츠 제출 및 조회 API 함수
 *
 * 체크리스트:
 * - [✓] submitMyContent 함수 구현
 * - [✓] POST /api/capsules/step-rooms/:capsuleId/my-content 호출
 * - [✓] ⭐ multipart/form-data 형식으로 파일 직접 전송
 * - [✓] JWT 토큰 인증 처리 (apiClient 자동 처리)
 * - [✓] 에러 처리 (400, 401, 403, 404, 500)
 * - [✓] fetchMyContent 함수 구현
 * - [✓] GET /api/capsules/step-rooms/:capsuleId/my-content 호출
 */

import { apiClient } from '@/utils/apiClient';
import type { ContentSubmitResponse, MyContentResponse } from '../types';

/**
 * 404 에러를 구분하기 위한 커스텀 에러 클래스
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
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
    console.log('🔄 [API] 타임캡슐 콘텐츠 제출 시작 - capsuleId:', capsuleId);
    console.log('🔄 [API] 요청 형식: multipart/form-data');

    // ⭐ apiClient는 자동으로 JWT 토큰을 헤더에 포함시킴
    // ⭐ FormData를 전송하면 apiClient가 자동으로 Content-Type을 multipart/form-data로 설정
    // ⭐ headers에 Content-Type을 명시하지 않음 (apiClient가 자동 처리)
    const response = await apiClient.post<ContentSubmitResponse>(
      `/api/capsules/step-rooms/${capsuleId}/my-content`,
      formData,
    );

    console.log('✅ [API] 타임캡슐 콘텐츠 제출 성공:', response.data);
    return response.data;
  } catch (error: any) {
    // 에러 처리
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || '유효하지 않은 요청입니다.';
      console.error('❌ [API] 유효하지 않은 요청 (400):', errorMessage);
      throw new Error(errorMessage);
    }
    if (error.response?.status === 401) {
      console.error('❌ [API] 인증 실패 (401)');
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '권한이 없습니다.';
      console.error('❌ [API] 권한 없음 (403):', errorMessage);
      throw new Error(errorMessage);
    }
    if (error.response?.status === 404) {
      console.error('❌ [API] 존재하지 않는 capsuleId (404)');
      throw new Error('캡슐을 찾을 수 없습니다.');
    }
    if (error.response?.status === 500) {
      console.error('❌ [API] 서버 내부 오류 (500)');
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    console.error('❌ [API] 타임캡슐 콘텐츠 제출 실패:', error.message);
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
    console.log('🔄 [API] 본인 작성 콘텐츠 조회 시작 - capsuleId:', capsuleId);

    const response = await apiClient.get<MyContentResponse>(
      `/api/capsules/step-rooms/${capsuleId}/my-content`,
    );

    console.log('✅ [API] 본인 작성 콘텐츠 조회 성공:', response.data);
    return response.data;
  } catch (error: any) {
    // 401: 인증 실패
    if (error.response?.status === 401) {
      console.error('❌ [API] 인증 실패 (401)');
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    // 403: 참여자가 아님
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '이 캡슐의 참여자가 아닙니다.';
      console.error('❌ [API] 참여자 아님 (403):', errorMessage);
      throw new Error(errorMessage);
    }
    // 404: 콘텐츠를 작성하지 않음 (정상적인 경우, 에러로 처리하지 않음)
    if (error.response?.status === 404) {
      console.log('ℹ️ [API] 작성한 콘텐츠 없음 (404) - 새로 작성 가능');
      throw new NotFoundError('아직 작성하지 않았습니다');
    }
    // 500: 서버 내부 오류
    if (error.response?.status === 500) {
      console.error('❌ [API] 서버 내부 오류 (500)');
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    console.error('❌ [API] 본인 작성 콘텐츠 조회 실패:', error.message);
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}
