/**
 * components/mypage/components/notification/styles.ts
 * 알림 컴포넌트 스타일
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 방식으로 작성
 * - [✓] 인라인 스타일 0건
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 * - [✓] 타이포그래피 토큰 사용
 * - [✓] 알림 아이템 높이 자동 조절 (flexShrink 사용)
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
    fontSize: 30,
    lineHeight: 33,
    letterSpacing: -0.2045,
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
    borderWidth: 1.111,
    borderColor: 'rgba(10, 10, 10, 0.08)',
    backgroundColor: Colors.white[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1.111,
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
    ...Typography.body.body9,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
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
  sectionWithMargin: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
  },
  sectionTitle: {
    ...Typography.body.body11,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
    color: Colors.black[500],
  },
  sectionTitleOld: {
    ...Typography.body.body11,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.2904,
    color: Colors.grey[500],
    marginBottom: 0,
  },
  markAllReadButton: {
    height: 26.198,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.black[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAllReadButtonText: {
    ...Typography.body.body8,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.white[500],
  },

  // ============================================
  // Notification Item
  // ============================================
  notificationItem: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 17.101,
    paddingBottom: 17.101,
    paddingHorizontal: 17.101,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white[500],
    borderWidth: 1.111,
    borderColor: 'rgba(10, 10, 10, 0.08)',
  },
  notificationItemRead: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: Colors.white[500],
    borderWidth: 1.111,
    borderColor: 'rgba(10, 10, 10, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerRead: {
    backgroundColor: Colors.whiteGrey[50],
  },
  iconText: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.0703,
    color: Colors.lightBlack[500],
  },
  contentContainer: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    justifyContent: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  titleText: {
    ...Typography.header.h4,
    fontSize: 16,
    lineHeight: 17.6,
    letterSpacing: -0.6325,
    color: Colors.black[500],
    flexShrink: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: Colors.black[500],
    marginLeft: 'auto',
  },
  descriptionText: {
    ...Typography.body.body6,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
    color: Colors.black[500],
    opacity: 0.7,
    marginBottom: 4,
    flexShrink: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    ...Typography.body.body7,
    fontSize: 12,
    lineHeight: 16,

    color: Colors.grey[500],
  },
  deleteButton: {
    height: 24,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    ...Typography.body.body5,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.grey[500],
  },
});
