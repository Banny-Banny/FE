/**
 * components/mypage/components/header/styles.ts
 * 마이페이지 헤더 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 * - [✓] Figma 디자인 사이즈 정확히 반영
 *
 * Figma 노드 ID: 161:24062
 * 생성 시각: 2025-01-XX
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Layout
  // ============================================
  outerContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'visible', // absolute positioned border가 화면 밖으로 나갈 수 있도록
  },

  // ============================================
  // Header Container
  // ============================================
  container: {
    width: '100%',
    height: 73,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingBottom: 1,
  },

  // ============================================
  // Border
  // ============================================
  borderLine: {
    position: 'absolute',
    bottom: 0,
    left: -Spacing.lg, // 부모의 paddingHorizontal 상쇄
    right: -Spacing.lg, // 부모의 paddingHorizontal 상쇄
    height: 1,
    backgroundColor: Colors.whiteGrey[400],
  },

  // ============================================
  // Title
  // ============================================
  titleContainer: {
    height: 22,
    width: 85,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleText: {
    fontFamily: Typography.header.h1.fontFamily,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: Typography.header.h1.fontWeight, // ExtraBold (800)
    color: Colors.black[500],
    letterSpacing: -1, // -0.8492 반올림
  },

  // ============================================
  // Icons
  // ============================================
  iconContainer: {
    height: 32,
    width: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm, // 12px - marginRight 대신 gap 사용
  },
  notificationButton: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationOffIcon: {
    width: 24,
    height: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    left: 12,
    width: 16,
    height: 16,
    backgroundColor: Colors.red[500],
    borderRadius: BorderRadius.full, // 9999 → BorderRadius.full
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: Typography.body.body3.fontFamily,
    fontSize: 9,
    lineHeight: 14,
    fontWeight: Typography.body.body3.fontWeight, // Bold
    color: Colors.white[500],
    textAlign: 'center',
    letterSpacing: 0,
  },
  closeButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.whiteGrey[500],
    borderWidth: 1,
    borderColor: Colors.whiteGrey[400],
    borderRadius: BorderRadius.xl, // 20 → BorderRadius.xl
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  closeIconWrapper: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
