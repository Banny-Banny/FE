/**
 * components/customer-service/components/inquiry-item/index.tsx
 * 문의 내역 개별 항목 컴포넌트
 */

import dayjs from 'dayjs';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';
import { InquiryItemProps } from './types';

export function InquiryItem({ inquiry, onPress }: InquiryItemProps) {
  const handlePress = () => {
    onPress?.(inquiry);
  };

  const getStatusBadgeStyle = () => {
    switch (inquiry.status) {
      case 'PENDING':
        return [styles.statusBadge, styles.statusPending];
      case 'IN_PROGRESS':
        return [styles.statusBadge, styles.statusInProgress];
      case 'RESOLVED':
        return [styles.statusBadge, styles.statusResolved];
      case 'CLOSED':
        return [styles.statusBadge, styles.statusClosed];
      default:
        return styles.statusBadge;
    }
  };

  const getStatusTextStyle = () => {
    switch (inquiry.status) {
      case 'PENDING':
        return [styles.statusText, styles.statusPendingText];
      case 'IN_PROGRESS':
        return [styles.statusText, styles.statusInProgressText];
      case 'RESOLVED':
        return [styles.statusText, styles.statusResolvedText];
      case 'CLOSED':
        return [styles.statusText, styles.statusClosedText];
      default:
        return styles.statusText;
    }
  };

  const getStatusLabel = () => {
    switch (inquiry.status) {
      case 'PENDING':
        return '대기중';
      case 'IN_PROGRESS':
        return '진행중';
      case 'RESOLVED':
        return '완료';
      case 'CLOSED':
        return '종료';
      default:
        return inquiry.status;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = dayjs(dateString);
    const now = dayjs();
    const diffDays = now.diff(date, 'day');

    if (diffDays === 0) {
      return date.format('HH:mm');
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.format('MM/DD');
    }
  };

  // 읽지 않은 메시지 개수 (useMockInquiries에서 계산된 값 사용)
  const unreadCount = (inquiry as any).unreadCount || 0;
  const isClosed = inquiry.status === 'CLOSED';

  return (
    <Pressable style={[styles.container, isClosed && styles.containerClosed]} onPress={handlePress} accessibilityRole="button">
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {inquiry.title}
            </Text>
            <View style={getStatusBadgeStyle()}>
              <Text style={getStatusTextStyle()}>{getStatusLabel()}</Text>
            </View>
          </View>
        </View>
        {inquiry.last_message_preview && (
          <Text style={styles.preview} numberOfLines={1}>
            {inquiry.last_message_preview}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.time}>
            {inquiry.last_message_at ? formatTime(inquiry.last_message_at) : formatTime(inquiry.created_at)}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
