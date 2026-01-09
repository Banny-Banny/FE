/**
 * components/my-capsule/api/capsule.ts
 * 참여중인 타임캡슐 리스트 조회 API
 */

import { apiClient } from '@/utils/apiClient';
import type { MyCapsuleListResponse } from '../types';

/**
 * 참여중인 타임캡슐 리스트 조회 API
 * @param limit 한 페이지에 표시할 아이템 수 (기본값: 20)
 * @param offset 건너뛸 아이템 수 (기본값: 0)
 * @returns 참여중인 타임캡슐 리스트 (camelCase)
 * @throws 401: JWT 토큰 없음 또는 유효하지 않음
 * @throws 500: 서버 내부 오류
 */
export async function getMyCapsules(
  limit: number = 20,
  offset: number = 0
): Promise<MyCapsuleListResponse> {
  try {
    console.log('🔄 [API] 참여중인 캡슐 리스트 조회 시작 - limit:', limit, 'offset:', offset);

    // apiClient는 자동으로 JWT 토큰을 헤더에 포함시킨다
    const response = await apiClient.get<MyCapsuleListResponse>(
      '/api/me/capsules',
      {
        params: { limit, offset }
      }
    );

    console.log('✅ [API] 참여중인 캡슐 리스트 조회 성공:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('❌ [API] 인증 실패 (401)');
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }
    if (error.response?.status === 500) {
      console.error('❌ [API] 서버 내부 오류 (500)');
      throw new Error('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    console.error('❌ [API] 참여중인 캡슐 리스트 조회 실패:', error.message);
    throw new Error(`API 호출 실패: ${error.response?.status || 'Network Error'}`);
  }
}
