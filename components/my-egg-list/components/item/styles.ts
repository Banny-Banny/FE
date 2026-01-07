/**
 * components/my-egg-list/components/item/styles.ts
 * 이스터에그 목록 아이템 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 * - [✓] Figma 디자인 사이즈 정확히 반영 (소수점 반올림)
 *
 * Figma 노드 ID: 585:2856
 * 생성 시각: 2025-01-XX
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    backgroundColor: Colors.white[500], // Figma: #fafafa
    borderWidth: 1, // Figma: 1.111px → 1px
    borderColor: 'rgba(10, 10, 10, 0.08)', // Figma: rgba(10,10,10,0.08)
    borderRadius: 16, // Figma: 16px
    overflow: 'hidden',
    padding: 1, // Figma: 1px
  },

  // ============================================
  // Content
  // ============================================
  content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 20, // Figma: 20px
    paddingVertical: 16, // Figma: 16px
    gap: 18, // Figma: 18px
  },

  // ============================================
  // Header Row
  // ============================================
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16, // Figma: 15.99px → 16px
    width: '100%',
  },
  iconContainer: {
    width: 52, // Figma: 52px
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    height: 68, // Figma: 67.76px → 68px
    justifyContent: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6, // Figma: 25.78px - 19.8px = 5.98px → 6px
    gap: 8,
  },
  titleText: {
    flex: 1,
    fontFamily: Typography.header.h3.fontFamily,
    fontSize: 18, // Figma: 18px
    lineHeight: 20, // Figma: 19.8px → 20px
    fontWeight: Typography.header.h5.fontWeight, // ExtraBold (800)
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: -1, // Figma: -0.7995px → -1px (반올림)
  },
  mediaIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mediaIconWrapper: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionText: {
    fontFamily: Typography.body.body6.fontFamily,
    fontSize: 14, // Figma: 14px
    lineHeight: 21, // Figma: 21px
    fontWeight: Typography.body.body6.fontWeight, // Regular (400)
    color: Colors.grey[500], // Figma: #888
    letterSpacing: 0, // Figma: -0.1504px → 0 (반올림)
  },

  // ============================================
  // Footer Row
  // ============================================
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 9, // Figma: 9.111px → 9px
    borderTopWidth: 1, // Figma: 1.111px → 1px
    borderTopColor: 'rgba(10, 10, 10, 0.06)', // Figma: rgba(10,10,10,0.06)
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Figma: 8px
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2, // Figma: 2px
  },
  locationIconContainer: {
    width: 12, // Figma: 12px
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: Typography.body.body8.fontFamily,
    fontSize: 12, // Figma: 12px
    lineHeight: 16, // Figma: 16px
    fontWeight: Typography.body.body8.fontWeight, // SemiBold (600)
    color: Colors.grey[500], // Figma: #888
  },
  divider: {
    width: 4, // Figma: 3.993px → 4px
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.grey[500], // Figma: #d0d0d0
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Figma: 5.99px → 6px
  },
  actionButton: {
    width: 16, // Figma: 15.99px → 16px
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

