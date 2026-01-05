/**
 * components/timecapsule-create/components/step-room/hooks/useRoomData.ts
 * 캡슐대기실 기본 정보, 진행률 계산 Hook
 */

import { useEffect, useMemo, useState } from 'react';
import { getOrderInfo, getRoomSettings } from '../api/capsule';
import { mockRoomData, ROOM_STATUS } from '../constants';
import type { OrderResponse, Participant, Progress, RoomData, RoomSettingsResponse } from '../types';

// ============================================
// 타입 정의
// ============================================

/** useRoomData Hook 반환 타입 */
interface UseRoomDataReturn {
  /** 주문 정보 (snake_case) - 1단계 API 응답 */
  orderInfo: OrderResponse | null;
  /** 캡슐대기실 설정값 (snake_case) - 2단계 API 응답 */
  roomSettings: RoomSettingsResponse | null;
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
 * 1. loadRoomData(): 2단계 API 호출로 캡슐대기실 설정값 가져오기
 *    - 1단계: getOrderInfo(orderId) → order.capsule_id 추출
 *    - 2단계: getRoomSettings(capsule_id) → 대기실 설정 조회
 *    - 실패 시 목데이터로 폴백
 * 2. calculateProgress(): 진행률 계산 (완료 인원 / 전체 인원)
 * 3. canSubmit(): 최종 제출 가능 여부 확인 (진행률 100%)
 *
 * @param orderId 주문 ID (UUID, 옵션)
 * @returns {UseRoomDataReturn} Hook 반환값
 */
export function useRoomData(orderId?: string): UseRoomDataReturn {
  // ============================================
  // 상태 관리
  // ============================================

  const [orderInfo, setOrderInfo] = useState<OrderResponse | null>(null);
  const [roomSettings, setRoomSettings] = useState<RoomSettingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // ============================================
  // 데이터 가져오기 (API 우선, 목데이터 폴백)
  // ============================================

  useEffect(() => {
    /**
     * 캡슐대기실 설정값 가져오기
     * - 2단계 API 호출 전략:
     *   1단계: getOrderInfo(orderId) → order.capsule_id 추출
     *   2단계: getRoomSettings(capsule_id) → 대기실 설정 조회
     * - 실패 시 목데이터로 폴백
     */
    async function loadRoomData() {
      try {
        setIsLoading(true);
        setError(null);

        // ⚠️ [임시] 백엔드 연결 끊음 - 커밋용
        console.log('⚠️ [useRoomData] 백엔드 연결 끊음 - 목데이터만 사용');
        await new Promise((resolve) => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        setRoomSettings(mockRoomData);

        // if (orderId) {
        //   // ⭐ 2단계 API 호출 시작
        //   try {
        //     console.log('🔄 [useRoomData] 2단계 API 호출 시작 - orderId:', orderId);

        //     // ⭐ 1단계: Order 조회 → capsule_id 추출
        //     const orderData = await getOrderInfo(orderId);
        //     setOrderInfo(orderData);
        //     console.log('✅ [useRoomData] 1단계 완료 - capsule_id:', orderData.order.capsule_id);

        //     const capsuleId = orderData.order.capsule_id;

        //     // capsule_id가 null인 경우 처리
        //     if (!capsuleId) {
        //       throw new Error('주문에 연결된 캡슐 ID가 없습니다.');
        //     }

        //     // ⭐ 2단계: capsule_id로 Room Settings 조회
        //     const roomData = await getRoomSettings(capsuleId);
        //     setRoomSettings(roomData);
        //     console.log('✅ [useRoomData] 2단계 완료 - Room Settings 조회 성공:', roomData);
        //   } catch (apiError) {
        //     console.warn('⚠️ [useRoomData] API 호출 실패, 목데이터 사용:', apiError);
        //     setError(apiError instanceof Error ? apiError : new Error('API 호출 실패'));
        //     // 목데이터로 폴백
        //     setRoomSettings(mockRoomData);
        //   }
        // } else {
        //   // orderId가 없으면 목데이터 사용
        //   console.log('ℹ️ [useRoomData] orderId 없음, 목데이터 사용');
        //   await new Promise((resolve) => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        //   setRoomSettings(mockRoomData);
        // }
      } catch (err) {
        console.error('❌ [useRoomData] 데이터 로딩 실패:', err);
        setError(err instanceof Error ? err : new Error('데이터 로딩 실패'));
        // 최종 폴백: 목데이터 사용
        setRoomSettings(mockRoomData);
      } finally {
        setIsLoading(false);
      }
    }

    loadRoomData();
  }, [orderId]);

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
    orderInfo,
    roomSettings,
    isLoading,
    error,
    calculateProgress,
    canSubmit,
  };
}
