/**
 * components/notice/components/notice-item/styles.ts
 * 공지사항 항목 컴포넌트 스타일 정의
 *
 * 일반적인 공지사항 리스트 디자인 패턴 적용
 * - 프로젝트 색상 토큰 사용
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    width: '100%',
    backgroundColor: Colors.white[500],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lighter,
  },
  containerPinned: {
    backgroundColor: Colors.white[500],
  },
  containerPressed: {
    backgroundColor: Colors.whiteGrey[50],
  },

  // ============================================
  // Content
  // ============================================
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },

  // ============================================
  // Left: Badge (고정 공지사항)
  // ============================================
  badgeContainer: {
    marginTop: 2,
    flexShrink: 0,
  },
  pinnedBadge: {
    backgroundColor: Colors.red[500],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  pinnedBadgeText: {
    ...Typography.body.body8,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: Colors.white[50],
  },

  // ============================================
  // Center: Text Content
  // ============================================
  textContainer: {
    flex: 1,
    gap: Spacing.xs,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  title: {
    flex: 1,
    ...Typography.body.body1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: Colors.black[500],
    letterSpacing: -0.2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  createdAt: {
    ...Typography.body.body7,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.grey[600],
  },

  // ============================================
  // Right: Arrow
  // ============================================
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
});
