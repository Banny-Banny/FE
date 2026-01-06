/**
 * components/timecapsule-create/components/write-bottomsheet/api/content.ts
 * 타임캡슐 콘텐츠 제출 API 함수
 *
 * 체크리스트:
 * - [✓] submitMyContent 함수 구현
 * - [✓] POST /api/capsules/step-rooms/:capsuleId/my-content 호출
 * - [✓] multipart/form-data 형식으로 파일 직접 업로드
 * - [✓] JWT 토큰 인증 처리 (apiClient 자동 처리)
 * - [✓] 에러 처리 (400, 401, 403, 404, 500)
 */

import { apiClient } from '@/utils/apiClient';
import type { ContentSubmitResponse } from '../types';

/**
 * 타임캡슐 콘텐츠 제출 API
 * @param capsuleId 캡슐 ID (UUID)
 * @param formData FormData 객체 (text_message, images, music, video)
 * @returns 제출 결과 정보
 * @throws 400: text_message 누락, 허용되지 않은 미디어, 이미지 개수 초과
 * @throws 401: JWT 토큰 없음 또는 유효하지 않음
 * @throws 403: 결제 미완료, 참여자가 아님, 슬롯 미배정
 * @throws 404: 존재하지 않는 capsuleId
 * @throws 500: S3 업로드 실패, 서버 내부 오류
 */
export async function submitMyContent(
  capsuleId: string,
  formData: FormData,
): Promise<ContentSubmitResponse> {
  try {
    const apiUrl = `/api/capsules/step-rooms/${capsuleId}/my-content`;
    console.log('🔄 [API] 타임캡슐 콘텐츠 제출 시작');
    console.log('  📍 URL:', apiUrl);
    console.log('  🆔 capsuleId:', capsuleId);

    // FormData 내용 요약 로깅
    // React Native에서는 FormData.entries()가 제한적이므로
    // FormData에 추가된 필드 수만 확인
    const formDataKeys: string[] = [];
    try {
      // @ts-ignore - React Native FormData는 entries()를 지원하지 않을 수 있음
      for (const [key] of formData.entries()) {
        if (!formDataKeys.includes(key)) {
          formDataKeys.push(key);
        }
      }
      console.log('  📦 FormData 필드:', formDataKeys.join(', '));
    } catch (e) {
      console.log('  📦 FormData 생성 완료 (내용 확인 불가)');
    }

    // apiClient는 자동으로 JWT 토큰을 헤더에 포함시킴
    // FormData를 보낼 때는 Content-Type을 설정하지 않음 (axios가 boundary 포함하여 자동 설정)
    // React Native에서는 명시적으로 Content-Type을 설정하면 boundary가 누락되어 서버에서 파싱 실패
    const response = await apiClient.post<ContentSubmitResponse>(apiUrl, formData);

    console.log('✅ [API] 타임캡슐 콘텐츠 제출 성공');
    console.log('  📊 응답 데이터:', JSON.stringify(response.data, null, 2));
    console.log('  🎯 상태:', response.data.data.status);
    console.log('  🖼️  이미지 개수:', response.data.data.uploaded_images);
    console.log('  🎵 음악:', response.data.data.uploaded_music ? '있음' : '없음');
    console.log('  🎬 비디오:', response.data.data.uploaded_video ? '있음' : '없음');
    return response.data;
  } catch (error: any) {
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
