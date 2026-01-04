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
  // ========================================
  // 🚧 임시 Mock 데이터 (백엔드 준비 전)
  // ========================================
  // TODO: 백엔드 준비되면 아래 주석 해제하고 Mock 데이터 제거
  await new Promise((resolve) => setTimeout(resolve, 300)); // 로딩 시뮬레이션

  return {
    room_id: capsuleId,
    capsule_name: '우리들의 추억',
    open_date: '2025-12-31',
    max_participants: 5,
    max_images_per_person: 3,
    has_music: true,
    has_video: false,
  };
  // ========================================

  /* 실제 API 호출 코드 (백엔드 준비되면 주석 해제)
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
  */
}
