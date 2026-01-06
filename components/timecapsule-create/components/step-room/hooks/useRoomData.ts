/**
 * components/timecapsule-create/components/step-room/hooks/useRoomData.ts
 * 캡슐대기실 기본 정보, 진행률 계산 Hook
 */

import { useEffect, useMemo, useState } from 'react';
import { createRoomAndGetSettings, getRoomSettings } from '../api/capsule';
import { mockRoomData } from '../constants';
import type { CreateRoomResponse, Participant, Progress, RoomSettingsResponse } from '../types';

// ============================================
// 타입 정의
// ============================================

/** useRoomData Hook 반환 타입 */
interface UseRoomDataReturn {
  /** 캡슐대기실 설정값 (snake_case) - 1단계 API 응답 */
  roomSettings: RoomSettingsResponse | null;
  /** 대기실 생성 응답 (실제 API 응답, 추가 필드 포함) */
  createRoomResponse: CreateRoomResponse | null;
  /** 캡슐 ID (참여자 조회용) */
  capsuleId: string | null;
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
 * 1. loadRoomData(): 대기실 데이터 가져오기
 *    - 방장 모드: createRoomAndGetSettings(orderId) → 대기실 생성 및 설정값 조회
 *    - 게스트 모드: getRoomSettings(capsuleId) → 대기실 설정값만 조회
 *    - 실패 시 목데이터로 폴백
 * 2. calculateProgress(): 진행률 계산 (완료 인원 / 전체 인원)
 * 3. canSubmit(): 최종 제출 가능 여부 확인 (진행률 100%)
 *
 * @param orderId 주문 ID (UUID, 방장용)
 * @param guestCapsuleId 캡슐 ID (UUID, 게스트용 - 딥링크로 입장 시)
 * @returns {UseRoomDataReturn} Hook 반환값
 */
export function useRoomData(orderId?: string, guestCapsuleId?: string): UseRoomDataReturn {
  // ============================================
  // 상태 관리
  // ============================================

  const [roomSettings, setRoomSettings] = useState<RoomSettingsResponse | null>(null);
  const [createRoomResponse, setCreateRoomResponse] = useState<CreateRoomResponse | null>(null);
  const [capsuleId, setCapsuleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // ============================================
  // 데이터 가져오기 (API 우선, 목데이터 폴백)
  // ============================================

  useEffect(() => {
    /**
     * 캡슐대기실 설정값 가져오기
     * - 방장 모드: createRoomAndGetSettings(orderId) → 대기실 생성 및 설정값 조회
     * - 게스트 모드: getRoomSettings(capsuleId) → 대기실 설정값만 조회
     * - 실패 시 목데이터로 폴백
     */
    async function loadRoomData() {
      setIsLoading(true);
      setError(null);

      try {
        // ⭐ 방장 모드: orderId로 대기실 생성
        if (orderId) {
          console.log('🔄 [useRoomData] 방장 모드 - 대기실 생성 시작, orderId:', orderId);
          const roomData = await createRoomAndGetSettings(orderId);

          // 실제 API 응답 저장
          setCreateRoomResponse(roomData);
          const extractedCapsuleId = roomData.capsule_id;
          setCapsuleId(extractedCapsuleId);

          console.log('✅ [useRoomData] 대기실 생성 성공, capsuleId:', extractedCapsuleId);

          // 🔍 백엔드 변경사항 확인용 상세 로그
          console.log('🔍 [useRoomData] capsule_title 확인:', (roomData as any).capsule_title || roomData.title);
          console.log('🔍 [useRoomData] invite_code 확인:', roomData.invite_code);
          console.log('🔍 [useRoomData] 딥링크 확인:', (roomData as any).deep_link || `timeegg://room/join?invite_code=${roomData.invite_code}`);
          console.log('🔍 [useRoomData] 전체 응답 데이터:', JSON.stringify(roomData, null, 2));

          // ⭐ 2단계: 대기실 설정값 조회 (max_images_per_person, has_music, has_video 포함)
          try {
            console.log(
              '🔄 [useRoomData] 대기실 설정값 조회 시작 - capsuleId:',
              extractedCapsuleId,
            );
            const settingsData = await getRoomSettings(extractedCapsuleId);

            // ⭐ 디버깅: 백엔드가 반환한 설정값 확인
            console.log('🔍 [useRoomData] 백엔드 반환 설정값:', settingsData);
            console.log(
              '🔍 [useRoomData] max_images_per_person 확인:',
              settingsData.max_images_per_person,
            );

            // CreateRoomResponse의 추가 정보와 병합
            // getRoomSettings의 capsule_name이 orders에서 설정한 정확한 제목이므로 우선 사용
            const mergedSettings: RoomSettingsResponse = {
              ...settingsData,
              // CreateRoomResponse에서 가져온 정보로 덮어쓰기
              room_id: roomData.capsule_id,
              // capsule_name은 getRoomSettings에서 가져온 값 사용 (orders에서 설정한 제목)
              open_date: roomData.open_date.split('T')[0], // ISO 8601에서 YYYY-MM-DD 추출
              max_participants: roomData.max_participants,
            };
            setRoomSettings(mergedSettings);

            console.log('✅ [useRoomData] 대기실 설정값 조회 성공:', mergedSettings);
            console.log(
              '⚠️ [useRoomData] 주의: max_images_per_person이 orders의 photo_count와 일치하는지 확인 필요',
            );
          } catch (settingsError) {
            console.warn('⚠️ [useRoomData] 설정값 조회 실패, 기본값 사용:', settingsError);
            // 설정값 조회 실패 시 CreateRoomResponse만으로 구성
            // title을 capsule_name으로 사용 (fallback)
            const fallbackSettings: RoomSettingsResponse = {
              room_id: roomData.capsule_id,
              capsule_name: roomData.title, // fallback: CreateRoomResponse의 title 사용
              open_date: roomData.open_date.split('T')[0],
              max_participants: roomData.max_participants,
              max_images_per_person: 3, // 기본값
              has_music: false, // 기본값
              has_video: false, // 기본값
            };
            setRoomSettings(fallbackSettings);
          }
        }
        // ⭐ 게스트 모드: capsuleId로 대기실 설정값만 조회
        else if (guestCapsuleId) {
          console.log('🔄 [useRoomData] 게스트 모드 - 대기실 조회 시작, capsuleId:', guestCapsuleId);
          setCapsuleId(guestCapsuleId);

          // 대기실 설정값만 조회
          const settingsData = await getRoomSettings(guestCapsuleId);
          console.log('✅ [useRoomData] 게스트 모드 - 대기실 조회 성공:', settingsData);
          setRoomSettings(settingsData);
        }
        // orderId도 capsuleId도 없으면 목데이터 사용
        else {
          console.log('ℹ️ [useRoomData] orderId/capsuleId 없음, 목데이터 사용');
          await new Promise((resolve) => setTimeout(resolve, 300)); // 로딩 시뮬레이션
          setRoomSettings(mockRoomData);
          setCapsuleId(mockRoomData.room_id);
        }
      } catch (err) {
        console.warn('⚠️ [useRoomData] API 호출 실패, 목데이터 사용:', err);
        setError(err instanceof Error ? err : new Error('API 호출 실패'));
        // 목데이터로 폴백 (snake_case)
        setRoomSettings(mockRoomData);
        setCapsuleId(mockRoomData.room_id);
      } finally {
        setIsLoading(false);
      }
    }

    loadRoomData();
  }, [orderId, guestCapsuleId]);

  // ============================================
  // 진행률 계산 (useMemo로 최적화)
  // ============================================

  /**
   * 진행률 계산
   *
   * 계산 로직:
   * - 완료 인원: status === 'completed'인 참여자 수
   * - 전체 인원: max_participants (정원)
   * - 진행률: (완료 인원 / 전체 인원) × 100
   *
   * @param {Participant[]} participants 참여자 목록
   * @returns {Progress} 진행률 데이터
   */
  const calculateProgress = useMemo(() => {
    return (participants: Participant[]): Progress => {
      // 완료한 참여자 수
      const completed = participants.filter((p) => p.status === 'completed').length;

      // 전체 참여자 수 (max_participants 기준)
      const total = roomSettings?.max_participants || 0;

      // 진행률 계산 (0-100)
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        completed,
        total,
        percentage,
      };
    };
  }, [roomSettings]);

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
    createRoomResponse,
    capsuleId,
    isLoading,
    error,
    calculateProgress,
    canSubmit,
  };
}
