/**
 * utils/api/capsule.ts
 * 캡슐 대기실 API 호출 함수
 */

import type { RoomSettingsResponse } from '@/components/timecapsule-create/components/step-room/types';

// .env에 설정된 API URL 사용
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * 대기실 설정값 조회 API
 *
 * @param capsuleId 캡슐 ID (UUID)
 * @returns 대기실 설정값 (snake_case)
 * @throws 404: 존재하지 않는 capsuleId 또는 주문 정보 없음
 * @throws 500: 서버 내부 오류
 */
export async function fetchRoomSettings(capsuleId: string): Promise<RoomSettingsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/capsules/step-rooms/${capsuleId}/settings`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('대기실 또는 주문 정보를 찾을 수 없습니다.');
      }
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data: RoomSettingsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('대기실 설정값 조회 실패:', error);
    throw error;
  }
}
