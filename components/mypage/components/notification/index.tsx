/**
 * components/mypage/components/notification/index.tsx
 * 알림 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] react-native-remix-icon 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 * - [✓] 알림 아이템 높이 자동 조절 (flexShrink 사용)
 *
 * Figma 노드 ID: 161-24395
 * 생성 시각: 2025-01-XX
 *
 * @description
 * - 알림 목록을 표시하는 컴포넌트
 * - 새로운 알림과 이전 알림으로 구분
 * - 읽지 않은 알림은 검은 점으로 표시
 * - 이전 알림은 삭제 버튼 제공
 */

import { Colors } from '@/commons/constants';
import { DEFAULT_NEW_NOTIFICATIONS, DEFAULT_OLD_NOTIFICATIONS } from '@/egg/constants/MOCK_DATA';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { styles } from './styles';

interface NotificationItemProps {
  icon: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  onDelete?: () => void;
}

function NotificationItem({
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
          <Text style={styles.titleText}>{title}</Text>
          {!isRead && <View style={styles.unreadDot} />}
        </View>

        {/* 설명 */}
        <Text style={styles.descriptionText}>{description}</Text>

        {/* 시간과 삭제 버튼 */}
        <View style={styles.footerRow}>
          <Text style={styles.timeText}>{time}</Text>
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

export function Notification() {
  const handleMarkAllAsRead = () => {
    // TODO: 모든 알림 읽음 처리
  };

  const handleDelete = (id: string) => {
    // TODO: 알림 삭제 처리
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>알림</Text>
            <View style={styles.headerIcons}>
              <Pressable
                style={styles.iconButton}
                accessibilityRole="button"
                accessibilityLabel="설정">
                <Icon name={'ri-close-line' as IconName} size={20} color={Colors.black[500]} />
              </Pressable>
              <View style={styles.iconButtonActive}>
                <Icon
                  name={'ri-notification-line' as IconName}
                  size={20}
                  color={Colors.black[500]}
                />
              </View>
            </View>
          </View>
          <View style={styles.headerSubtitle}>
            <Text style={styles.headerSubtitleText}>새 알림 3개</Text>
          </View>
        </View>
      </View>

      {/* 알림 목록 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 새로운 알림 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>새로운 알림</Text>
            <Pressable style={styles.markAllReadButton} onPress={handleMarkAllAsRead}>
              <Text style={styles.markAllReadButtonText}>모두읽음</Text>
            </Pressable>
          </View>

          {DEFAULT_NEW_NOTIFICATIONS.map((notification) => (
            <NotificationItem
              key={notification.id}
              icon={notification.icon}
              title={notification.title}
              description={notification.description}
              time={notification.time}
              isRead={notification.isRead}
            />
          ))}
        </View>

        {/* 이전 알림 섹션 */}
        <View style={styles.sectionWithMargin}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleOld}>이전 알림</Text>
          </View>

          {DEFAULT_OLD_NOTIFICATIONS.map((notification) => (
            <NotificationItem
              key={notification.id}
              icon={notification.icon}
              title={notification.title}
              description={notification.description}
              time={notification.time}
              isRead={notification.isRead}
              onDelete={() => handleDelete(notification.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
