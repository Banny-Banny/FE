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
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    // 더 부드러운 그림자 효과
    shadowColor: Colors.black[500],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3, // Android
  },
  containerPinned: {
    borderColor: Colors.red[200],
    borderWidth: 1.5,
    backgroundColor: Colors.red[50],
    shadowColor: Colors.red[500],
    shadowOpacity: 0.12,
  },
  containerPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  textContainer: {
    flex: 1,
    gap: Spacing.xs + 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs + 2,
    marginBottom: 4,
  },
  pinnedIconContainer: {
    marginTop: 2,
    paddingTop: 2,
  },
  title: {
    ...Typography.body.body1,
    color: Colors.black[500],
    flex: 1,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  createdAt: {
    ...Typography.body.body7,
    color: Colors.grey[600],
    fontSize: 11,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: Spacing.xs,
  },
});
