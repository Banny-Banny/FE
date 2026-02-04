/**
 * ResetEggSlot Component Styles
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
    left: 18,
    zIndex: 10, // 지도 위에 표시
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 9999, // 완전한 원형
    backgroundColor: Colors.grey[50], // #F7F7F7
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(4, 4, 4, 1)',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6, // Android shadow
  },
});
