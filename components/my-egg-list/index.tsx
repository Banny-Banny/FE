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
import { Tab } from './components/tab';
import { useMyEggs } from './hooks/useMyEggs';
import { useEggDetail } from './hooks/useEggDetail';
import { styles } from './styles';
import { FilterOption, TabType } from './types';

interface MyEggListProps {
  onItemPress?: (item: { id: string; eggId: number }, index: number) => void;
  onHeaderButtonPress?: () => void;
}

export default function MyEggList({ onItemPress, onHeaderButtonPress }: MyEggListProps) {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('discovered');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('latest');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEggId, setSelectedEggId] = useState<string | null>(null);

  // API 파라미터 변환
  const apiType = useMemo(() => {
    return activeTab === 'discovered' ? 'FOUND' : 'PLANTED';
  }, [activeTab]);

  const apiSort = useMemo(() => {
    return selectedFilter === 'latest' ? 'LATEST' : 'OLDEST';
  }, [selectedFilter]);

  // 발견한 알 데이터 조회 (필터는 발견한 알에서만 사용)
  const discoveredData = useMyEggs({
    type: 'FOUND',
    sort: activeTab === 'discovered' ? apiSort : undefined,
  });

  // 심은 알 데이터 조회
  const plantedData = useMyEggs({
    type: 'PLANTED',
  });

  // 현재 탭에 따른 데이터 선택
  const currentData = useMemo(() => {
    return activeTab === 'discovered' ? discoveredData : plantedData;
  }, [activeTab, discoveredData, plantedData]);

  // EasterEggItem을 ItemProps로 변환
  const convertToItemProps = (items: typeof currentData.items): ItemProps[] => {
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      location: item.location,
      date: item.date,
      eggIcon: item.eggIcon,
      hasImage: item.hasImage,
      hasAudio: item.hasAudio,
      hasVideo: item.hasVideo,
      viewCount: item.viewCount,
      status: item.status, // 활성/소멸 상태 포함
    }));
  };

  const currentItems = useMemo(() => {
    return convertToItemProps(currentData.items);
  }, [currentData.items]);

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
  const handleItemPress = (item: ItemProps, index: number) => {
    if (!item.id) {
      return;
    }
    // onItemPress가 있으면 먼저 호출
    const eggId = parseInt(item.id, 10);
    onItemPress?.({ id: item.id, eggId }, index);

    // 상세 API 호출을 위해 모달 열기
    setSelectedEggId(item.id);
    setModalVisible(true);
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedEggId(null);
  };

  // 선택된 이스터에그 상세 데이터 조회
  const { data: selectedEggData, isLoading: isDetailLoading } = useEggDetail({
    eggId: selectedEggId,
  });

  // 카운트 계산
  const discoveredCount = discoveredData.summary?.totalFoundCount || 0;
  const plantedCount = plantedData.summary?.totalPlantedCount || 0;
  const activeCount = plantedData.summary?.activeCount || 0;

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
        onItemPress={handleItemPress}
      />

      {/* 이스터에그 상세 모달 */}
      {/* TODO: 상세 API 연동 후 활성화 */}
      <EasterEggModal visible={modalVisible} onClose={handleModalClose} data={selectedEggData} />
    </View>
  );
}
