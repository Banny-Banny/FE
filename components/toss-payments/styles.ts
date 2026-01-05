/**
 * toss-payments/styles.ts
 * 메인 Container 스타일만 포함
 *
 * @version 2.0 - Figma Design 기반 UI 리디자인
 * @figma-node 429:320
 * @checklist
 * - [x] 색상 토큰 사용 (하드코딩 0건)
 * - [x] 인라인 스타일 0건
 * - [x] React Native StyleSheet 사용
 * - [x] Figma 디자인 정확히 반영
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // 컨테이너
  // ============================================
  container: {
    flex: 1,
    backgroundColor: Colors.white[500], // Figma: #fafafa
  },

  // ============================================
  // 헤더
  // ============================================
  header: {
    width: '100%',
    height: 84,
  },

  headerContainer: {
    position: 'relative',
    width: '100%',
    height: 84,
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  headerBorder: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 73,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
    pointerEvents: 'none',
  },

  backButton: {
    position: 'absolute',
    left: 24,
    top: 14,
    width: 44,
    height: 44,
    backgroundColor: Colors.white[50],
    borderWidth: 2,
    borderColor: Colors.black[500],
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  backButtonText: {
    ...Typography.body.body4,
    fontSize: 24,
    color: Colors.black[500],
    includeFontPadding: false,
  },

  headerTitle: {
    position: 'absolute',
    left: 80,
    top: 23,
    ...Typography.header.h1,
    fontSize: 24,
    lineHeight: 26.4,
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
  },

  // ============================================
  // 스크롤 영역
  // ============================================
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
});
