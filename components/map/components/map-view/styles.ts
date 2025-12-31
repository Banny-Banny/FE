/**
 * MapView Component Styles
 * Version: 1.0.0
 * Updated: 2025-01-XX
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
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.whiteGrey[50],
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.red[500],
  },
  currentLocationWrapper: {
    position: 'absolute',
    left: 140, // Figma 디자인 기준
    top: 56, // Figma 디자인 기준
    zIndex: 10, // 지도 위에 표시
  },
  webMapViewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
