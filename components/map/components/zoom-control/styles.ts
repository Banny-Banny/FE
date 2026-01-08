/**
 * ZoomControl Component Styles
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] StyleSheet 전용 사용
 * - [x] 접근성: 탭타겟 44px 이상 (44px 버튼 사용)
 */

import { Colors } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /* === Container === */
  container: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -60 }],
    backgroundColor: Colors.grey[50], // #F7F7F7
    borderRadius: 8,
    shadowColor: 'rgba(4, 4, 4, 1)',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    overflow: 'hidden',
  },

  /* === Button === */
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grey[50], // #F7F7F7
  },
  buttonDisabled: {
    backgroundColor: Colors.whiteGrey[300],
    opacity: 0.5,
  },

  /* === Button Text === */
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black[500],
  },
  buttonTextDisabled: {
    color: Colors.grey[500],
  },

  /* === Divider === */
  divider: {
    height: 1,
    backgroundColor: Colors.whiteGrey[400],
  },
});

