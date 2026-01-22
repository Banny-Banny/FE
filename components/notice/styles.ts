/**
 * 공지사항 Feature 스타일 정의
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
  },
  // 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
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
