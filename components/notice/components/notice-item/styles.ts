/**
 * components/notice/components/notice-item/styles.ts
 * 공지사항 항목 컴포넌트 스타일 정의
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  textContainer: {
    flex: 1,
    gap: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  title: {
    ...Typography.body.body1,
    color: Colors.black[500],
    flex: 1,
  },
  pinnedIndicator: {
    ...Typography.body.body3,
    color: Colors.red[500],
    backgroundColor: Colors.red[50],
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  createdAt: {
    ...Typography.body.body7,
    color: Colors.grey[500],
  },
});
