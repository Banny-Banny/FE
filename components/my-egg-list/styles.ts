/**
 * components/my-egg-list/styles.ts
 * 이스터에그 목록 Feature Container 스타일
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 *
 * Figma 노드 ID: 161:29166 (발견한 알), 161:25846 (심은 알)
 * 생성 시각: 2025-01-XX
 */

import { Colors, Spacing } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flex: 1,
    backgroundColor: Colors.white[500], // Figma: #fafafa
  },

  // ============================================
  // Filter Container
  // ============================================
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg, // 24px
    paddingTop: Spacing.sm, // 8px
    paddingBottom: Spacing.sm, // 8px
  },
});

