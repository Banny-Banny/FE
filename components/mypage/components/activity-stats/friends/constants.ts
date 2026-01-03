/**
 * components/mypage/components/activity-stats/friends/constants.ts
 * 친구 관리 모달 상수 및 목업 데이터
 *
 * @description
 * - 친구 목록 목업 데이터 정의
 * - 피그마 디자인 기준으로 작성된 기본 친구 목록
 * - 컴포넌트 props의 기본값으로 사용됨
 * - ⚠️ 추후 백엔드 API 연동 시 Hook으로 이동 예정
 */

import type { Friend } from './types';

// ============================================
// 목데이터 (백엔드 API 준비 전)
// ============================================

/**
 * 목데이터: 기본 친구 목록
 * - 피그마 디자인 기준으로 작성
 * - FriendsModal 컴포넌트의 props 기본값으로 사용
 * - ⚠️ 추후 백엔드 API로 교체될 예정
 * - TODO: useFriends Hook 생성 후 이 데이터를 Hook 내부로 이동
 */
export const DEFAULT_FRIENDS: Friend[] = [
  { id: '1', name: '김민수', emoji: '🐨', isBlocked: false },
  { id: '2', name: '이지은', emoji: '🐼', isBlocked: false },
  { id: '3', name: '최유나', emoji: '🐯', isBlocked: false },
  { id: '4', name: '정우성', emoji: '🐰', isBlocked: false },
  { id: '5', name: '한지민', emoji: '🦋', isBlocked: false },
  { id: '6', name: '신유', emoji: '🐶', isBlocked: false },
  { id: '7', name: '최산', emoji: '🦊', isBlocked: false },
  { id: '8', name: '김선호', emoji: '🐮', isBlocked: false },
  { id: '9', name: '박서준', emoji: '🐵', isBlocked: true },
];

