/**
 * components/shared/styles.ts
 * 토스페이먼츠 컴포넌트 공통 스타일
 */

import { Colors } from '@/commons/constants';
import { StyleSheet } from 'react-native';

/**
 * 공통 카드 테두리 스타일
 * order-summary-card와 agreements-card에서 공통으로 사용
 */
export const sharedStyles = StyleSheet.create({
  cardBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: Colors.grey[200],
    borderRadius: 20,
  },
});

