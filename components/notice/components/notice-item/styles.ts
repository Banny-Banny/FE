/**
 * components/notice/components/notice-item/styles.ts
 * 공지사항 항목 컴포넌트 스타일 정의
 *
 * 프로젝트 디자인 시스템에 맞춘 스타일
 * - my-egg-list의 item 스타일을 참고하여 일관성 유지
 * - customer-service의 inquiry-item 스타일 참고
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
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 18, // 프로젝트 표준
    overflow: 'hidden',
  },
  containerPinned: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.red[500],
    backgroundColor: Colors.red[50],
  },
  containerPressed: {
    opacity: 0.9,
  },

  // ============================================
  // Content
  // ============================================
  content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 20, // 프로젝트 표준
    paddingVertical: 16, // 프로젝트 표준
    gap: 16, // 프로젝트 표준
  },

  // ============================================
  // Header Row
  // ============================================
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    minWidth: 0,
  },
  pinnedIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  title: {
    flex: 1,
    fontFamily: Typography.header.h3.fontFamily,
    fontSize: 18, // 프로젝트 표준
    lineHeight: 22, // 프로젝트 표준
    fontWeight: Typography.header.h5.fontWeight, // ExtraBold (800)
    color: Colors.black[500],
    letterSpacing: -0.5, // 자연스러운 간격
  },

  // ============================================
  // Footer Row
  // ============================================
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border.lighter,
  },
  metaContainer: {
    flex: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 0,
  },
  createdAt: {
    fontFamily: Typography.body.body8.fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: Typography.body.body8.fontWeight, // SemiBold (600)
    color: Colors.darkGrey[600],
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
});
