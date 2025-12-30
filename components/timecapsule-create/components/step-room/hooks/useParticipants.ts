/**
 * components/timecapsule-create/components/step-room/hooks/useParticipants.ts
 * 참여자 목록 관리,상태 관리, 작성 내용 저장 Hook
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_EMOJI, EMPTY_SLOT_EMOJI, PARTICIPANT_STATUS } from '../constants';
import type { Participant, ParticipantContent, ParticipantStatus } from '../types';

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
  /** 참여자 상태 업데이트 (pending → completed) */
  updateStatus: (participantId: string, status: ParticipantStatus) => void;
  /** 참여자 작성 내용 저장 (본인만) */
  saveContent: (participantId: string, content: ParticipantContent) => Promise<void>;
  /** 편집 가능 여부 확인 (본인만) */
  canEdit: (participantId: string) => boolean;
}

// ============================================
// Hook
// ============================================

/**
 * 참여자 목록 관리 Hook
 *
 * 기능:
 * 1. fetchParticipants(): 참여자 목록 가져오기 (목데이터)
 * 2. updateParticipantStatus(): 참여자 상태 업데이트 (pending → completed)
 * 3. saveParticipantContent(): 참여자 작성 내용 저장 (본인만)
 * 4. canEditParticipant(): 편집 가능 여부 확인 (본인만)
 *
 * @returns {UseParticipantsReturn} Hook 반환값
 */
export function useParticipants(): UseParticipantsReturn {
  // ============================================
  // 상태 관리
  // ============================================

  const [participants, setParticipants] = useState<Participant[]>([]);

  // ============================================
  // 데이터 가져오기 (목데이터)
  // ============================================

  useEffect(() => {
    /**
     * 참여자 목록 가져오기
     * ⚠️ 추후 백엔드 API로 교체될 예정
     */
    async function fetchParticipants() {
      try {
        // TODO: API 연동
        // const response = await fetch(`/api/room/${capsuleId}/participants`);
        // const data = await response.json();
        // setParticipants(data);

        // 목데이터 반환
        await new Promise((resolve) => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        setParticipants(mockParticipants);
      } catch (err) {
        console.error('❌ [useParticipants] 참여자 목록 로딩 실패:', err);
      }
    }

    fetchParticipants();
  }, []);

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
    updateStatus,
    saveContent,
    canEdit,
  };
}
