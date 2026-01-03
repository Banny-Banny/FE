/**
 * src/components/notification/index.tsx
 * 알림 화면 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] react-native-remix-icon 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * Figma 노드 ID: 161-24395
 * 생성 시각: 2025-01-XX
 *
 * @description
 * - 알림 목록을 표시하는 화면
 * - 새로운 알림과 이전 알림으로 구분
 * - react-native-remix-icon 사용
 */

import { Colors } from '@/commons/constants';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { styles } from './styles';

export function Notification() {
  return (
    <View style={styles.container}>
      {/* 헤더 섹션 */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>알림</Text>
            <View style={styles.headerButtons}>
              <View style={styles.headerButton}>
                <Icon
                  name={'ri-notification-line' as IconName}
                  size={20}
                  color={Colors.black[500]}
                />
              </View>
              <View style={styles.headerButtonActive}>
                <Icon
                  name={'ri-close-line' as IconName}
                  size={20}
                  color={Colors.black[500]}
                />
              </View>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>새 알림 3개</Text>
        </View>
      </View>

      {/* 알림 목록 섹션 */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 새로운 알림 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>새로운 알림</Text>
            <View style={styles.markAllReadButton}>
              <Text style={styles.markAllReadButtonText}>모두읽음</Text>
            </View>
          </View>

          <View style={styles.notificationList}>
            {/* 알림 1: 이스터에그 발견 */}
            <View style={styles.notificationItem}>
              <View style={styles.notificationIconContainer}>
                <Text style={styles.notificationIcon}>🥚</Text>
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationTitleRow}>
                  <Text style={styles.notificationTitle}>이스터에그 발견!</Text>
                  <View style={styles.unreadDot} />
                </View>
                <Text style={styles.notificationDescription}>
                  누군가 "응원의 메시지" 알을 발견했어요 🎉
                </Text>
                <Text style={styles.notificationTime}>방금 전</Text>
              </View>
            </View>

            {/* 알림 2: 캡슐 초대장 */}
            <View style={styles.notificationItem}>
              <View style={styles.notificationIconContainer}>
                <Text style={styles.notificationIcon}>💊</Text>
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationTitleRow}>
                  <Text style={styles.notificationTitle}>캡슐 초대장이 도착했어요</Text>
                  <View style={styles.unreadDot} />
                </View>
                <Text style={styles.notificationDescription}>
                  김민수님이 "졸업 여행" 캡슐에 초대했어요
                </Text>
                <Text style={styles.notificationTime}>10분 전</Text>
              </View>
            </View>

            {/* 알림 3: 새로운 친구 추가 */}
            <View style={styles.notificationItem}>
              <View style={styles.notificationIconContainer}>
                <Text style={styles.notificationIcon}>👋</Text>
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationTitleRow}>
                  <Text style={styles.notificationTitle}>새로운 친구 추가</Text>
                  <View style={styles.unreadDot} />
                </View>
                <Text style={styles.notificationDescription}>
                  이지은님이 친구로 추가되었어요!
                </Text>
                <Text style={styles.notificationTime}>1시간 전</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 이전 알림 섹션 */}
        <View style={styles.section}>
          <Text style={styles.previousSectionTitle}>이전 알림</Text>

          <View style={styles.notificationList}>
            {/* 알림 1: 캡슐이 열렸어요 */}
            <View style={styles.previousNotificationItem}>
              <View style={styles.previousNotificationIconContainer}>
                <Text style={styles.notificationIcon}>🎁</Text>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>캡슐이 열렸어요!</Text>
                <Text style={styles.previousNotificationDescription}>
                  "생일 파티" 캡슐의 잠금이 해제되었어요
                </Text>
                <View style={styles.notificationFooter}>
                  <Text style={styles.notificationTime}>3시간 전</Text>
                  <View style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 알림 2: 이스터에그 소멸 */}
            <View style={styles.previousNotificationItem}>
              <View style={styles.previousNotificationIconContainer}>
                <Text style={styles.notificationIcon}>✨</Text>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>이스터에그 소멸</Text>
                <Text style={styles.previousNotificationDescription}>
                  "좋은 하루" 알이 3명에게 발견되어 소멸되었어요
                </Text>
                <View style={styles.notificationFooter}>
                  <Text style={styles.notificationTime}>어제</Text>
                  <View style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 알림 3: 이스터에그 발견 (이전) */}
            <View style={styles.previousNotificationItem}>
              <View style={styles.previousNotificationIconContainer}>
                <Text style={styles.notificationIcon}>🥚</Text>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>이스터에그 발견!</Text>
                <Text style={styles.previousNotificationDescription}>
                  누군가 "좋아하는 노래" 알을 발견했어요
                </Text>
                <View style={styles.notificationFooter}>
                  <Text style={styles.notificationTime}>2일 전</Text>
                  <View style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 알림 4: 캡슐 초대장 (이전) */}
            <View style={styles.previousNotificationItem}>
              <View style={styles.previousNotificationIconContainer}>
                <Text style={styles.notificationIcon}>💊</Text>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>캡슐 초대장</Text>
                <Text style={styles.previousNotificationDescription}>
                  박서준님이 "생일 파티" 캡슐에 초대했어요
                </Text>
                <View style={styles.notificationFooter}>
                  <Text style={styles.notificationTime}>3일 전</Text>
                  <View style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

