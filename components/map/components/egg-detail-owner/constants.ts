/**
 * components/map/components/egg-detail-owner/constants.ts
 * 이스터에그 상세 컴포넌트 상수 정의
 *
 * @description
 * - Figma 디자인 기준으로 텍스트, 아이콘, 크기 정의
 * - 하드코딩된 값들을 상수로 분리
 */

// ============================================
// 텍스트 상수
// ============================================
export const TEXTS = {
  header: {
    subtitle: '내가 숨긴 이스터에그',
  },
  infoCard: {
    dateLabel: '숨긴 날짜',
    locationLabel: '위치',
  },
  discovery: {
    title: '발견 기록',
    emptyText: '아직 발견한 친구가 없어요',
  },
  button: {
    close: '닫기',
  },
} as const;

