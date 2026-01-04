/**
 * EggSlot Component Styles
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] 모든 스타일은 styles.ts에만 정의
 * - [x] 토큰 기반 스타일 사용
 */

import { Colors } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 48,
    right: 18,
    height: 44,
    backgroundColor: Colors.black[900], // #040404 (Figma #111827에 가장 가까운 토큰)
    borderWidth: 2,
    borderColor: Colors.black[900],
    borderRadius: 9999, // full
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 2,
    gap: 8,
    shadowColor: Colors.black[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0,
    shadowRadius: 6,
    elevation: 10, // Android shadow
  },
  eggSlotItem: {
    height: 24,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eggSlotIconWrapper: {
    width: 20,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eggSlotIcon: {
    width: 20,
    height: 24,
    tintColor: Colors.white[50], // 채워진 알은 하양색
  },
  eggSlotIconEmpty: {
    width: 20,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eggSlotIconOutline: {
    width: 20,
    height: 24,
    opacity: 1, // 빈 슬롯은 투명도 적용 (Figma 디자인 참고)
    tintColor: Colors.white[50], // 빈 슬롯도 흰색으로 표시
  },
});
