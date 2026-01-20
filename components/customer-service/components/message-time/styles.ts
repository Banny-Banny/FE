/**
 * components/customer-service/components/message-time/styles.ts
 * 메시지 시간 컴포넌트 스타일 정의
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  messageTimeContainer: {
    // 시간 컨테이너는 추가 스타일 불필요
  },
  messageTimeText: {
    ...Typography.body.body9,
    fontSize: 11,
    lineHeight: 14,
    color: Colors.grey[600],
  },
});
