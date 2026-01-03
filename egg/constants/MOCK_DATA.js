/**
 * egg/constants/MOCK_DATA.js
 * 목업 데이터 상수
 *
 * @description
 * - 프로젝트 전역에서 사용하는 목업 데이터 정의
 * - 피그마 디자인 기준으로 작성된 기본 데이터
 * - ⚠️ 추후 백엔드 API 연동 시 제거될 예정
 */

// ============================================
// 목데이터 (백엔드 API 준비 전)
// ============================================

/**
 * 목데이터: 기본 친구 목록
 * - 피그마 디자인 기준으로 작성
 * - FriendsModal 컴포넌트의 props 기본값으로 사용
 * - ⚠️ 추후 백엔드 API로 교체될 예정
 *
 * @typedef {Object} Friend
 * @property {string} id - 친구 고유 ID
 * @property {string} name - 친구 이름
 * @property {string} emoji - 친구 아바타 이모지
 * @property {boolean} isBlocked - 차단 여부
 *
 * @type {Friend[]}
 */
export const DEFAULT_FRIENDS = [
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

