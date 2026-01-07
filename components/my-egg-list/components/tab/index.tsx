/**
 * components/my-egg-list/components/tab/index.tsx
 * 이스터에그 목록 탭 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * Figma 노드 ID: 585:2284
 * 생성 시각: 2025-01-XX
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';

interface TabProps {
  activeTab: 'discovered' | 'planted';
  onTabChange: (tab: 'discovered' | 'planted') => void;
  discoveredCount?: number;
  plantedCount?: number;
}

export function Tab({
  activeTab,
  onTabChange,
  discoveredCount = 5,
  plantedCount = 5,
}: TabProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.tabButton}
        onPress={() => onTabChange('discovered')}
        accessibilityRole="button"
        accessibilityLabel="발견한 알">
        <View style={styles.tabContent}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'discovered' && styles.tabTextActive,
            ]}>
            발견한 알 ({discoveredCount})
          </Text>
          {activeTab === 'discovered' && <View style={styles.underline} />}
        </View>
      </Pressable>
      <Pressable
        style={styles.tabButton}
        onPress={() => onTabChange('planted')}
        accessibilityRole="button"
        accessibilityLabel="심은 알">
        <View style={styles.tabContent}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'planted' && styles.tabTextActive,
            ]}>
            심은 알 ({plantedCount})
          </Text>
          {activeTab === 'planted' && <View style={styles.underline} />}
        </View>
      </Pressable>
    </View>
  );
}

