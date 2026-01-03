/**
 * components/mypage/components/notification/styles.ts
 * notification 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: 'auto',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.body.body4,
    color: Colors.black[500],
  },
});

