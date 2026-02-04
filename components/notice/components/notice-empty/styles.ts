/**
 * components/notice/components/notice-empty/styles.ts
 * 공지사항 빈 상태 컴포넌트 스타일 정의
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing.lg,
    minHeight: 300,
    gap: Spacing.md,
  },
  iconContainer: {
    marginBottom: Spacing.xs,
    opacity: 0.6,
  },
  message: {
    ...Typography.body.body4,
    color: Colors.grey[600],
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: -0.2,
  },
});
