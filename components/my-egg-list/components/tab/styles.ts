/**
 * components/my-egg-list/components/tab/styles.ts
 * 이스터에그 목록 탭 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] Typography 토큰 활용
 * - [✓] 페이지와 조화로운 세련된 탭 UI 디자인
 *
 * 생성 시각: 2025-01-XX
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white[500], // 페이지 배경색과 동일하게
    minHeight: 48,
  },

  // ============================================
  // Tab Button
  // ============================================
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.md, // 탭들 사이 간격 더 줄임 (24px → 16px)
    position: 'relative',
    minHeight: 48,
  },

  // ============================================
  // Tab Text
  // ============================================
  tabText: {
    fontFamily: Typography.header.h4.fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: Typography.header.h4.fontWeight, // SemiBold (600)
    color: Colors.grey[500], // 비활성 색상
    letterSpacing: -0.3125,
  },
  tabTextActive: {
    color: Colors.black[500], // 활성 색상
    fontWeight: Typography.header.h4.fontWeight, // SemiBold (600)
  },

  // ============================================
  // Underline
  // ============================================
  underline: {
    position: 'absolute',
    bottom: -1, // border와 겹치도록
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: Colors.black[500],
    borderTopLeftRadius: 1.5,
    borderTopRightRadius: 1.5,
  },
});

