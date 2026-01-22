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
  },
  message: {
    ...Typography.body.body4,
    color: Colors.grey[500],
    textAlign: 'center',
  },
});
