/**
 * components/notice/components/notice-list/styles.ts
 * 공지사항 목록 컴포넌트 스타일 정의
 */

import { Colors, Spacing } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteGrey[50],
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: Spacing.md,
  },
});
