/**
 * components/customer-service/components/connection-status/styles.ts
 * 연결 상태 컴포넌트 스타일 정의
 */

import { Colors, Typography, Spacing, BorderRadius } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.whiteGrey[100],
  },
  text: {
    ...Typography.body.body9,
    fontSize: 11,
    lineHeight: 14,
  },
});
