/**
 * components/customer-service/components/message-time/index.tsx
 * 메시지 시간 표시 컴포넌트
 */

import React from 'react';
import { Text, View } from 'react-native';
import { formatMessageTime } from '../shared/message-utils';
import { styles } from './styles';
import { MessageTimeProps } from './types';

/**
 * 메시지 시간 표시 컴포넌트
 * 
 * @description
 * - 네이버 톡톡 스타일의 시간 표시
 * - 오늘: HH:mm 형식
 * - 어제: 어제 HH:mm
 * - 그 외: MM/DD HH:mm
 */
export function MessageTime({ timestamp }: MessageTimeProps) {
  return (
    <View style={styles.messageTimeContainer}>
      <Text style={styles.messageTimeText}>{formatMessageTime(timestamp)}</Text>
    </View>
  );
}
