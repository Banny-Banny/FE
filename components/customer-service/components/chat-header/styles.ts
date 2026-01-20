/**
 * components/customer-service/components/chat-header/styles.ts
 * 채팅 헤더 스타일 정의
 */

import { Colors, Typography, Spacing, BorderRadius } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Header Container
  // ============================================
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white[50],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },

  // ============================================
  // Back Button
  // ============================================
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing.sm,
  },

  // ============================================
  // Title Section
  // ============================================
  titleSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: Spacing.sm,
  },
  title: {
    ...Typography.header.h4,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.black[500],
  },
  subtitle: {
    ...Typography.body.body9,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.grey[600],
    marginTop: 2,
  },

});
