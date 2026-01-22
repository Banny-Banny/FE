/**
 * components/notice/components/notice-search/styles.ts
 * 공지사항 검색 컴포넌트 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용
 * - [✓] 인라인 스타일 0건
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    width: '100%',
    height: 72, // 고정 높이: paddingVertical(16*2) + inputContainer(40) = 72px
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white[500],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lighter,
    justifyContent: 'center',
  },

  // ============================================
  // Input Container
  // ============================================
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40, // 고정 높이: 아이콘(20) + 패딩 고려
    backgroundColor: Colors.whiteGrey[100],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 20, // 고정 높이: lineHeight와 동일
    ...Typography.body.body4,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.black[500],
    padding: 0,
    textAlignVertical: 'center',
  },
  inputPlaceholder: {
    color: Colors.grey[500],
  },

  // ============================================
  // Clear Button
  // ============================================
  clearButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonHidden: {
    display: 'none',
  },
});
