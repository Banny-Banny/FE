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

import { Spacing } from '@/commons/constants';
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
    gap: 16, // Figma: 15.99px → 16px
    paddingHorizontal: Spacing.lg, // 24px
    paddingVertical: Spacing.lg, // 24px
  },
});

