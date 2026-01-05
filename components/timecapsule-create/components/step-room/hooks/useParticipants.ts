/**
 * components/timecapsule-create/components/step-room/hooks/useParticipants.ts
 * 참여자 목록 관리,상태 관리, 작성 내용 저장 Hook
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRoomDetail } from '../api/capsule';
import { DEFAULT_EMOJI, EMPTY_SLOT_EMOJI, PARTICIPANT_STATUS } from '../constants';
import type { Participant, ParticipantContent, ParticipantStatus } from '../types';
import { getUserFromToken } from '@/utils/auth';
import { STORAGE_KEYS } from '@/commons/constants/storage';

// ============================================
// 테스트 모드 설정
// ============================================

/**
 * 테스트 시나리오 타입
 *
 * - 'solo': 혼자만 입장 (기본)
 * - 'partial': 2명 입장, 1명 완료
 * - 'full': 4명 모두 입장, 일부 완료
 * - 'ready': 모두 작성 완료 (제출 가능 상태)
 */
export type TestScenario = 'solo' | 'partial' | 'full' | 'ready';

/**
 * 현재 테스트 시나리오 설정
 * ⚠️ 이 값을 변경하면 대기실 상태가 즉시 바뀝니다!
 */

// 테스트용 ⬇️
// const CURRENT_TEST_SCENARIO: TestScenario = 'solo';  // 'solo' | 'partial' | 'full' | 'ready'
const CURRENT_TEST_SCENARIO: TestScenario = 'ready';

// ============================================
// 목데이터 생성 함수 (테스트용)
// ============================================

/**
 * 테스트 시나리오별 참여자 목록 생성
 *
 * @param {TestScenario} scenario 테스트 시나리오
 * @returns {Participant[]} 참여자 목록
 */
function createTestParticipants(scenario: TestScenario): Participant[] {
  const baseParticipants: Record<TestScenario, Participant[]> = {
    // 시나리오 1: 혼자만 입장 (기본)
    solo: [
      {
        id: 'user-001',
        name: '나 (존잘최홍식)',
        emoji: DEFAULT_EMOJI,
        status: PARTICIPANT_STATUS.PENDING,
        isMe: true,
        isHost: true,
        joinedAt: '2025-12-29T10:00:00Z',
      },
      {
        id: 'slot-002',
        name: '',
        emoji: EMPTY_SLOT_EMOJI,
        status: PARTICIPANT_STATUS.WAITING,
      },
      {
        id: 'slot-003',
        name: '',
        emoji: EMPTY_SLOT_EMOJI,
        status: PARTICIPANT_STATUS.WAITING,
      },
      {
        id: 'slot-004',
        name: '',
        emoji: EMPTY_SLOT_EMOJI,
        status: PARTICIPANT_STATUS.WAITING,
      },
    ],

    // 시나리오 2: 2명 입장, 둘 다 미완료
    partial: [
      {
        id: 'user-001',
        name: '나 (존잘최홍식)',
        emoji: DEFAULT_EMOJI,
        status: PARTICIPANT_STATUS.PENDING,
        isMe: true,
        isHost: true,
        joinedAt: '2025-12-29T10:00:00Z',
      },
      {
        id: 'user-002',
        name: '친구1 (김철수)',
        emoji: '🐣',
        status: PARTICIPANT_STATUS.PENDING,
        isMe: false, // 다른 사람 (클릭 차단)
        isHost: false,
        joinedAt: '2025-12-29T10:30:00Z',
      },
      {
        id: 'slot-003',
        name: '',
        emoji: EMPTY_SLOT_EMOJI,
        status: PARTICIPANT_STATUS.WAITING,
      },
      {
        id: 'slot-004',
        name: '',
        emoji: EMPTY_SLOT_EMOJI,
        status: PARTICIPANT_STATUS.WAITING,
      },
    ],

    // 시나리오 3: 4명 모두 입장, 2명 완료
    full: [
      {
        id: 'user-001',
        name: '나 (존잘최홍식)',
        emoji: DEFAULT_EMOJI,
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: true,
        isHost: true,
        joinedAt: '2025-12-29T10:00:00Z',
        content: {
          text: '내가 작성한 내용입니다!',
          images: [],
        },
      },
      {
        id: 'user-002',
        name: '친구1 (김철수)',
        emoji: '🐣',
        status: PARTICIPANT_STATUS.PENDING,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T10:30:00Z',
      },
      {
        id: 'user-003',
        name: '친구2 (박영희)',
        emoji: '🐥',
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T11:00:00Z',
        content: {
          text: '다른 사람이 작성한 내용 (볼 수 없음)',
        },
      },
      {
        id: 'user-004',
        name: '친구3 (이민수)',
        emoji: '🐤',
        status: PARTICIPANT_STATUS.WAITING,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T11:30:00Z',
      },
    ],

    // 시나리오 4: 모두 작성 완료 (제출 가능 상태)
    ready: [
      {
        id: 'user-001',
        name: '나 (존잘최홍식)',
        emoji: DEFAULT_EMOJI,
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: true,
        isHost: true,
        joinedAt: '2025-12-29T10:00:00Z',
        content: {
          text: '내가 작성한 내용입니다!',
          images: [],
        },
      },
      {
        id: 'user-002',
        name: '친구1 (김철수)',
        emoji: '🐣',
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T10:30:00Z',
      },
      {
        id: 'user-003',
        name: '친구2 (박영희)',
        emoji: '🐥',
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T11:00:00Z',
      },
      {
        id: 'user-004',
        name: '친구3 (이민수)',
        emoji: '🐤',
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T11:30:00Z',
      },
    ],
  };

  return baseParticipants[scenario];
}

/**
 * 목데이터: 참여자 목록
 * ⚠️ 추후 백엔드 API로 교체될 예정
 */
const mockParticipants: Participant[] = createTestParticipants(CURRENT_TEST_SCENARIO);

// ============================================
// 타입 정의
// ============================================

/** useParticipants Hook 반환 타입 */
interface UseParticipantsReturn {
  /** 참여자 목록 */
  participants: Participant[];
  /** 본인 참여자 정보 */
  myParticipant: Participant | undefined;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 */
  error: Error | null;
  /** 참여자 상태 업데이트 (pending → completed) */
  updateStatus: (participantId: string, status: ParticipantStatus) => void;
  /** 참여자 작성 내용 저장 (본인만) */
  saveContent: (participantId: string, content: ParticipantContent) => Promise<void>;
  /** 편집 가능 여부 확인 (본인만) */
  canEdit: (participantId: string) => boolean;
}

/** useParticipants Hook 파라미터 */
interface UseParticipantsParams {
  /** 캡슐 ID (UUID) - 참여자 슬롯 정보 조회용 */
  capsuleId: string | null;
  /** 최대 참여 인원수 - 빈 슬롯 생성용 */
  maxParticipants: number;
}

// ============================================
// Hook
// ============================================

/**
 * 참여자 목록 관리 Hook
 *
 * 기능:
 * 1. fetchParticipants(): 참여자 목록 가져오기 (API 또는 목데이터)
 * 2. updateParticipantStatus(): 참여자 상태 업데이트 (pending → completed)
 * 3. saveParticipantContent(): 참여자 작성 내용 저장 (본인만)
 * 4. canEditParticipant(): 편집 가능 여부 확인 (본인만)
 *
 * @param {UseParticipantsParams} params Hook 파라미터
 * @returns {UseParticipantsReturn} Hook 반환값
 */
export function useParticipants({
  capsuleId,
  maxParticipants,
}: UseParticipantsParams): UseParticipantsReturn {
  // ============================================
  // 상태 관리
  // ============================================

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // ============================================
  // 데이터 가져오기 (목데이터)
  // ============================================

  useEffect(() => {
    /**
     * 참여자 목록 가져오기
     * - capsuleId가 있으면 API 호출
     * - 없으면 대기 (로딩 상태 유지, 목데이터 사용 안 함)
     */
    async function fetchParticipants() {
      // capsuleId가 없으면 아무것도 하지 않음 (로딩 상태 유지)
      if (!capsuleId) {
        // capsuleId가 설정될 때까지 대기 (다음 useEffect 실행에서 처리됨)
        return;
      }

      setIsLoading(true);
      setError(null);

      try {

        // ⭐ API 호출: 대기실 상세 조회
        console.log('🔄 [useParticipants] 참여자 슬롯 정보 조회 시작 - capsuleId:', capsuleId);
        const roomDetail = await getRoomDetail(capsuleId);

          // 현재 사용자 ID 가져오기 (본인 여부 판단용)
          const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          const currentUser = token ? getUserFromToken(token) : null;
          const currentUserId = currentUser?.id || null;

          // slots[] 배열을 Participant[] 형식으로 변환
          const participantsList: Participant[] = [];

          // 실제 슬롯 정보 변환
          for (const slot of roomDetail.slots) {
            if (slot.user_id && slot.nickname) {
              // 배정된 슬롯
              const isMe = slot.user_id === currentUserId;
              participantsList.push({
                id: slot.user_id,
                name: slot.nickname,
                emoji: DEFAULT_EMOJI, // 기본 이모지 (추후 사용자 프로필에서 가져올 수 있음)
                status:
                  slot.status === 'ACCEPTED'
                    ? PARTICIPANT_STATUS.PENDING
                    : PARTICIPANT_STATUS.WAITING,
                isHost: slot.is_host,
                isMe,
                // 작성 완료 여부는 별도 API로 확인 필요 (현재는 PENDING으로 설정)
                // 추후 콘텐츠 저장 API 응답에서 COMPLETED 상태로 업데이트
              });
            }
          }

          // 빈 슬롯 추가 (maxParticipants까지)
          const filledSlots = roomDetail.slots.length;
          for (let i = filledSlots; i < maxParticipants; i++) {
            participantsList.push({
              id: `slot-${i + 1}`,
              name: '',
              emoji: EMPTY_SLOT_EMOJI,
              status: PARTICIPANT_STATUS.WAITING,
            });
          }

        setParticipants(participantsList);
        console.log('✅ [useParticipants] 참여자 슬롯 정보 조회 성공:', participantsList);
      } catch (err) {
        console.warn('⚠️ [useParticipants] API 호출 실패, 목데이터 사용:', err);
        setError(err instanceof Error ? err : new Error('API 호출 실패'));
        // 목데이터로 폴백
        setParticipants(mockParticipants);
      } finally {
        setIsLoading(false);
      }
    }

    fetchParticipants();
  }, [capsuleId, maxParticipants]);

  // ============================================
  // 본인 참여자 정보
  // ============================================

  /**
   * 본인 참여자 정보 찾기
   */
  const myParticipant = useMemo(() => {
    return participants.find((p) => p.isMe);
  }, [participants]);

  // ============================================
  // 참여자 상태 업데이트
  // ============================================

  /**
   * 참여자 상태 업데이트
   *
   * @param {string} participantId 참여자 ID
   * @param {ParticipantStatus} status 새로운 상태
   */
  const updateStatus = useCallback((participantId: string, status: ParticipantStatus) => {
    setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, status } : p)));

    // TODO: API 연동
    // await fetch(`/api/room/${capsuleId}/participants/${participantId}/status`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ status }),
    // });
  }, []);

  // ============================================
  // 참여자 작성 내용 저장
  // ============================================

  /**
   * 참여자 작성 내용 저장 (본인만)
   *
   * 프라이버시 보호:
   * - 본인 것만 저장 가능
   * - 저장 성공 시 상태를 'completed'로 업데이트
   *
   * @param {string} participantId 참여자 ID
   * @param {ParticipantContent} content 작성 내용
   */
  const saveContent = useCallback(
    async (participantId: string, content: ParticipantContent) => {
      try {
        // 본인 것만 저장 가능 (프라이버시 보호)
        const participant = participants.find((p) => p.id === participantId);
        if (!participant?.isMe) {
          throw new Error('본인의 작성 내용만 저장할 수 있습니다.');
        }

        console.log('💾 [useParticipants] 작성 내용 저장 시작:', participantId);

        // TODO: API 연동
        // await fetch(`/api/room/${capsuleId}/participants/${participantId}/content`, {
        //   method: 'POST',
        //   body: JSON.stringify(content),
        // });

        // 목데이터 업데이트
        await new Promise((resolve) => setTimeout(resolve, 500)); // 저장 시뮬레이션

        // 작성 내용 저장 및 상태를 'completed'로 업데이트 (한 번에 처리)
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === participantId ? { ...p, content, status: PARTICIPANT_STATUS.COMPLETED } : p,
          ),
        );

        console.log('✅ [useParticipants] 작성 내용 저장 성공!');
      } catch (err) {
        console.error('❌ [useParticipants] 작성 내용 저장 실패:', err);
        throw err;
      }
    },
    [participants],
  );

  // ============================================
  // 편집 가능 여부 확인
  // ============================================

  /**
   * 편집 가능 여부 확인 (본인만)
   *
   * 프라이버시 보호:
   * - 본인 것만 편집 가능
   * - 다른 사람 것은 편집 불가
   *
   * @param {string} participantId 참여자 ID
   * @returns {boolean} 편집 가능 여부
   */
  const canEdit = useCallback(
    (participantId: string): boolean => {
      const participant = participants.find((p) => p.id === participantId);
      return participant?.isMe === true;
    },
    [participants],
  );

  // ============================================
  // 반환
  // ============================================

  return {
    participants,
    myParticipant,
    isLoading,
    error,
    updateStatus,
    saveContent,
    canEdit,
  };
}
