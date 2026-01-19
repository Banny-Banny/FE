/**
 * components/customer-service/components/file-preview/styles.ts
 * 파일 미리보기 컨테이너 스타일 정의
 */

import { Spacing } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
});
