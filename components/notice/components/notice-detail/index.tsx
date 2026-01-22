/**
 * components/notice/components/notice-detail/index.tsx
 * 공지사항 상세 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 프로젝트 디자인 시스템 일관성 유지
 */

import { Colors } from '@/commons/constants';
import { formatRelativeTime } from '@/utils/format';
import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from './styles';
import type { NoticeDetailProps } from './types';

export function NoticeDetail({ notice, isLoading, error, onRetry }: NoticeDetailProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.red[500]} />
            <Text style={styles.loadingText}>공지사항을 불러오는 중...</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.errorContainer}>
            <Icon name="error-warning-line" size={48} color={Colors.red[500]} />
            <Text style={styles.errorText}>{error}</Text>
            {onRetry && (
              <Pressable style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // 공지사항이 없는 경우
  if (!notice) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>공지사항을 찾을 수 없습니다.</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // 날짜 포맷팅
  const formattedCreatedAt = formatRelativeTime(notice.createdAt);
  const formattedUpdatedAt = notice.updatedAt ? formatRelativeTime(notice.updatedAt) : null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 헤더 섹션 */}
        <View style={styles.headerSection}>
          {/* 고정 배지 */}
          {notice.isPinned && (
            <View style={styles.pinnedBadge}>
              <Text style={styles.pinnedBadgeText}>공지</Text>
            </View>
          )}

          {/* 제목 */}
          <Text style={styles.title}>{notice.title}</Text>

          {/* 날짜 정보 */}
          <View style={styles.dateContainer}>
            <Icon name="time-line" size={12} color={Colors.grey[500]} />
            <Text style={styles.dateText}>{formattedCreatedAt}</Text>
            {formattedUpdatedAt && (
              <>
                <Text style={styles.updatedAtText}>·</Text>
                <Text style={styles.updatedAtText}>수정 {formattedUpdatedAt}</Text>
              </>
            )}
          </View>
        </View>

        {/* 이미지 섹션 */}
        {notice.imageUrl && (
          <View style={styles.imageSection}>
            <Image source={{ uri: notice.imageUrl }} style={styles.image} resizeMode="cover" />
          </View>
        )}

        {/* 본문 섹션 */}
        <View style={styles.contentSection}>
          <Text style={styles.content}>{notice.content}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
