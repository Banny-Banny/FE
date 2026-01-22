/**
 * components/notice/components/notice-item/styles.ts
 * 공지사항 항목 컴포넌트 스타일 정의
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white[500],
    borderRadius: BorderRadius.xl,
    borderWidth: 0,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.lg + 4,
    paddingVertical: Spacing.lg,
    // 더 부드럽고 깊이감 있는 그림자
    shadowColor: Colors.black[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4, // Android
  },
  containerPinned: {
    backgroundColor: Colors.white[500],
    borderLeftWidth: 4,
    borderLeftColor: Colors.red[500],
    paddingLeft: Spacing.lg,
    shadowColor: Colors.red[500],
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  containerPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  textContainer: {
    flex: 1,
    gap: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  pinnedIconContainer: {
    backgroundColor: Colors.red[50],
    borderRadius: BorderRadius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  title: {
    ...Typography.body.body1,
    color: Colors.black[500],
    flex: 1,
    lineHeight: 26,
    letterSpacing: -0.3,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.whiteGrey[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  createdAt: {
    ...Typography.body.body7,
    color: Colors.darkGrey[600],
    fontSize: 12,
    fontWeight: '500',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.whiteGrey[200],
    marginTop: 2,
  },
});
