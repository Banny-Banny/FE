/**
 * components/customer-service/components/inquiry-list/styles.ts
 * 문의 내역 리스트 스타일 정의
 *
 * 프로젝트 디자인 시스템에 맞춘 스타일
 * - my-egg-list의 item-list 스타일을 참고하여 일관성 유지
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.white[500], // 프로젝트 표준 배경색
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'stretch', // 전체 너비 사용
    gap: 20, // 아이템 간 더 넓은 간격 (프로젝트 표준)
    paddingHorizontal: Spacing.lg, // 24px 좌우 여백
    paddingVertical: Spacing.xl, // 32px (더 넓은 상하 여백)
  },
  headerWrapper: {
    marginBottom: 20, // 버튼과 리스트 간 간격
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['3xl'],
  },
  emptyText: {
    ...Typography.body.body1,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.darkGrey[600],
    textAlign: 'center',
    marginBottom: Spacing.xl, // 텍스트와 버튼 사이 간격
  },
  emptyButtonWrapper: {
    width: '100%',
    maxWidth: 300, // 버튼 최대 너비 제한
    marginTop: Spacing.lg,
  },
});
