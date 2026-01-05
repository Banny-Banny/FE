/**
 * components/payment-method-selector/styles.ts
 * 결제 수단 선택 컴포넌트 스타일
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
  container: {
    width: '100%',
  },

  title: {
    ...Typography.body.body1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: Colors.black[500],
    letterSpacing: -0.3125,
    marginBottom: 12,
  },

  methodList: {
    gap: 12,
  },

  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white[500], // Figma: #fafafa
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.grey[200], // Figma: #e0e0e0
    minHeight: 64,
  },

  methodItemSelected: {
    borderColor: Colors.blue[500],
    borderWidth: 2,
    backgroundColor: Colors.blue[50],
  },

  methodContent: {
    flex: 1,
    gap: 4,
  },

  methodLabel: {
    ...Typography.body.body1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: Colors.black[500], // Figma: #0a0a0a
    letterSpacing: -0.3125,
  },

  methodLabelSelected: {
    color: Colors.blue[500],
  },

  methodDescription: {
    ...Typography.body.body6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: Colors.grey[500],
    letterSpacing: -0.1504,
  },

  methodDescriptionSelected: {
    color: Colors.blue[600],
  },

  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkmarkText: {
    ...Typography.body.body1,
    color: Colors.white[50],
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '700',
    includeFontPadding: false,
  },
});

