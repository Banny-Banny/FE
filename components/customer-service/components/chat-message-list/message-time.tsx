/**
 * components/customer-service/components/chat-message-list/message-time.tsx
 * 메시지 시간 표시 컴포넌트
 */

import React from 'react';
import { Text, View } from 'react-native';
import { MessageTimeProps } from './types';
import { styles } from './styles';
import { Typography } from '@/commons/constants';

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
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (messageDate.getTime() === today.getTime()) {
      return timeStr; // 오늘: HH:mm
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return `어제 ${timeStr}`; // 어제: 어제 HH:mm
    } else {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}/${day} ${timeStr}`; // 그 외: MM/DD HH:mm
    }
  };

  return (
    <View style={styles.messageTimeContainer}>
      <Text style={styles.messageTimeText}>{formatTime(timestamp)}</Text>
    </View>
  );
}
