/**
 * components/timecapsule-create/components/step-room/hooks/useRoomData.ts
 * 캡슐대기실 기본 정보, 진행률 계산 Hook
 */

import { useEffect, useMemo, useState } from 'react';
import { fetchRoomSettings } from '@/utils/api/capsule';
import { mockRoomData, ROOM_STATUS } from '../constants';
import type { Participant, Progress, RoomData, RoomSettingsResponse } from '../types';

// ============================================
// 타입 정의
// ============================================

/** useRoomData Hook 반환 타입 */
interface UseRoomDataReturn {
  /** 캡슐대기실 설정값 */
  roomSettings: RoomSettingsResponse | null;
  /** 캡슐대기실 전체 데이터 (호환성 유지용) */
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
 * 1. fetchRoomData(): 캡슐대기실 설정값 가져오기 (API 우선, 실패 시 목데이터 폴백)
 * 2. calculateProgress(): 진행률 계산 (완료 인원 / 전체 인원)
 * 3. canSubmit(): 최종 제출 가능 여부 확인 (진행률 100%)
 *
 * @param capsuleId 캡슐 ID (옵션)
 * @returns {UseRoomDataReturn} Hook 반환값
 */
export function useRoomData(capsuleId?: string): UseRoomDataReturn {
  // ============================================
  // 상태 관리
  // ============================================

  const [roomSettings, setRoomSettings] = useState<RoomSettingsResponse | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // ============================================
  // 데이터 가져오기 (API 우선, 목데이터 폴백)
  // ============================================

  useEffect(() => {
    /**
     * 캡슐대기실 설정값 가져오기
     * - API 호출 시도
     * - 실패 시 목데이터로 폴백
     */
    async function loadRoomData() {
      try {
        setIsLoading(true);
        setError(null);

        if (capsuleId) {
          // API 호출 시도
          try {
            console.log('🔄 [useRoomData] API 호출 시작:', capsuleId);
            const data = await fetchRoomSettings(capsuleId);
            console.log('✅ [useRoomData] API 호출 성공:', data);
            setRoomSettings(data);

            // RoomData 호환성 유지를 위한 변환 (snake_case → camelCase)
            setRoomData({
              capsuleId: data.room_id,
              capsuleName: data.capsule_name,
              openDate: data.open_date,
              maxParticipants: data.max_participants,
              imageSlots: data.max_images_per_person,
              additionalOptions: {
                hasMusicFile: data.has_music,
                hasVideo: data.has_video,
              },
              hostId: 'user-001', // API에서 제공하지 않으므로 기본값 사용
              deadline: '2025-12-30T23:59:59Z', // API에서 제공하지 않으므로 기본값 사용
              status: ROOM_STATUS.WAITING,
            });
          } catch (apiError) {
            console.warn('⚠️ [useRoomData] API 호출 실패, 목데이터 사용:', apiError);
            setError(apiError instanceof Error ? apiError : new Error('API 호출 실패'));

            // 목데이터로 폴백
            setRoomSettings(mockRoomData);
            setRoomData({
              capsuleId: mockRoomData.room_id,
              capsuleName: mockRoomData.capsule_name,
              openDate: mockRoomData.open_date,
              maxParticipants: mockRoomData.max_participants,
              imageSlots: mockRoomData.max_images_per_person,
              additionalOptions: {
                hasMusicFile: mockRoomData.has_music,
                hasVideo: mockRoomData.has_video,
              },
              hostId: 'user-001',
              deadline: '2025-12-30T23:59:59Z',
              status: ROOM_STATUS.WAITING,
            });
          }
        } else {
          // capsuleId가 없으면 목데이터 사용
          console.log('ℹ️ [useRoomData] capsuleId 없음, 목데이터 사용');
          await new Promise((resolve) => setTimeout(resolve, 300)); // 로딩 시뮬레이션
          setRoomSettings(mockRoomData);
          setRoomData({
            capsuleId: mockRoomData.room_id,
            capsuleName: mockRoomData.capsule_name,
            openDate: mockRoomData.open_date,
            maxParticipants: mockRoomData.max_participants,
            imageSlots: mockRoomData.max_images_per_person,
            additionalOptions: {
              hasMusicFile: mockRoomData.has_music,
              hasVideo: mockRoomData.has_video,
            },
            hostId: 'user-001',
            deadline: '2025-12-30T23:59:59Z',
            status: ROOM_STATUS.WAITING,
          });
        }
      } catch (err) {
        console.error('❌ [useRoomData] 데이터 로딩 실패:', err);
        setError(err instanceof Error ? err : new Error('데이터 로딩 실패'));

        // 최종 폴백: 목데이터 사용
        setRoomSettings(mockRoomData);
        setRoomData({
          capsuleId: mockRoomData.room_id,
          capsuleName: mockRoomData.capsule_name,
          openDate: mockRoomData.open_date,
          maxParticipants: mockRoomData.max_participants,
          imageSlots: mockRoomData.max_images_per_person,
          additionalOptions: {
            hasMusicFile: mockRoomData.has_music,
            hasVideo: mockRoomData.has_video,
          },
          hostId: 'user-001',
          deadline: '2025-12-30T23:59:59Z',
          status: ROOM_STATUS.WAITING,
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadRoomData();
  }, [capsuleId]);

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
    roomSettings,
    roomData,
    isLoading,
    error,
    calculateProgress,
    canSubmit,
  };
}
