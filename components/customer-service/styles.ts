/**
 * components/customer-service/styles.ts
 * 고객센터 기능 스타일 정의
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

/**
 * 기본 컨테이너 스타일
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  // 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    height: 90, // 고정 높이: paddingTop(24) + title(33) + marginBottom(4) + subtitle(20) + paddingBottom(8) = 89px → 90px
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: Typography.header.h5.fontFamily,
    fontSize: 30,
    lineHeight: 33,
    fontWeight: Typography.header.h5.fontWeight,
    color: Colors.black[500],
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body.body6,
    color: Colors.grey[700],
  },
  headerCloseButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
});
