/**
 * components/notice/components/notice-list/styles.ts
 * 공지사항 목록 컴포넌트 스타일 정의
 *
 * 일반적인 공지사항 리스트 디자인 패턴 적용
 */

import { Colors } from '@/commons/constants';
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
    // 리스트 아이템은 각자 borderBottom을 가지고 있어서 gap 불필요
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
