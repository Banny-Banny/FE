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
 * @property {string|null} profileImg - 프로필 이미지 URL
 * @property {boolean} isBlocked - 차단 여부
 *
 * @type {Friend[]}
 */
export const DEFAULT_FRIENDS = [
  { id: '1', name: '김민수', emoji: '🐨', profileImg: null, isBlocked: false },
  { id: '2', name: '이지은', emoji: '🐼', profileImg: null, isBlocked: false },
  { id: '3', name: '최유나', emoji: '🐯', profileImg: null, isBlocked: false },
  { id: '4', name: '정우성', emoji: '🐰', profileImg: null, isBlocked: false },
  { id: '5', name: '한지민', emoji: '🦋', profileImg: null, isBlocked: false },
  { id: '6', name: '신유', emoji: '🐶', profileImg: null, isBlocked: false },
  { id: '7', name: '최산', emoji: '🦊', profileImg: null, isBlocked: false },
  { id: '8', name: '김선호', emoji: '🐮', profileImg: null, isBlocked: false },
  { id: '9', name: '박서준', emoji: '🐵', profileImg: null, isBlocked: true },
];

/**
 * 목데이터: 새로운 알림 목록
 * - 피그마 디자인 기준으로 작성
 * - Notification 컴포넌트의 기본 데이터로 사용
 * - ⚠️ 추후 백엔드 API로 교체될 예정
 *
 * @typedef {Object} Notification
 * @property {string} id - 알림 고유 ID
 * @property {string} icon - 알림 아이콘 (이모지)
 * @property {string} title - 알림 제목
 * @property {string} description - 알림 설명
 * @property {string} time - 알림 시간 (상대 시간)
 * @property {boolean} isRead - 읽음 여부
 *
 * @type {Notification[]}
 */
export const DEFAULT_NEW_NOTIFICATIONS = [
  {
    id: '1',
    icon: '🥚',
    title: '이스터에그 발견!',
    description: '누군가 "응원의 메시지" 알을 발견했어요 🎉',
    time: '방금 전',
    isRead: false,
  },
  {
    id: '2',
    icon: '💊',
    title: '캡슐 초대장이 도착했어요',
    description: '김민수님이 "졸업 여행" 캡슐에 초대했어요',
    time: '10분 전',
    isRead: false,
  },
  {
    id: '3',
    icon: '👋',
    title: '새로운 친구 추가',
    description: '이지은님이 친구로 추가되었어요!',
    time: '1시간 전',
    isRead: false,
  },
];

/**
 * 목데이터: 이전 알림 목록
 * - 피그마 디자인 기준으로 작성
 * - Notification 컴포넌트의 기본 데이터로 사용
 * - ⚠️ 추후 백엔드 API로 교체될 예정
 *
 * @typedef {Object} Notification
 * @property {string} id - 알림 고유 ID
 * @property {string} icon - 알림 아이콘 (이모지)
 * @property {string} title - 알림 제목
 * @property {string} description - 알림 설명
 * @property {string} time - 알림 시간 (상대 시간)
 * @property {boolean} isRead - 읽음 여부
 *
 * @type {Notification[]}
 */
export const DEFAULT_OLD_NOTIFICATIONS = [
  {
    id: '4',
    icon: '🎁',
    title: '캡슐이 열렸어요!',
    description: '"생일 파티" 캡슐의 잠금이 해제되었어요',
    time: '3시간 전',
    isRead: true,
  },
  {
    id: '5',
    icon: '✨',
    title: '이스터에그 소멸',
    description: '"좋은 하루" 알이 3명에게 발견되어 소멸되었어요',
    time: '어제',
    isRead: true,
  },
  {
    id: '6',
    icon: '🥚',
    title: '이스터에그 발견!',
    description: '누군가 "좋아하는 노래" 알을 발견했어요',
    time: '2일 전',
    isRead: true,
  },
  {
    id: '7',
    icon: '💊',
    title: '캡슐 초대장',
    description: '박서준님이 "생일 파티" 캡슐에 초대했어요',
    time: '3일 전',
    isRead: true,
  },
];
