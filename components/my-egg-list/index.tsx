/**
 * components/my-egg-list/index.tsx
 * 이스터에그 목록 Feature Container
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] 컴포넌트 조합 방식
 *
 * Figma 노드 ID: 161:29166 (발견한 알), 161:25846 (심은 알)
 * 생성 시각: 2025-01-XX
 */

import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Filter } from './components/filter';
import { Header } from './components/header';
import { ItemList, ItemProps } from './components/item-list';
import { Tab } from './components/tab';
import { styles } from './styles';
import { EasterEggItem, FilterOption, TabType } from './types';

interface MyEggListProps {
  discoveredItems?: EasterEggItem[];
  plantedItems?: EasterEggItem[];
  discoveredCount?: number;
  plantedCount?: number;
  activeCount?: number;
  onItemPress?: (item: EasterEggItem, index: number) => void;
  onHeaderButtonPress?: () => void;
}

export default function MyEggList({
  discoveredItems = [],
  plantedItems = [],
  discoveredCount = 5,
  plantedCount = 5,
  activeCount = 3,
  onItemPress,
  onHeaderButtonPress,
}: MyEggListProps) {
  const [activeTab, setActiveTab] = useState<TabType>('discovered');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('latest');

  // EasterEggItem을 ItemProps로 변환
  const convertToItemProps = (items: EasterEggItem[]): ItemProps[] => {
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      location: item.location,
      date: item.date,
      eggIcon: item.eggIcon,
      hasImage: item.hasImage,
      hasAudio: item.hasAudio,
    }));
  };

  const currentItems = useMemo(() => {
    const items = activeTab === 'discovered' ? discoveredItems : plantedItems;
    return convertToItemProps(items);
  }, [activeTab, discoveredItems, plantedItems]);

  const handleFilterPress = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterOptionSelect = (option: FilterOption) => {
    setSelectedFilter(option);
  };

  return (
    <View style={styles.container}>
      <Header
        onButtonPress={onHeaderButtonPress}
        discoveredCount={discoveredCount}
        plantedCount={plantedCount}
        activeCount={activeCount}
      />
      <Tab
        activeTab={activeTab}
        onTabChange={setActiveTab}
        discoveredCount={discoveredCount}
        plantedCount={plantedCount}
      />
      <View style={styles.filterContainer}>
        <Filter
          isOpen={filterOpen}
          selectedOption={selectedFilter}
          onPress={handleFilterPress}
          onOptionSelect={handleFilterOptionSelect}
        />
      </View>
      <ItemList
        items={currentItems.length > 0 ? currentItems : undefined}
        tabType={activeTab}
        onItemPress={(item, index) => {
          const originalItem =
            activeTab === 'discovered' ? discoveredItems[index] : plantedItems[index];
          onItemPress?.(originalItem, index);
        }}
      />
    </View>
  );
}
