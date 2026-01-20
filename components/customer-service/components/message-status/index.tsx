/**
 * components/customer-service/components/message-status/index.tsx
 * 메시지 전송 상태 표시 컴포넌트
 */

import { Colors } from '@/commons/constants';
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from './styles';
import { MessageStatusProps } from './types';

/**
 * 메시지 전송 상태 표시 컴포넌트
 * 
 * @description
 * - sending: 전송 중 (로딩 인디케이터)
 * - sent: 전송 완료 (체크 아이콘)
 * - failed: 전송 실패 (재시도 아이콘)
 */
export function MessageStatus({ status, isRead = false, onRetry }: MessageStatusProps) {
  if (status === 'sending') {
    return (
      <View style={styles.messageStatusContainer}>
        <Icon name="loader-4-line" size={12} color={Colors.grey[500]} />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.messageStatusContainer}>
        <Icon name="error-warning-line" size={12} color={Colors.red[500]} />
      </View>
    );
  }

  // sent 상태
  return (
    <View style={styles.messageStatusContainer}>
      <Icon
        name={isRead ? 'check-double-line' : 'check-line'}
        size={12}
        color={isRead ? Colors.blue[500] : Colors.grey[500]}
      />
    </View>
  );
}
