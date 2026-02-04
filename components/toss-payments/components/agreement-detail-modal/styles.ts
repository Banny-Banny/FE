/**
 * components/agreement-detail-modal/styles.ts
 *
 * @version 2.0 - Figma Design 기반 UI 리디자인
 * @checklist
 * - [x] 색상 토큰 사용 (하드코딩 0건)
 * - [x] 인라인 스타일 0건
 * - [x] React Native StyleSheet 사용
 * - [x] Figma 디자인 일관성 유지
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.black[500] + '80', // rgba(10, 10, 10, 0.5)
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '85%',
    maxWidth: 400,
    maxHeight: '70%',
    backgroundColor: Colors.white[50],
    borderRadius: 20,
    overflow: 'hidden',
  },

  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200], // Figma: #e0e0e0
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 64,
  },

  modalTitle: {
    ...Typography.caption.button,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: -0.3125,
    flex: 1,
  },

  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  modalCloseText: {
    ...Typography.header.h1,
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '300',
    color: Colors.grey[500],
    includeFontPadding: false,
  },

  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  modalSection: {
    marginBottom: 20,
  },

  modalSectionTitle: {
    ...Typography.body.body1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: -0.3125,
    marginBottom: 8,
  },

  modalText: {
    ...Typography.body.body6,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
    color: Colors.darkGrey[800],
    letterSpacing: -0.1504,
  },
});

