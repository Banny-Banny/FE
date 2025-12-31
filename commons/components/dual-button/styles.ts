/**
 * commons/components/dual-button/styles.ts
 * DualButton 컴포넌트 스타일
 */

import { StyleSheet } from 'react-native';

/**
 * DualButton 간격 (px)
 */
export const DUAL_BUTTON_GAP = 12;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: DUAL_BUTTON_GAP,
  },
  button: {
    flex: 1,
  },
});


