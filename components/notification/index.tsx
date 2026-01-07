/**
 * components/notification/index.tsx
 * 알림 Feature Container
 *
 * Feature Slice Architecture 패턴에 따라
 * 비즈니스 로직과 UI 컴포넌트를 조립하는 컨테이너
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
 * - 알림 목록을 표시하는 Feature
 * - 새로운 알림과 이전 알림으로 구분
 * - 읽지 않은 알림은 검은 점으로 표시
 * - 이전 알림은 삭제 버튼 제공
 */

import { Colors, ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { NotificationItem } from './components/notification-item';
import { useNotifications } from './hooks/useNotifications';
import { styles } from './styles';

export default function NotificationFeature() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ from?: string }>();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const {
    newNotifications,
    oldNotifications,
    isLoading,
    error,
    refreshNotifications,
  } = useNotifications();

  const handleMarkAllAsRead = () => {
    // TODO: 모든 알림 읽음 처리
  };

  const handleDelete = (id: string) => {
    // TODO: 알림 삭제 처리
  };

  const handleToggleNotification = () => {
    setIsNotificationEnabled((prev) => !prev);
    // TODO: 실제 알림 설정 API 호출
  };

  const handleClose = () => {
    // 쿼리 파라미터로 어디서 왔는지 확인
    if (params.from === 'mypage') {
      // 마이페이지에서 진입한 경우 마이페이지로 이동
      navigation.replace(ROUTES.MY_PAGE);
    } else {
      // 지도(홈)에서 탭바를 통해 진입한 경우 지도로 이동
      navigation.replace(ROUTES.HOME);
    }
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
                style={styles.iconButtonActive}
                onPress={handleToggleNotification}
                accessibilityRole="button"
                accessibilityLabel={isNotificationEnabled ? '알림 끄기' : '알림 켜기'}>
                {isNotificationEnabled ? (
                  <Icon
                    name={'ri-notification-line' as IconName}
                    size={20}
                    color={Colors.black[500]}
                  />
                ) : (
                  <Image
                    source={require('@/assets/icons/unnotification.png')}
                    style={styles.notificationOffIcon}
                    contentFit="contain"
                    accessibilityLabel="알림 꺼짐"
                  />
                )}
              </Pressable>
              <Pressable
                style={styles.iconButton}
                onPress={handleClose}
                accessibilityRole="button"
                accessibilityLabel="닫기">
                <Icon name={'ri-close-line' as IconName} size={20} color={Colors.black[500]} />
              </Pressable>
            </View>
          </View>
          <View style={styles.headerSubtitle}>
            <Text style={styles.headerSubtitleText}>
              새 알림 {newNotifications.length}개
            </Text>
          </View>
        </View>
      </View>

      {/* 알림 목록 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          // TODO: RefreshControl 추가 (Pull to refresh)
          undefined
        }>
        {isLoading && newNotifications.length === 0 && oldNotifications.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>알림을 불러오는 중...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={refreshNotifications}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* 새로운 알림 */}
            {newNotifications.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>새로운 알림</Text>
                  <Pressable
                    style={styles.markAllReadButton}
                    onPress={handleMarkAllAsRead}>
                    <Text style={styles.markAllReadButtonText}>모두읽음</Text>
                  </Pressable>
                </View>

                {newNotifications.map((notification) => (
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
            )}

            {/* 이전 알림 */}
            {oldNotifications.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitleOld}>이전 알림</Text>
                </View>

                {oldNotifications.map((notification) => (
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
            )}

            {/* 알림이 없을 때 */}
            {newNotifications.length === 0 && oldNotifications.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>알림이 없습니다</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
