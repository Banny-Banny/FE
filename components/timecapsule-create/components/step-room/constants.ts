/**
 * components/timecapsule-create/components/step-room/constants.ts
 * StepRoom 상수 정의
 */

// ============================================
// 아바타 이모지
// ============================================

/** 기본 아바타 이모지 */
export const DEFAULT_EMOJI = '🥚';

/** 빈 슬롯 이모지 */
export const EMPTY_SLOT_EMOJI = '👤';

// ============================================
// 작성 마감 시간
// ============================================

/** 기본 작성 마감 시간 (24시간) */
export const DEFAULT_DEADLINE_HOURS = 24;

// ============================================
// 대기실 상태
// ============================================

/** 대기실 상태 상수 */
export const ROOM_STATUS = {
  /** 참여자 대기 중 */
  WAITING: 'waiting' as const,
  /** 모든 참여자 작성 완료 */
  READY: 'ready' as const,
  /** 최종 제출 완료 */
  SUBMITTED: 'submitted' as const,
};

// ============================================
// 참여자 상태
// ============================================

/** 참여자 상태 상수 */
export const PARTICIPANT_STATUS = {
  /** 작성 완료 */
  COMPLETED: 'completed' as const,
  /** 작성 중/미작성 */
  PENDING: 'pending' as const,
  /** 아직 입장 안함 */
  WAITING: 'waiting' as const,
};

// ============================================
// 프로그레스바 색상 (선택사항)
// ============================================

/** 프로그레스바 색상 상수 */
export const PROGRESS_COLORS = {
  /** 채워진 부분 색상 */
  FILL_COLOR: '#000000',
  /** 배경 색상 */
  BACKGROUND_COLOR: '#E5E5E5',
  /** 100% 달성 시 색상 */
  COMPLETE_COLOR: '#4CAF50',
};

// ============================================
// 목데이터
// ============================================

import type { RoomSettingsResponse } from './types';

/**
 * 목데이터: 대기실 설정값
 * ⚠️ API 호출 실패 시 폴백용으로 사용됨
 */
export const mockRoomData: RoomSettingsResponse = {
  room_id: 'e564ef86-f16c-4661-93e7-71297284fb18', // 백엔드 제공 테스트 캡슐 ID
  capsule_name: '강동구 물주먹들👊',
  open_date: '2026-01-16', // YYYY-MM-DD 형식
  max_participants: 4,
  max_images_per_person: 3,
  has_music: true,
  has_video: true,
};
