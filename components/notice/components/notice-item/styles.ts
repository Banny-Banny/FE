/**
 * components/notice/components/notice-item/styles.ts
 * 공지사항 항목 컴포넌트 스타일 정의
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white[500],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    // 그림자 효과
    shadowColor: Colors.black[500],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // Android
  },
  containerPinned: {
    borderColor: Colors.red[200],
    borderWidth: 1.5,
    backgroundColor: Colors.red[50],
  },
  content: {
    flexDirection: 'column',
    gap: Spacing.xs,
  },
  textContainer: {
    flex: 1,
    gap: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.body.body1,
    color: Colors.black[500],
    flex: 1,
    lineHeight: 22,
  },
  pinnedIndicator: {
    ...Typography.body.body8,
    color: Colors.red[600],
    backgroundColor: Colors.red[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    fontWeight: '600',
  },
  createdAt: {
    ...Typography.body.body7,
    color: Colors.grey[600],
    marginTop: 2,
  },
});
