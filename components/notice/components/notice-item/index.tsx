/**
 * components/notice/components/notice-item/index.tsx
 * 공지사항 항목 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 */

import { formatRelativeTime } from '@/utils/format';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';
import type { NoticeItemProps } from './types';

export function NoticeItem({ notice, onPress }: NoticeItemProps) {
  const handlePress = () => {
    onPress(notice.id);
  };

  const formattedDate = formatRelativeTime(notice.createdAt);

  return (
    <Pressable
      style={[styles.container, notice.isPinned && styles.containerPinned]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {notice.title}
            </Text>
            {notice.isPinned && (
              <Text style={styles.pinnedIndicator}>고정</Text>
            )}
          </View>
          <Text style={styles.createdAt}>{formattedDate}</Text>
        </View>
      </View>
    </Pressable>
  );
}
