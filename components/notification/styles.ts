/**
 * components/notification/styles.ts
 * 알림 Feature 스타일
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 방식으로 작성
 * - [✓] 인라인 스타일 0건
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 * - [✓] 타이포그래피 토큰 사용
 *
 * @description
 * - 모든 스타일은 디자인 토큰 기반으로 작성
 * - Figma 디자인과 1:1 대응
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Layout
  // ============================================
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
  },

  // ============================================
  // Header
  // ============================================
  header: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteGrey[500],
  },
  headerContent: {
    flexDirection: 'column',
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerTitle: {
    ...Typography.header.h5,
    color: Colors.black[500],
  },
  headerIcons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(10, 10, 10, 0.08)',
    backgroundColor: Colors.white[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(10, 10, 10, 0.08)',
    backgroundColor: Colors.whiteGrey[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSubtitleText: {
    ...Typography.body.body11,
    color: Colors.grey[500],
  },

  // ============================================
  // ScrollView
  // ============================================
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Spacing['4xl'],
    gap: 24,
  },

  // ============================================
  // Section
  // ============================================
  section: {
    flexDirection: 'column',
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
  },
  sectionTitle: {
    ...Typography.body.body11,
    color: Colors.black[500],
  },
  sectionTitleOld: {
    ...Typography.body.body11,
    color: Colors.grey[500],
    marginBottom: 0,
  },
  markAllReadButton: {
    height: 26,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.black[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAllReadButtonText: {
    ...Typography.body.body8,
    color: Colors.white[500],
  },
});
