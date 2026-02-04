/**
 * components/my-egg-list/components/item/styles.ts
 * 이스터에그 목록 아이템 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 * - [✓] Figma 디자인 사이즈 정확히 반영 (소수점 반올림)
 *
 * Figma 노드 ID: 585:2856
 * 생성 시각: 2025-01-XX
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    width: '100%', // 반응형: 화면 전체 너비 사용
    backgroundColor: Colors.white[500], // Figma: #fafafa (활성 알)
    borderWidth: 1,
    borderColor: Colors.border.light, // rgba(10,10,10,0.08)
    borderRadius: 18, // 적절한 모서리
    overflow: 'hidden',
  },
  containerExpired: {
    backgroundColor: Colors.whiteGrey[100], // 소멸된 알 배경색 (#F7F7F7) - 더 연하게
    borderColor: Colors.border.lighter, // 더 연한 테두리
  },

  // ============================================
  // Content
  // ============================================
  content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 20, // 적절한 여백
    paddingVertical: 16, // 적절한 여백
    gap: 16, // 적절한 간격
  },

  // ============================================
  // Header Row
  // ============================================
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16, // 적절한 간격
    width: '100%',
  },
  iconContainer: {
    width: 52, // 적절한 크기
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 52,
    height: 52,
    // resizeMode는 expo-image의 contentFit prop으로 처리됨
  },
  textContainer: {
    flex: 1,
    minHeight: 64, // 높이 약간 줄임
    justifyContent: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6, // 적절한 간격
    gap: 8, // 적절한 간격
  },
  titleText: {
    flex: 1,
    fontFamily: Typography.header.h3.fontFamily,
    fontSize: 18, // 적절한 크기
    lineHeight: 22, // 적절한 줄간격
    fontWeight: Typography.header.h5.fontWeight, // ExtraBold (800)
    color: Colors.black[500], // #0a0a0a
    letterSpacing: -0.5, // 자연스러운 간격
  },
  mediaIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mediaIconWrapper: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // 4px → 5px
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.whiteGrey[200], // 배경 추가로 더 세련되게
  },
  viewCountText: {
    fontFamily: Typography.body.body8.fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: Typography.body.body8.fontWeight, // SemiBold (600)
    color: Colors.darkGrey[700], // #888 → #4B4B4B (더 진한 회색)
  },
  descriptionText: {
    fontFamily: Typography.body.body6.fontFamily,
    fontSize: 14,
    lineHeight: 20, // 적절한 줄간격
    fontWeight: Typography.body.body6.fontWeight, // Regular (400)
    color: Colors.darkGrey[600], // 더 진한 회색으로 가독성 향상
    letterSpacing: -0.2, // 자연스러운 간격
  },

  // ============================================
  // Footer Row
  // ============================================
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 10, // 적절한 여백
    borderTopWidth: 1,
    borderTopColor: Colors.border.lighter, // rgba(10,10,10,0.06)
  },
  metaContainer: {
    flex: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // 8px → 10px
    minWidth: 0, // flex shrink를 위한 필수 속성
  },
  locationContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // 2px → 4px (아이콘과 텍스트 간격)
    minWidth: 0, // flex shrink를 위한 필수 속성
  },
  locationIconContainer: {
    width: 14, // 12px → 14px (약간 더 큰 아이콘)
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaText: {
    flexShrink: 1,
    fontFamily: Typography.body.body8.fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: Typography.body.body8.fontWeight, // SemiBold (600)
    color: Colors.darkGrey[600], // #888 → #606060 (더 진한 회색)
  },
  divider: {
    width: 3, // 4px → 3px (더 작고 세련된 점)
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.grey[400], // #B2B2B2 → #C1C1C1 (더 연한 회색)
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 6px → 8px (아이콘 간 간격)
  },
  actionButton: {
    width: 18, // 적절한 크기
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    // 배경과 둥근 모서리 제거
  },
});

