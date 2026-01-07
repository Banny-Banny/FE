/**
 * components/my-egg-list/components/header/index.tsx
 * 이스터에그 목록 헤더 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] react-native-remix-icon 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * Figma 노드 ID: 161:29250
 * 생성 시각: 2025-01-XX
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { Colors } from '@/commons/constants';
import { styles } from './styles';

interface HeaderProps {
  onButtonPress?: () => void;
  discoveredCount?: number;
  plantedCount?: number;
  activeCount?: number;
}

export function Header({
  onButtonPress,
  discoveredCount = 5,
  plantedCount = 5,
  activeCount = 3,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>이스터에그</Text>
        </View>
        <Pressable
          style={styles.button}
          onPress={onButtonPress}
          accessibilityRole="button"
          accessibilityLabel="닫기">
          <View style={styles.iconContainer}>
            <Icon
              name={'ri-close-line' as IconName}
              size={20}
              color={Colors.black[500]}
            />
          </View>
        </Pressable>
      </View>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>
          발견한 알 {discoveredCount}개 · 심은 알 {plantedCount}개 (활성 {activeCount}/{activeCount})
        </Text>
      </View>
    </View>
  );
}

