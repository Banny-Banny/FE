/**
 * components/customer-service/styles.ts
 * 고객센터 기능 스타일 정의
 */

import { Colors, Spacing } from '@/commons/constants';
import { StyleSheet } from 'react-native';

/**
 * 기본 컨테이너 스타일
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[50],
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
});
