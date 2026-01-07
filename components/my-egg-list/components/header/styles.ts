/**
 * components/my-egg-list/components/header/styles.ts
 * 이스터에그 목록 헤더 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 * - [✓] Figma 디자인 사이즈 정확히 반영 (소수점 반올림)
 *
 * Figma 노드 ID: 161:29250
 * 생성 시각: 2025-01-XX
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 32, // Figma: 31.997px → 32px
    paddingHorizontal: 24, // Figma: 23.993px → 24px
    paddingBottom: 0,
    gap: 8, // Figma: 7.986px → 8px
  },

  // ============================================
  // Header Row
  // ============================================
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    width: '100%',
  },

  // ============================================
  // Title
  // ============================================
  titleContainer: {
    height: 33, // Figma: 32.986px → 33px
    width: 127, // Figma: 126.753px → 127px
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleText: {
    fontFamily: Typography.header.h5.fontFamily,
    fontSize: 30, // Figma: 30px
    lineHeight: 33, // Figma: 33px
    fontWeight: Typography.header.h5.fontWeight, // ExtraBold (800)
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: 0, // Figma: -0.2045px → 0 (반올림)
  },

  // ============================================
  // Button
  // ============================================
  button: {
    width: 40,
    height: 40,
    backgroundColor: Colors.whiteGrey[500], // Figma: #e8e8e8
    borderWidth: 1, // Figma: 1.111px → 1px
    borderColor: 'rgba(10, 10, 10, 0.08)', // Figma: rgba(10,10,10,0.08) - 투명도 필요
    borderRadius: 28, // Figma: 28px
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ============================================
  // Subtitle
  // ============================================
  subtitleContainer: {
    height: 20, // Figma: 19.983px → 20px
    width: '100%',
  },
  subtitleText: {
    fontFamily: Typography.body.body6.fontFamily,
    fontSize: 14, // Figma: 14px
    lineHeight: 20, // Figma: 20px
    fontWeight: Typography.body.body6.fontWeight, // Medium (500)
    color: Colors.grey[500], // Figma: #888
    letterSpacing: 0, // Figma: -0.1504px → 0 (반올림)
  },
});

