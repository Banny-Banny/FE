/**
 * components/my-egg-list/components/item-list/index.tsx
 * 이스터에그 목록 아이템 리스트 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * Figma 노드 ID: 585:2855
 * 생성 시각: 2025-01-XX
 */

import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Item } from '../item';
import type { ItemProps } from '../item';
import { styles } from './styles';

export type { ItemProps };

interface ItemListProps {
  items?: ItemProps[];
  tabType?: 'discovered' | 'planted';
  onItemPress?: (item: ItemProps, index: number) => void;
}

export function ItemList({
  items = [],
  tabType = 'discovered',
  onItemPress,
}: ItemListProps) {
  // items가 없으면 빈 배열 사용
  const displayItems = items;

  // 심은 알인 경우 활성/소멸 구분
  const { activeItems, expiredItems } = useMemo(() => {
    if (tabType !== 'planted') {
      return { activeItems: displayItems, expiredItems: [] };
    }

    const active: ItemProps[] = [];
    const expired: ItemProps[] = [];

    displayItems.forEach((item) => {
      if (item.status === 'EXPIRED') {
        expired.push(item);
      } else {
        active.push(item);
      }
    });

    return { activeItems: active, expiredItems: expired };
  }, [displayItems, tabType]);

  // 발견한 알 또는 활성 알만 있는 경우
  if (tabType === 'discovered' || expiredItems.length === 0) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {displayItems.map((item, index) => (
          <Item
            key={item.id || `${item.title}-${index}`}
            {...item}
            showViewCount={tabType === 'planted'} // 심은 알에서만 조회수 표시
            onPress={() => onItemPress?.(item, index)}
          />
        ))}
      </ScrollView>
    );
  }

  // 심은 알이고 활성/소멸이 모두 있는 경우 섹션으로 구분
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* 활성 알 섹션 */}
      {activeItems.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>활성 알 ({activeItems.length})</Text>
          </View>
          {activeItems.map((item, index) => (
            <Item
              key={item.id || `active-${item.title}-${index}`}
              {...item}
              showViewCount={true}
              onPress={() => {
                const originalIndex = displayItems.findIndex((i) => i.id === item.id);
                onItemPress?.(item, originalIndex >= 0 ? originalIndex : index);
              }}
            />
          ))}
        </View>
      )}

      {/* 소멸된 알 섹션 */}
      {expiredItems.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleExpired}>소멸된 알 ({expiredItems.length})</Text>
          </View>
          {expiredItems.map((item, index) => (
            <Item
              key={item.id || `expired-${item.title}-${index}`}
              {...item}
              showViewCount={true}
              onPress={() => {
                const originalIndex = displayItems.findIndex((i) => i.id === item.id);
                onItemPress?.(item, originalIndex >= 0 ? originalIndex : index);
              }}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
