/**
 * components/customer-service/components/inquiry-item/styles.ts
 * 문의 항목 스타일 정의
 *
 * 프로젝트 디자인 시스템에 맞춘 스타일
 * - my-egg-list의 item 스타일을 참고하여 일관성 유지
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    width: '100%',
    backgroundColor: Colors.white[500], // #fafafa
    borderWidth: 1,
    borderColor: Colors.border.light, // rgba(10,10,10,0.08)
    borderRadius: 18, // 프로젝트 표준
    overflow: 'hidden',
  },
  containerClosed: {
    backgroundColor: Colors.whiteGrey[100], // 종료된 문의는 회색 배경
    borderColor: Colors.border.lighter, // 더 연한 테두리
    opacity: 0.6, // 약간 투명하게
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  title: {
    flex: 1,
    fontFamily: Typography.header.h3.fontFamily,
    fontSize: 18, // 프로젝트 표준
    lineHeight: 22, // 프로젝트 표준
    fontWeight: Typography.header.h5.fontWeight, // ExtraBold (800)
    color: Colors.black[500], // #0a0a0a
    letterSpacing: -0.5, // 자연스러운 간격
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.grey[100],
  },
  statusText: {
    fontFamily: Typography.body.body8.fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: Typography.body.body8.fontWeight, // SemiBold (600)
    color: Colors.black[500],
  },
  statusPending: {
    backgroundColor: Colors.blue[50],
  },
  statusPendingText: {
    color: Colors.blue[700],
  },
  statusInProgress: {
    backgroundColor: Colors.yellow[50],
  },
  statusInProgressText: {
    color: Colors.yellow[800],
  },
  statusResolved: {
    backgroundColor: Colors.green[50],
  },
  statusResolvedText: {
    color: Colors.green[700],
  },
  statusClosed: {
    backgroundColor: Colors.grey[100],
  },
  statusClosedText: {
    color: Colors.grey[700],
  },

  // ============================================
  // Preview Text
  // ============================================
  preview: {
    fontFamily: Typography.body.body6.fontFamily,
    fontSize: 14, // 프로젝트 표준
    lineHeight: 20, // 프로젝트 표준
    fontWeight: Typography.body.body6.fontWeight, // Regular (400)
    color: Colors.darkGrey[600], // 더 진한 회색으로 가독성 향상
    letterSpacing: -0.2, // 자연스러운 간격
  },

  // ============================================
  // Footer Row
  // ============================================
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 10, // 적절한 여백
    borderTopWidth: 1,
    borderTopColor: Colors.border.lighter, // rgba(10,10,10,0.06)
  },
  time: {
    fontFamily: Typography.body.body8.fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: Typography.body.body8.fontWeight, // SemiBold (600)
    color: Colors.darkGrey[600], // #606060
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.red[500], // 로그아웃 버튼과 같은 빨간색
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontFamily: Typography.body.body8.fontFamily,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: Typography.body.body8.fontWeight, // SemiBold (600)
    color: Colors.white[50],
  },
});
