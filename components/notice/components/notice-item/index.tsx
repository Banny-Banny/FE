/**
 * components/notice/components/notice-item/index.tsx
 * 공지사항 항목 컴포넌트
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
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from './styles';
import type { NoticeItemProps } from './types';

export function NoticeItem({ notice, onPress }: NoticeItemProps) {
  const handlePress = () => {
    onPress(notice.id);
  };

  const formattedDate = formatRelativeTime(notice.createdAt);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        notice.isPinned && styles.containerPinned,
        pressed && styles.containerPressed,
      ]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        {/* Left: 고정 배지 */}
        {notice.isPinned && (
          <View style={styles.badgeContainer}>
            <View style={styles.pinnedBadge}>
              <Text style={styles.pinnedBadgeText}>공지</Text>
            </View>
          </View>
        )}

        {/* Center: 텍스트 컨텐츠 */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {notice.title}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Icon name="time-line" size={11} color={Colors.grey[500]} />
            <Text style={styles.createdAt}>{formattedDate}</Text>
          </View>
        </View>

        {/* Right: 화살표 */}
        <View style={styles.arrowContainer}>
          <Icon name="arrow-right-s-line" size={18} color={Colors.grey[400]} />
        </View>
      </View>
    </Pressable>
  );
}
