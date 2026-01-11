/**
 * My Egg List Feature Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 이스터에그 목록 Feature의 비즈니스 로직
 * - 탭 상태 관리
 * - 필터 상태 관리
 * - 모달 상태 관리
 * - 데이터 변환 로직
 * - 이벤트 핸들러
 */

import { useNavigation } from '@/commons/hooks';
import { useMemo, useState } from 'react';

import type { ItemProps } from '../components/item-list';
import type { FilterOption, TabType } from '../types';
import { useEggDetail } from './useEggDetail';
import { useMyEggs } from './useMyEggs';

export interface UseMyEggListProps {
  onItemPress?: (item: { id: string; eggId: number }, index: number) => void;
  onHeaderButtonPress?: () => void;
}

export interface UseMyEggListReturn {
  // 탭 관련
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // 필터 관련
  filterOpen: boolean;
  selectedFilter: FilterOption;
  handleFilterPress: () => void;
  handleFilterOptionSelect: (option: FilterOption) => void;

  // 모달 관련
  modalVisible: boolean;
  selectedEggId: string | null;
  selectedEggData: ReturnType<typeof useEggDetail>['data'];
  isDetailLoading: boolean;
  handleItemPress: (item: ItemProps, index: number) => void;
  handleModalClose: () => void;

  // 헤더 관련
  handleHeaderButtonPress: () => void;

  // 데이터
  currentItems: ItemProps[];
  discoveredCount: number;
  plantedCount: number;
  activeCount: number;
}

/**
 * 이스터에그 목록 Feature의 비즈니스 로직을 관리하는 Hook
 */
export function useMyEggList({
  onItemPress,
  onHeaderButtonPress,
}: UseMyEggListProps): UseMyEggListReturn {
  const navigation = useNavigation();

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<TabType>('discovered');

  // 필터 상태 관리
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('latest');

  // 모달 상태 관리
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

  // 필터 핸들러
  const handleFilterPress = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterOptionSelect = (option: FilterOption) => {
    setSelectedFilter(option);
  };

  // 헤더 X 버튼 클릭 시 마이페이지로 이동
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

  return {
    // 탭 관련
    activeTab,
    setActiveTab,

    // 필터 관련
    filterOpen,
    selectedFilter,
    handleFilterPress,
    handleFilterOptionSelect,

    // 모달 관련
    modalVisible,
    selectedEggId,
    selectedEggData,
    isDetailLoading,
    handleItemPress,
    handleModalClose,

    // 헤더 관련
    handleHeaderButtonPress,

    // 데이터
    currentItems,
    discoveredCount,
    plantedCount,
    activeCount,
  };
}
