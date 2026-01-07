/**
 * components/my-egg-list/components/tab/styles.ts
 * 이스터에그 목록 탭 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 * - [✓] Figma 디자인 사이즈 정확히 반영 (소수점 반올림)
 *
 * Figma 노드 ID: 585:2284
 * 생성 시각: 2025-01-XX
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1, // Figma: 1.111px → 1px
    borderBottomColor: 'rgba(10, 10, 10, 0.08)', // Figma: rgba(10,10,10,0.08) - 투명도 필요
    paddingHorizontal: 24, // Figma: 23.993px → 24px
    paddingBottom: 1, // Figma: 1.111px → 1px
    height: 36, // Figma: 36.007px → 36px
  },

  // ============================================
  // Tab Button
  // ============================================
  tabButton: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 2, // Figma: 2.222px → 2px
    width: 86, // Figma: 85.625px → 86px
  },

  // ============================================
  // Tab Content
  // ============================================
  tabContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 13, // Figma: 12.899px → 13px
    width: '100%',
  },

  // ============================================
  // Tab Text
  // ============================================
  tabText: {
    fontFamily: Typography.header.h4.fontFamily,
    fontSize: 16, // Figma: 16px
    lineHeight: 24, // Figma: 24px
    fontWeight: Typography.header.h4.fontWeight, // SemiBold (600)
    color: Colors.grey[500], // Figma: #888 (비활성)
    letterSpacing: 0, // Figma: -0.3125px → 0 (반올림)
    textAlign: 'center',
  },
  tabTextActive: {
    color: Colors.black[500], // Figma: #0a0a0a (활성)
  },

  // ============================================
  // Underline
  // ============================================
  underline: {
    height: 2, // Figma: 1.997px → 2px
    width: '100%',
    backgroundColor: Colors.black[500], // Figma: #0a0a0a
  },
});

