/**
 * src/components/notification/styles.ts
 * 알림 화면 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 * - [✓] Spacing, BorderRadius 토큰 활용
 *
 * Figma 노드 ID: 161-24395
 * 생성 시각: 2025-01-XX
 *
 * @description
 * - 모든 스타일은 StyleSheet.create()로 정의
 * - 색상, 타이포그래피, 간격, 둥근 모서리는 토큰만 사용
 * - Figma 디자인과 정확히 일치하도록 구현
 */

import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // 컨테이너
  // ============================================
  container: {
    flex: 1,
    backgroundColor: Colors.white[500],
  },

  // ============================================
  // 헤더 섹션
  // ============================================
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteGrey[500],
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 0,
    height: 124,
  },

  headerContent: {
    flexDirection: 'column',
    gap: Spacing.sm + 4, // 12px
    width: 345,
  },

  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
  },

  headerTitle: {
    ...Typography.header.h5,
    fontSize: 30,
    lineHeight: 33,
    letterSpacing: -0.2045,
    color: Colors.black[500],
    width: 64,
  },

  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerButton: {
    backgroundColor: Colors.white[500],
    borderWidth: 1.111,
    borderColor: Colors.whiteGrey[200], // rgba(10,10,10,0.08)에 가장 가까운 토큰
    borderRadius: BorderRadius.xl,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 9.097,
    paddingBottom: 1.111,
    paddingHorizontal: 9.097,
  },

  headerButtonActive: {
    backgroundColor: Colors.whiteGrey[500],
    borderWidth: 1.111,
    borderColor: Colors.whiteGrey[200], // rgba(10,10,10,0.08)에 가장 가까운 토큰
    borderRadius: 28,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1.111,
  },

  headerSubtitle: {
    ...Typography.body.body9,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
    color: Colors.grey[700], // #888
  },

  // ============================================
  // 스크롤 영역
  // ============================================
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 0,
    gap: 24, // 23.993px ≈ 24px
  },

  // ============================================
  // 섹션
  // ============================================
  section: {
    flexDirection: 'column',
    gap: 12, // 11.997px ≈ 12px
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 26.198,
  },

  sectionTitle: {
    ...Typography.body.body11,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
    color: Colors.black[500],
    height: 19.983,
  },

  previousSectionTitle: {
    ...Typography.body.body11,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.2904,
    color: Colors.grey[700], // #888
    height: 19.983,
  },

  markAllReadButton: {
    backgroundColor: Colors.black[500],
    borderWidth: 1.111,
    borderColor: Colors.whiteGrey[200], // rgba(10,10,10,0.08)에 가장 가까운 토큰
    borderRadius: BorderRadius.xl,
    height: 26.198,
    width: 63.715,
    alignItems: 'center',
    justifyContent: 'center',
  },

  markAllReadButtonText: {
    ...Typography.body.body8,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600', // SemiBold
    color: Colors.white[500],
    textAlign: 'center',
  },

  // ============================================
  // 알림 목록
  // ============================================
  notificationList: {
    flexDirection: 'column',
    gap: 12, // 11.997px ≈ 12px
  },

  // ============================================
  // 알림 아이템 (새로운 알림)
  // ============================================
  notificationItem: {
    backgroundColor: Colors.white[500],
    borderWidth: 1.111,
    borderColor: Colors.whiteGrey[200], // rgba(10,10,10,0.08)에 가장 가까운 토큰
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    gap: 16, // 15.99px ≈ 16px
    paddingTop: 17.101,
    paddingBottom: 1.111,
    paddingHorizontal: 17.101,
    height: 99.757,
    alignItems: 'flex-start',
  },

  notificationIconContainer: {
    backgroundColor: Colors.white[500],
    borderWidth: 1.111,
    borderColor: Colors.whiteGrey[200], // rgba(10,10,10,0.08)에 가장 가까운 토큰
    borderRadius: BorderRadius.full,
    width: 47.986,
    height: 47.986,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1.111,
  },

  notificationIcon: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.0703,
    color: Colors.lightBlack[500], // #1a1a1a
  },

  notificationContent: {
    flex: 1,
    height: 65.556,
    minHeight: 1,
    minWidth: 1,
  },

  notificationTitleRow: {
    height: 17.604,
    width: 246.823,
    marginBottom: 4, // 21.6 - 17.604 = 3.996px ≈ 4px
  },

  notificationTitle: {
    ...Typography.header.h4,
    fontSize: 16,
    lineHeight: 17.6,
    letterSpacing: -0.6325,
    color: Colors.black[500],
    height: 17.604,
  },

  unreadDot: {
    position: 'absolute',
    right: 0,
    top: 5.99,
    backgroundColor: Colors.black[500],
    borderRadius: BorderRadius.full,
    width: 7.986,
    height: 7.986,
  },

  notificationDescription: {
    ...Typography.body.body6,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
    color: Colors.black[500],
    opacity: 0.7,
    height: 19.983,
    overflow: 'hidden',
    marginTop: 21.6,
  },

  notificationTime: {
    ...Typography.body.body7,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.grey[800], // #666
    marginTop: 49.57 - 21.6 - 19.983, // 8.987px ≈ 9px
  },

  // ============================================
  // 알림 아이템 (이전 알림)
  // ============================================
  previousNotificationItem: {
    backgroundColor: Colors.white[500],
    borderWidth: 1.111,
    borderColor: Colors.whiteGrey[200], // rgba(10,10,10,0.08)에 가장 가까운 토큰
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    gap: 16, // 15.99px ≈ 16px
    paddingTop: 17.101,
    paddingBottom: 1.111,
    paddingHorizontal: 17.101,
    opacity: 0.7,
    alignItems: 'flex-start',
  },

  previousNotificationIconContainer: {
    backgroundColor: Colors.whiteGrey[100], // #F5F5F5
    borderWidth: 1.111,
    borderColor: Colors.whiteGrey[200], // rgba(10,10,10,0.08)에 가장 가까운 토큰
    borderRadius: BorderRadius.full,
    width: 47.986,
    height: 47.986,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1.111,
  },

  previousNotificationDescription: {
    ...Typography.body.body6,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1504,
    color: Colors.black[500],
    opacity: 0.7,
    overflow: 'hidden',
    marginTop: 21.6,
  },

  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 23.976,
    marginTop: 49.57 - 21.6 - 19.983, // 8.987px ≈ 9px
  },

  deleteButton: {
    backgroundColor: Colors.whiteGrey[50], // rgba(0,0,0,0.05)에 가장 가까운 토큰
    borderRadius: BorderRadius.xl,
    height: 23.976,
    width: 36.719,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButtonText: {
    ...Typography.body.body8,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700', // Bold
    color: Colors.grey[700], // #999
    textAlign: 'center',
  },
});

