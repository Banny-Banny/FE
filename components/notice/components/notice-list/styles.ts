/**
 * components/notice/components/notice-list/styles.ts
 * 공지사항 목록 컴포넌트 스타일 정의
 *
 * 프로젝트 디자인 시스템에 맞춘 스타일
 * - my-egg-list의 item-list 스타일을 참고하여 일관성 유지
 */

import { Colors, Spacing } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.whiteGrey[50],
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 20, // 아이템 간 더 넓은 간격
    paddingHorizontal: Spacing.lg, // 24px
    paddingVertical: Spacing.xl, // 32px
  },
});
