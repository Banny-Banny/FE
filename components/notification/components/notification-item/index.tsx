/**
 * components/notification/components/notification-item/index.tsx
 * 알림 아이템 컴포넌트
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';
import type { NotificationItemProps } from '../../types';

export function NotificationItem({
  icon,
  title,
  description,
  time,
  isRead,
  onDelete,
}: NotificationItemProps) {
  return (
    <View style={[styles.notificationItem, isRead && styles.notificationItemRead]}>
      {/* 아이콘 */}
      <View style={[styles.iconContainer, isRead && styles.iconContainerRead]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      {/* 내용 */}
      <View style={styles.contentContainer}>
        {/* 제목과 읽음 표시 */}
        <View style={styles.titleRow}>
          <View style={styles.titleTextContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          {!isRead && <View style={styles.unreadDot} />}
        </View>

        {/* 설명 */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        {/* 시간과 삭제 버튼 */}
        <View style={styles.footerRow}>
          <View style={styles.timeTextContainer}>
            <Text style={styles.timeText}>{time}</Text>
          </View>
          {isRead && onDelete && (
            <Pressable style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteButtonText}>삭제</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

