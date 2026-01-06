/**
 * components/timecapsule-create/components/step-room/hooks/useRoomSubmit.ts
 * 타임캡슐 최종 제출 Hook
 *
 * 체크리스트:
 * - [✓] submitTimeCapsule 함수 구현
 * - [✓] 위치 정보로 캡슐 매장 API 호출
 * - [✓] submitCapsule API 연동
 * - [✓] 로딩 상태 관리
 * - [✓] 에러 상태 관리
 */

import { useState } from 'react';
import { submitCapsule } from '../api/capsule';
import type { CapsuleSubmitResponse, Participant, RoomSettingsResponse } from '../types';

// ============================================
// 타입 정의
// ============================================

/** useRoomSubmit Hook 반환 타입 */
interface UseRoomSubmitReturn {
  /** 타임캡슐 최종 제출 (위치 지정 및 매장) */
  submitTimeCapsule: (
    roomId: string,
    latitude: number,
    longitude: number,
  ) => Promise<CapsuleSubmitResponse>;
  /** 제출 중 여부 */
  isSubmitting: boolean;
  /** 에러 */
  error: string | null;
}

// ============================================
// Hook
// ============================================

/**
 * 타임캡슐 최종 제출 Hook
 *
 * 기능:
 * 1. 위치 정보(latitude, longitude)를 받아서 캡슐 매장
 * 2. POST /api/capsules/step-rooms/:roomId/submit 호출
 * 3. 매장 결과 반환
 *
 * @returns {UseRoomSubmitReturn} Hook 반환값
 */
export function useRoomSubmit(): UseRoomSubmitReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 타임캡슐 최종 제출 함수 (위치 지정 및 매장)
   *
   * @param {string} roomId 캡슐 ID (UUID)
   * @param {number} latitude 위도 (-90 ~ 90)
   * @param {number} longitude 경도 (-180 ~ 180)
   * @returns {Promise<CapsuleSubmitResponse>} 매장 결과
   * @throws 400: INCOMPLETE_PARTICIPANTS, INVALID_LOCATION, PAYMENT_NOT_COMPLETED
   * @throws 401: JWT 토큰 없음 또는 유효하지 않음
   * @throws 403: 방장이 아닌 사용자의 제출 시도
   * @throws 404: 존재하지 않는 roomId
   * @throws 409: 이미 제출된 캡슐 (중복 제출)
   * @throws 500: 서버 내부 오류
   */
  const submitTimeCapsule = async (
    roomId: string,
    latitude: number,
    longitude: number,
  ): Promise<CapsuleSubmitResponse> => {
    try {
      setIsSubmitting(true);
      setError(null);

      console.log('=== 타임캡슐 최종 제출 시작 ===');
      console.log('캡슐 ID:', roomId);
      console.log('위치:', { latitude, longitude });

      // submitCapsule API 호출 (POST /api/capsules/step-rooms/:roomId/submit)
      const result = await submitCapsule(roomId, { latitude, longitude });

      console.log('=== 타임캡슐 최종 제출 완료! ===');
      console.log('매장 위치:', result.data.location.address);
      console.log('매장 시각:', result.data.buried_at);
      console.log('개봉 예정일:', result.data.open_date);
      console.log('참여자 수:', result.data.participants);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      console.error('❌ 타임캡슐 제출 실패:', errorMessage);
      setError(errorMessage);

      // 에러를 다시 throw하여 호출자가 처리할 수 있도록 함
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitTimeCapsule,
    isSubmitting,
    error,
  };
}
