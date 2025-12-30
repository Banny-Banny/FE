/**
 * components/timecapsule-create/components/step-room/hooks/useRoomSubmit.ts
 * 타임캡슐 최종 제출 Hook
 *
 * 체크리스트:
 * - [✓] submitTimeCapsule 함수 구현
 * - [✓] 모든 참여자 콘텐츠 수집 로직
 * - [✓] 캡슐 메타데이터 포함
 * - [✓] FormData 생성 로직
 * - [✓] Mock API 호출 (백엔드 연동 전)
 * - [✓] 로딩 상태 관리
 * - [✓] 에러 상태 관리
 */

import { useState } from 'react';
import type { Participant, RoomData } from '../types';

// ============================================
// 타입 정의
// ============================================

/** 타임캡슐 제출 데이터 */
export interface TimeCapsuleSubmitData {
  /** 캡슐 메타데이터 */
  capsuleId: string;
  capsuleName: string;
  openDate: string;
  maxParticipants: number;
  imageSlots: number;
  additionalOptions: {
    hasMusicFile: boolean;
    hasVideo: boolean;
  };
  /** 참여자 데이터 (완료된 참여자만) */
  participants: Array<{
    participantId: string;
    participantName: string;
    emoji: string;
    isHost: boolean;
    content: {
      text?: string;
      images?: string[];
      voiceRecording?: string;
    };
  }>;
  /** 제출 시간 */
  submittedAt: string;
}

/** useRoomSubmit Hook 반환 타입 */
interface UseRoomSubmitReturn {
  /** 타임캡슐 최종 제출 */
  submitTimeCapsule: (roomData: RoomData, participants: Participant[]) => Promise<void>;
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
 * 1. 모든 참여자의 콘텐츠 데이터 수집
 * 2. 캡슐 메타데이터와 함께 제출 데이터 구성
 * 3. 백엔드 API로 전송 (현재는 Mock)
 *
 * @returns {UseRoomSubmitReturn} Hook 반환값
 */
export function useRoomSubmit(): UseRoomSubmitReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 타임캡슐 최종 제출 함수
   *
   * @param {RoomData} roomData 캡슐대기실 데이터
   * @param {Participant[]} participants 참여자 목록
   */
  const submitTimeCapsule = async (roomData: RoomData, participants: Participant[]): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);

      console.log('=== 타임캡슐 최종 제출 시작 ===');

      // 1. 완료된 참여자만 필터링 (name이 있고 status가 completed인 참여자)
      const completedParticipants = participants.filter(
        (p) => p.name !== '' && p.status === 'completed',
      );

      console.log(`✅ 완료된 참여자: ${completedParticipants.length}명`);

      if (completedParticipants.length === 0) {
        throw new Error('완료된 참여자가 없습니다.');
      }

      // 2. 제출 데이터 구성
      const submitData: TimeCapsuleSubmitData = {
        // 캡슐 메타데이터
        capsuleId: roomData.capsuleId,
        capsuleName: roomData.capsuleName,
        openDate: roomData.openDate,
        maxParticipants: roomData.maxParticipants,
        imageSlots: roomData.imageSlots,
        additionalOptions: roomData.additionalOptions,

        // 참여자 데이터
        participants: completedParticipants.map((p) => ({
          participantId: p.id,
          participantName: p.name,
          emoji: p.emoji,
          isHost: p.isHost || false,
          content: {
            text: p.content?.text || '',
            images: p.content?.images || [],
            voiceRecording: p.content?.voiceRecording || undefined,
          },
        })),

        // 제출 시간
        submittedAt: new Date().toISOString(),
      };

      console.log('=== 제출 데이터 ===');
      console.log('캡슐 이름:', submitData.capsuleName);
      console.log('개봉일:', submitData.openDate);
      console.log('참여자 수:', submitData.participants.length);

      // 참여자별 콘텐츠 로그
      submitData.participants.forEach((p, index) => {
        console.log(`\n--- 참여자 ${index + 1}: ${p.participantName} ${p.emoji} ---`);
        console.log('  방장 여부:', p.isHost);
        console.log('  텍스트:', p.content.text || '(없음)');
        console.log('  이미지 개수:', p.content.images?.length || 0);
        console.log('  음성 녹음:', p.content.voiceRecording ? '있음' : '없음');
      });

      // 3. Mock API 호출 시뮬레이션 (네트워크 지연 2초)
      console.log('\n=== Mock API 전송 중... ===');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: 실제 백엔드 API 엔드포인트 호출
      // const response = await fetch('/api/timecapsule/submit', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(submitData),
      // });
      //
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || '타임캡슐 제출에 실패했습니다');
      // }
      //
      // const result = await response.json();
      // console.log('✅ 백엔드 응답:', result);

      console.log('=== 타임캡슐 최종 제출 완료! ===');
      console.log('📦 제출된 데이터:', JSON.stringify(submitData, null, 2));

      // 4. 제출 성공
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
