/**
 * components/payment-footer/styles.ts
 *
 * @version 2.0 - Figma Design 기반 UI 리디자인
 * @figma-node 515:607 (Button/L)
 * @checklist
 * - [x] 색상 토큰 사용 (하드코딩 0건)
 * - [x] 인라인 스타일 0건
 * - [x] React Native StyleSheet 사용
 * - [x] Figma 디자인 정확히 반영
 */

import { Colors, Spacing } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  footer: {
    width: '100%',
    backgroundColor: Colors.white[500], // Figma: #fafafa
  },
});

