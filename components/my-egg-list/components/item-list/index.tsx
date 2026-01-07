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

import React from 'react';
import { ScrollView } from 'react-native';
import { Item } from '../item';
import type { ItemProps } from '../item';
import { MOCK_DISCOVERED_ITEMS, MOCK_PLANTED_ITEMS } from './constants';
import { styles } from './styles';

export type { ItemProps };

interface ItemListProps {
  items?: ItemProps[];
  tabType?: 'discovered' | 'planted';
  onItemPress?: (item: ItemProps, index: number) => void;
}

export function ItemList({
  items,
  tabType = 'discovered',
  onItemPress,
}: ItemListProps) {
  // items가 제공되지 않으면 mock 데이터 사용
  const displayItems =
    items || (tabType === 'discovered' ? MOCK_DISCOVERED_ITEMS : MOCK_PLANTED_ITEMS);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {displayItems.map((item, index) => (
        <Item
          key={item.id || `${item.title}-${index}`}
          {...item}
          onPress={() => onItemPress?.(item, index)}
        />
      ))}
    </ScrollView>
  );
}
