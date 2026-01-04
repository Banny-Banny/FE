/**
 * toss-payments/styles.ts
 * 메인 Container 스타일만 포함
 *
 * @version 2.0 - Figma Design 기반 UI 리디자인
 * @figma-node 429:320
 * @checklist
 * - [x] 색상 토큰 사용 (하드코딩 0건)
 * - [x] 인라인 스타일 0건
 * - [x] React Native StyleSheet 사용
 * - [x] Figma 디자인 정확히 반영
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // 컨테이너
  // ============================================
  container: {
    flex: 1,
    backgroundColor: Colors.white[500], // Figma: #fafafa
  },


  // ============================================
  // 스크롤 영역
  // ============================================
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
});
