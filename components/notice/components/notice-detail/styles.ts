/**
 * components/notice/components/notice-detail/styles.ts
 * 공지사항 상세 컴포넌트 스타일 정의
 *
 * 프로젝트 색상 토큰 사용
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  // ============================================
  // Header Section
  // ============================================
  headerSection: {
    marginBottom: Spacing.lg,
  },
  pinnedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.red[500],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.sm,
  },
  pinnedBadgeText: {
    ...Typography.body.body8,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: Colors.white[50],
  },
  title: {
    ...Typography.header.h2,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: Colors.black[500],
    marginBottom: Spacing.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    ...Typography.body.body7,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.grey[600],
  },
  updatedAtText: {
    ...Typography.body.body7,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.grey[500],
    marginLeft: Spacing.xs,
  },

  // ============================================
  // Image Section
  // ============================================
  imageSection: {
    marginBottom: Spacing.lg,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.whiteGrey[100],
  },

  // ============================================
  // Content Section
  // ============================================
  contentSection: {
    marginBottom: Spacing.lg,
  },
  content: {
    ...Typography.body.body4,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.black[500],
  },

  // ============================================
  // Loading State
  // ============================================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    ...Typography.body.body6,
    color: Colors.grey[600],
    marginTop: Spacing.md,
  },

  // ============================================
  // Error State
  // ============================================
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  errorText: {
    ...Typography.body.body6,
    color: Colors.red[500],
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.red[500],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    ...Typography.body.body8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white[50],
  },
});
