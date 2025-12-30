/**
 * components/timecapsule-create/components/step-room/hooks/useRoomData.ts
 * 캡슐대기실 기본 정보, 진행률 계산 Hook
 */

import { useEffect, useMemo, useState } from 'react';
import { ROOM_STATUS } from '../constants';
import type { Participant, Progress, RoomData } from '../types';

// ============================================
// 목데이터 (백엔드 API 준비 전)
// ============================================

/**
 * 목데이터: 캡슐대기실 데이터
 * ⚠️ 추후 백엔드 API로 교체될 예정
 */
const mockRoomData: RoomData = {
  // 캡슐 기본 정보 (스텝 인포에서 전달)
  capsuleId: 'capsule-001',
  capsuleName: 'ㅋ', // 스텝 인포에서 전달
  openDate: '2025.06.10', // 스텝 인포에서 전달
  maxParticipants: 4, // 스텝 인포에서 전달
  imageSlots: 3, // 스텝 인포에서 전달
  additionalOptions: {
    hasMusicFile: true, // 스텝 인포에서 전달
    hasVideo: true, // 스텝 인포에서 전달
  },
  // 방장 정보
  hostId: 'user-001',
  // 작성 마감 시간
  deadline: '2025-12-30T23:59:59Z',
  // 대기실 상태
  status: ROOM_STATUS.WAITING,
};

// ============================================
// 타입 정의
// ============================================

/** useRoomData Hook 반환 타입 */
interface UseRoomDataReturn {
  /** 캡슐대기실 데이터 */
  roomData: RoomData | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 */
  error: Error | null;
  /** 진행률 계산 (참여자 목록 기반) */
  calculateProgress: (participants: Participant[]) => Progress;
  /** 최종 제출 가능 여부 확인 */
  canSubmit: (participants: Participant[]) => boolean;
}

// ============================================
// Hook
// ============================================

/**
 * 캡슐대기실 데이터 관리 Hook
 *
 * 기능:
 * 1. fetchRoomData(): 캡슐대기실 데이터 가져오기 (목데이터)
 * 2. calculateProgress(): 진행률 계산 (완료 인원 / 전체 인원)
 * 3. canSubmit(): 최종 제출 가능 여부 확인 (진행률 100%)
 *
 * @returns {UseRoomDataReturn} Hook 반환값
 */
export function useRoomData(): UseRoomDataReturn {
  // ============================================
  // 상태 관리
  // ============================================

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // ============================================
  // 데이터 가져오기 (목데이터)
  // ============================================

  useEffect(() => {
    /**
     * 캡슐대기실 데이터 가져오기
     * ⚠️ 추후 백엔드 API로 교체될 예정
     */
    async function fetchRoomData() {
      try {
        setIsLoading(true);
        setError(null);

        // TODO: API 연동
        // const response = await fetch(`/api/room/${capsuleId}`);
        // const data = await response.json();
        // setRoomData(data);

        // 목데이터 반환
        await new Promise((resolve) => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        setRoomData(mockRoomData);
      } catch (err) {
        console.error('❌ [useRoomData] 데이터 로딩 실패:', err);
        setError(err instanceof Error ? err : new Error('데이터 로딩 실패'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoomData();
  }, []);

  // ============================================
  // 진행률 계산 (useMemo로 최적화)
  // ============================================

  /**
   * 진행률 계산
   *
   * 계산 로직:
   * - 완료 인원: status === 'completed'인 참여자 수
   * - 전체 인원: name이 빈 문자열이 아닌 참여자 수 (실제 입장한 사람만)
   * - 진행률: (완료 인원 / 전체 인원) × 100
   *
   * @param {Participant[]} participants 참여자 목록
   * @returns {Progress} 진행률 데이터
   */
  const calculateProgress = useMemo(() => {
    return (participants: Participant[]): Progress => {
      // 완료한 참여자 수
      const completed = participants.filter((p) => p.status === 'completed').length;

      // 전체 참여자 수 (실제 입장한 사람만, name이 빈 문자열이 아닌 경우)
      const total = participants.filter((p) => p.name !== '').length;

      // 진행률 계산 (0-100)
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        completed,
        total,
        percentage,
      };
    };
  }, []);

  // ============================================
  // 최종 제출 가능 여부 확인
  // ============================================

  /**
   * 최종 제출 가능 여부 확인
   *
   * 조건:
   * - 모든 참여자(name이 있는)가 완료 상태인지 확인
   * - 진행률이 100%일 때만 true
   *
   * @param {Participant[]} participants 참여자 목록
   * @returns {boolean} 제출 가능 여부
   */
  const canSubmit = useMemo(() => {
    return (participants: Participant[]): boolean => {
      const progress = calculateProgress(participants);
      return progress.percentage === 100;
    };
  }, [calculateProgress]);

  // ============================================
  // 반환
  // ============================================

  return {
    roomData,
    isLoading,
    error,
    calculateProgress,
    canSubmit,
  };
}
