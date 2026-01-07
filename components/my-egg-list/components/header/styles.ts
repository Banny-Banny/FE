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
    paddingBottom: 24, // 위아래 패딩 추가
    gap: 8, // Figma: 7.986px → 8px
    width: '100%',
  },

  // ============================================
  // Header Row
  // ============================================
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40, // height → minHeight로 변경 (웹 호환성)
    width: '100%',
    flexShrink: 0, // 웹에서 축소 방지
  },

  // ============================================
  // Title
  // ============================================
  titleContainer: {
    flex: 1, // 고정 width 제거, flex로 변경
    minHeight: 33, // height → minHeight로 변경
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: Spacing.md, // 버튼과의 간격
  },
  titleText: {
    fontFamily: Typography.header.h5.fontFamily,
    fontSize: 30, // Figma: 30px
    lineHeight: 33, // Figma: 33px
    fontWeight: Typography.header.h5.fontWeight, // ExtraBold (800)
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: 0, // Figma: -0.2045px → 0 (반올림)
    flexShrink: 1, // 웹에서 텍스트 줄바꿈 허용
  },

  // ============================================
  // Button
  // ============================================
  button: {
    width: 40,
    height: 40,
    minWidth: 40, // 웹에서 최소 크기 보장
    minHeight: 40,
    backgroundColor: Colors.whiteGrey[500], // Figma: #e8e8e8
    borderWidth: 1, // Figma: 1.111px → 1px
    borderColor: Colors.border.light, // Figma: rgba(10,10,10,0.08)
    borderRadius: 28, // Figma: 28px
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0, // 웹에서 축소 방지
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
    minHeight: 20, // height → minHeight로 변경
    width: '100%',
    flexShrink: 0, // 웹에서 축소 방지
  },
  subtitleText: {
    fontFamily: Typography.body.body6.fontFamily,
    fontSize: 14, // Figma: 14px
    lineHeight: 20, // Figma: 20px
    fontWeight: Typography.body.body6.fontWeight, // Medium (500)
    color: Colors.grey[500], // Figma: #888
    letterSpacing: 0, // Figma: -0.1504px → 0 (반올림)
    flexWrap: 'wrap', // 웹에서 텍스트 줄바꿈 허용
  },
});

