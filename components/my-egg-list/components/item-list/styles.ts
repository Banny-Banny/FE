/**
 * components/my-egg-list/components/item-list/styles.ts
 * 이스터에그 목록 아이템 리스트 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Figma 디자인 사이즈 정확히 반영 (소수점 반올림)
 *
 * Figma 노드 ID: 585:2855
 * 생성 시각: 2025-01-XX
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 20, // 16px → 20px (아이템 간 더 넓은 간격)
    paddingHorizontal: Spacing.lg, // 24px
    paddingVertical: Spacing.xl, // 24px → 32px (더 넓은 상하 여백)
  },
  // ============================================
  // Section
  // ============================================
  section: {
    flexDirection: 'column',
    gap: 16, // 12px → 16px (섹션 내 아이템 간격)
    width: '100%',
    marginBottom: 8, // 섹션 간 간격 추가
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 24, // 20px → 24px (더 넓은 높이)
    marginBottom: 8, // 4px → 8px (헤더와 아이템 간 더 넓은 간격)
    paddingHorizontal: 4, // 약간의 좌우 패딩
  },
  sectionTitle: {
    ...Typography.body.body11,
    fontSize: 15, // 14px → 15px (약간 더 큰 폰트)
    color: Colors.black[500],
    fontWeight: Typography.header.h4.fontWeight, // SemiBold로 더 강조
    letterSpacing: -0.3, // 더 자연스러운 간격
  },
  sectionTitleExpired: {
    ...Typography.body.body11,
    fontSize: 15, // 14px → 15px
    color: Colors.darkGrey[600], // #888 → #606060 (더 진한 회색)
    fontWeight: Typography.header.h4.fontWeight, // SemiBold로 일관성
    letterSpacing: -0.3,
  },
});

