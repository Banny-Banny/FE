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

import { Colors } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';
import { DEFAULT_NEW_NOTIFICATIONS, DEFAULT_OLD_NOTIFICATIONS } from '@/egg/constants/MOCK_DATA';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { NotificationItem } from './components/notification-item';
import { styles } from './styles';

export default function NotificationFeature() {
  const navigation = useNavigation();

  const handleMarkAllAsRead = () => {
    // TODO: 모든 알림 읽음 처리
  };

  const handleDelete = (id: string) => {
    // TODO: 알림 삭제 처리
  };

  const handleClose = () => {
    if (navigation.canGoBack()) {
      // 스택에 이전 화면이 있으면 뒤로 가기
      // 마이페이지에서 push로 진입한 경우 마이페이지로 돌아감
      navigation.back();
    } else {
      // 스택 루트인 경우 (탭바에서 직접 진입)
      // 홈으로 이동
      navigation.toHome();
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
              <View style={styles.iconButtonActive}>
                <Icon
                  name={'ri-notification-line' as IconName}
                  size={20}
                  color={Colors.black[500]}
                />
              </View>
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
            <Text style={styles.headerSubtitleText}>새 알림 3개</Text>
          </View>
        </View>
      </View>

      {/* 알림 목록 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {[
          {
            title: '새로운 알림',
            titleStyle: styles.sectionTitle,
            data: DEFAULT_NEW_NOTIFICATIONS,
            showMarkAllRead: true,
            showDelete: false,
          },
          {
            title: '이전 알림',
            titleStyle: styles.sectionTitleOld,
            data: DEFAULT_OLD_NOTIFICATIONS,
            showMarkAllRead: false,
            showDelete: true,
          },
        ].map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={section.titleStyle}>{section.title}</Text>
              {section.showMarkAllRead && (
                <Pressable style={styles.markAllReadButton} onPress={handleMarkAllAsRead}>
                  <Text style={styles.markAllReadButtonText}>모두읽음</Text>
                </Pressable>
              )}
            </View>

            {section.data.map((notification) => (
              <NotificationItem
                key={notification.id}
                icon={notification.icon}
                title={notification.title}
                description={notification.description}
                time={notification.time}
                isRead={notification.isRead}
                onDelete={section.showDelete ? () => handleDelete(notification.id) : undefined}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
