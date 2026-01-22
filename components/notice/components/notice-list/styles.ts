/**
 * components/notice/components/notice-list/styles.ts
 * 공지사항 목록 컴포넌트 스타일 정의
 *
 * 프로젝트 디자인 시스템에 맞춘 스타일
 * - 미니멀하고 깔끔한 디자인
 */

import { Colors, Spacing } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.white[500],
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.sm, // 아이템 간 간격
    paddingHorizontal: Spacing.lg, // 24px
    paddingVertical: Spacing.md, // 16px
  },
});
