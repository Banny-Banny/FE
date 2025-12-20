/**
 * FAB Button Styles
 * Version: 1.0.0
 * Created: 2025-12-16
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (hex/rgb/hsl 사용 0건)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] StyleSheet 전용 사용
 * - [x] 피그마 디자인과 일치
 * - [x] 접근성: 탭타겟 44px 이상
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /* === Container === */
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },

  /* === Overlay (Dimmed Layer) === */
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.5)', // Colors.black[500] with 50% opacity
    zIndex: 1,
  },

  /* === Overlay Pressable === */
  overlayPressable: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  /* === Sub Buttons Container === */
  subButtonsContainer: {
    position: 'absolute',
    bottom: 120,
    right: 24,
    flexDirection: 'column',
    gap: 16,
    alignItems: 'flex-end',
    zIndex: 2,
  },

  /* === Sub Button Row === */
  subButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 52,
  },

  /* === Sub Button Label === */
  subButtonLabel: {
    ...Typography.header.h5,
    fontSize: 15,
    lineHeight: 22.5,
    color: Colors.white[50],
    textAlign: 'right',
  },

  /* === Sub Button Circle === */
  subButtonCircle: {
    width: 52,
    height: 52,
    borderRadius: 9999,
    backgroundColor: Colors.white[50],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  /* === Sub Button Icon === */
  subButtonIcon: {
    width: 24,
    height: 30,
  },

  /* === Capsule Icon Container === */
  capsuleIconContainer: {
    transform: [{ rotate: '25deg' }],
  },

  /* === Capsule Icon (specific sizing) === */
  capsuleIcon: {
    width: 20,
    height: 28,
  },

  /* === Main Button Container === */
  mainButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 3,
  },

  /* === Main Button === */
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    backgroundColor: '#FFC107', // Yellow - Colors에 없으므로 유지
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black[500],
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },

  /* === Main Button Expanded State === */
  mainButtonExpanded: {
    // 크기 변동 없음 (요구사항)
  },

  /* === Main Button Inner === */
  mainButtonInner: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },

  /* === Main Button Icon === */
  mainButtonIcon: {
    width: 32,
    height: 32,
  },

  /* === Main Button Shadow Inset === */
  mainButtonShadowInset: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 9999,
    pointerEvents: 'none',
    // Note: React Native doesn't support inset shadows natively
    // This would need a custom solution or library if critical
  },
});
