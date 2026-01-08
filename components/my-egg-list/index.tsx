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

import { useNavigation } from '@/commons/hooks';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Filter } from './components/filter';
import { Header } from './components/header';
import { ItemList, ItemProps } from './components/item-list';
import { EasterEggModal } from './components/modal';
import { MOCK_EGG_DATA_LIST } from './components/modal/mockData';
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
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('discovered');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('latest');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEggId, setSelectedEggId] = useState<number | null>(null);

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
      viewCount: item.viewCount,
      status: item.status, // 활성/소멸 상태 포함
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

  // 헤더 X 버튼 클릭 시 마이페이지로 이동
  // 탭 네비게이션에서는 back()이 제대로 동작하지 않을 수 있으므로 명시적으로 마이페이지로 이동
  const handleHeaderButtonPress = () => {
    if (onHeaderButtonPress) {
      onHeaderButtonPress();
    } else {
      // 마이페이지 탭으로 이동
      navigation.push('/(tabs)/mypage');
    }
  };

  // 아이템 클릭 핸들러
  const handleItemPress = (item: EasterEggItem, index: number) => {
    // onItemPress가 있으면 먼저 호출
    onItemPress?.(item, index);

    // TODO: 실제로는 item.id나 item.eggId를 사용하여 API 호출
    // 현재는 mock 데이터에서 첫 번째 항목 사용
    // 실제 구현 시: const eggData = await fetchEggDetail(item.id);
    const mockEggData = MOCK_EGG_DATA_LIST[0]; // 임시로 첫 번째 mock 데이터 사용

    setSelectedEggId(mockEggData.eggId);
    setModalVisible(true);
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedEggId(null);
  };

  // 선택된 이스터에그 데이터 찾기
  const selectedEggData = useMemo(() => {
    if (!selectedEggId) return null;
    return MOCK_EGG_DATA_LIST.find((data) => data.eggId === selectedEggId) || null;
  }, [selectedEggId]);

  return (
    <View style={styles.container}>
      <Header
        onButtonPress={handleHeaderButtonPress}
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
      {activeTab === 'discovered' && (
        <View style={styles.filterContainer}>
          <Filter
            isOpen={filterOpen}
            selectedOption={selectedFilter}
            onPress={handleFilterPress}
            onOptionSelect={handleFilterOptionSelect}
          />
        </View>
      )}
      <ItemList
        items={currentItems.length > 0 ? currentItems : undefined}
        tabType={activeTab}
        onItemPress={(item, index) => {
          const originalItem =
            activeTab === 'discovered' ? discoveredItems[index] : plantedItems[index];
          handleItemPress(originalItem, index);
        }}
      />

      {/* 이스터에그 상세 모달 */}
      <EasterEggModal
        visible={modalVisible}
        onClose={handleModalClose}
        data={selectedEggData}
      />
    </View>
  );
}
