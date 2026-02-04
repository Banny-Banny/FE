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
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AppState, Pressable, ScrollView, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { NotificationItem } from './components/notification-item';
import { useNotifications } from './hooks/useNotifications';
import { styles } from './styles';

export default function NotificationFeature() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ from?: string }>();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const {
    newNotifications,
    oldNotifications,
    isLoading,
    error,
    refreshNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
  } = useNotifications();

  // 알림 권한 상태 확인
  const checkNotificationPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setIsNotificationEnabled(status === 'granted');
    } catch (error) {
    }
  };

  // 컴포넌트 마운트 시 및 앱이 포그라운드로 돌아올 때 권한 상태 확인
  useEffect(() => {
    checkNotificationPermission();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkNotificationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // 모두읽음 처리 후 알림 목록 새로고침하여 이전 알림으로 이동
      await refreshNotifications();
    } catch (err) {
      // 에러는 useNotifications 훅에서 이미 처리됨
      // 필요시 추가 에러 처리 (예: 토스트 메시지)
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
    } catch (err) {
      // 에러는 useNotifications 훅에서 이미 처리됨
      // 필요시 추가 에러 처리 (예: 토스트 메시지)
    }
  };

  const handleNotificationPress = async (notification: { id: string; type: string }) => {
    try {
      // 알림 읽음 처리
      await markAsRead(notification.id);

      // 알림 타입에 따라 라우팅
      if (notification.type === 'FRIEND_INVITE' || notification.type === 'FRIEND_ACCEPTED') {
        // 친구 관련 알림 → 마이페이지로 이동
        navigation.replace('/(tabs)/mypage');
      } else if (notification.type === 'CAPSULE_OPEN') {
        // 캡슐 열림 알림 → 홈(지도)으로 이동
        navigation.replace(ROUTES.HOME);
      } else if (notification.type === 'EASTER_EGG_VIEWED') {
        // 이스터에그 발견 알림 → 홈(지도)으로 이동
        navigation.replace(ROUTES.HOME);
      }
      // 기본적으로는 알림 화면에 머무름
    } catch (err) {
      // 에러는 useNotifications 훅에서 이미 처리됨
      // 필요시 추가 에러 처리 (예: 토스트 메시지)
    }
  };

  const handleToggleNotification = async () => {
    try {
      // 현재 권한 상태 확인
      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      if (existingStatus === 'granted') {
        // 이미 권한이 있으면 토글
        setIsNotificationEnabled(false);
        // TODO: 실제 알림 설정 API 호출 (알림 끄기)
      } else {
        // 권한이 없으면 권한 요청
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          setIsNotificationEnabled(true);
          // TODO: 실제 알림 설정 API 호출 (알림 켜기)
        }
      }
    } catch (error) {
    }
  };

  const handleClose = () => {
    // 쿼리 파라미터로 어디서 왔는지 확인
    if (params.from === 'mypage') {
      // 마이페이지에서 push로 진입한 경우 뒤로 가기
      if (navigation.canGoBack()) {
        navigation.back();
      } else {
        // 뒤로 갈 수 없는 경우 마이페이지로 이동
        navigation.replace('/(tabs)/mypage');
      }
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
              {isNotificationEnabled ? (
                <Pressable
                  key="notification-enabled"
                  style={styles.iconButtonActive}
                  onPress={handleToggleNotification}
                  accessibilityRole="button"
                  accessibilityLabel="알림 끄기">
                  <Icon
                    name={'ri-notification-line' as IconName}
                    size={20}
                    color={Colors.black[500]}
                  />
                </Pressable>
              ) : (
                <Pressable
                  key="notification-disabled"
                  style={styles.iconButtonActive}
                  onPress={handleToggleNotification}
                  accessibilityRole="button"
                  accessibilityLabel="알림 켜기">
                  <Image
                    source={require('@/assets/icons/unnotification.png')}
                    style={styles.notificationOffIcon}
                    contentFit="contain"
                    accessibilityLabel="알림 꺼짐"
                  />
                </Pressable>
              )}
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
            <Text style={styles.headerSubtitleText}>새 알림 {newNotifications.length}개</Text>
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
            <Pressable style={styles.retryButton} onPress={refreshNotifications}>
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
                  <Pressable style={styles.markAllReadButton} onPress={handleMarkAllAsRead}>
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
                    type={notification.type}
                    onPress={() => handleNotificationPress(notification)}
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
                    type={notification.type}
                    onPress={() => handleNotificationPress(notification)}
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
