/**
 * components/notice/components/notice-item/styles.ts
 * 공지사항 항목 컴포넌트 스타일 정의
 *
 * 프로젝트 디자인 시스템에 맞춘 스타일
 * - 미니멀하고 깔끔한 디자인
 * - 최신 모바일 UI 트렌드 반영
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
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 4,
    // 미묘한 그림자
    shadowColor: Colors.black[500],
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  containerPinned: {
    backgroundColor: Colors.white[500],
    borderLeftWidth: 3,
    borderLeftColor: Colors.red[500],
    paddingLeft: Spacing.lg - 3,
  },
  containerPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.998 }],
  },

  // ============================================
  // Content
  // ============================================
  content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },

  // ============================================
  // Header Row
  // ============================================
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    gap: Spacing.sm,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs + 2,
    minWidth: 0,
  },
  pinnedIconContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  title: {
    flex: 1,
    ...Typography.body.body1,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: Colors.black[500],
    letterSpacing: -0.3,
  },

  // ============================================
  // Footer Row
  // ============================================
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 2,
  },
  metaContainer: {
    flex: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    minWidth: 0,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minWidth: 0,
  },
  createdAt: {
    ...Typography.body.body7,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: Colors.grey[600],
  },
  arrowContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: Spacing.xs,
  },
});
