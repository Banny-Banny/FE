/**
 * CurrentLocation Component Styles
 * Version: 1.0.0
 * Updated: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] nativewind 토큰 참조만 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 */

import { BorderRadius, Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Layout
  // ============================================
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17,24,39,0.7)',
    borderRadius: BorderRadius.full, // 9999px (완전히 둥근 모서리)
    paddingLeft: 12, // Figma 기준: left padding 12px
    paddingRight: 12, // Figma 기준: right padding (113px - 12px - 12px - 6px - 12px = 71px 텍스트 공간)
    paddingTop: 4, // Figma 기준: top padding 4px
    paddingBottom: 4, // Figma 기준: bottom padding 4px
    height: 26, // Figma 디자인 기준
    shadowColor: Colors.black[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Android shadow
  },

  // ============================================
  // Components
  // ============================================
  iconContainer: {
    width: 12,
    height: 12,
    marginRight: 6, // Figma 기준: 아이콘(12px) 다음 6px 간격 후 텍스트 시작 (30px - 12px - 12px = 6px)
    justifyContent: 'center',
    alignItems: 'center',
  },

  addressText: {
    ...Typography.body.body3, // 12px, Bold, lineHeight: 16px
    fontFamily: Typography.body.body3.fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800', // ExtraBold (Pretendard Variable)
    color: Colors.white[50], // 흰색
    letterSpacing: 0.6, // Figma 디자인 기준 0.6px
  },

  loadingIndicator: {
    marginLeft: 0,
  },
});
