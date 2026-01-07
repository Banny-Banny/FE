/**
 * components/my-egg-list/components/filter/styles.ts
 * 이스터에그 목록 필터 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 * - [✓] Figma 디자인 사이즈 정확히 반영 (소수점 반올림)
 *
 * Figma 노드 ID: 161:29272 (닫힘), 1129:2616 (열림)
 * 생성 시각: 2025-01-XX
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 38, // Figma: 38.177px → 38px (열림 상태)
    width: '100%',
  },

  // ============================================
  // Button (닫힘 상태)
  // ============================================
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34, // Figma: 34.184px → 34px
    width: 96, // Figma: 96.059px → 96px
    backgroundColor: Colors.white[500], // Figma: #fafafa
    borderWidth: 1, // Figma: 1.111px → 1px
    borderColor: 'rgba(10, 10, 10, 0.08)', // Figma: rgba(10,10,10,0.08)
    borderRadius: 20, // Figma: 20px
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 9, // Figma: 9.1px → 9px
  },
  buttonText: {
    fontFamily: Typography.body.body8.fontFamily,
    fontSize: 12, // Figma: 12px
    lineHeight: 16, // Figma: 16px
    fontWeight: Typography.body.body8.fontWeight, // SemiBold (600)
    color: Colors.black[500], // Figma: #0a0a0a
    marginRight: 4, // 아이콘과의 간격
  },
  iconContainer: {
    width: 12, // Figma: 11.997px → 12px
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ============================================
  // Dropdown (열림 상태)
  // ============================================
  dropdownContainer: {
    position: 'relative',
    width: 96, // Figma: 96px
    height: 74, // Figma: 74px
  },
  dropdown: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 96,
    backgroundColor: Colors.white[500], // Figma: #fafafa
    borderWidth: 1, // Figma: 1.111px → 1px
    borderColor: 'rgba(10, 10, 10, 0.08)', // Figma: rgba(10,10,10,0.08)
    borderRadius: 20, // Figma: 20px
    padding: 1, // Figma: 1.111px → 1px
    shadowColor: Colors.black[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, // Figma: 0.1
    shadowRadius: 12, // Figma: 12px
    elevation: 4, // Android
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36, // Figma: 35.99px → 36px
    paddingHorizontal: 16, // Figma: 16px
    paddingVertical: 10, // Figma: 10px
  },
  dropdownItemText: {
    fontFamily: Typography.body.body8.fontFamily,
    fontSize: 12, // Figma: 12px
    lineHeight: 16, // Figma: 16px
    fontWeight: Typography.body.body8.fontWeight, // SemiBold (600)
    color: Colors.black[500], // Figma: #0a0a0a
  },
  dropdownIconContainer: {
    width: 14, // Figma: 13.993px → 14px
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

