/**
 * Map Feature Container
 * Version: 1.0.0
 * Created: 2025-12-17
 *
 * [Entry Point] 지도 기능의 조립 공장
 * - MapView: 실제 지도 렌더링
 * - FabButton: 플로팅 액션 버튼
 * - EggForm: 이스터에그 작성 폼 바텀시트
 * - useMapFeature: 비즈니스 로직
 */

import React, { useState } from 'react';
import { View } from 'react-native';

import { EggDetailHint } from './components/egg-detail-hint';
import { EggDetail } from './components/egg-detail-owner';
import { EggForm } from './components/egg-form';
import { EggSlotModal } from './components/egg-slot-modal';
import type { EggSlotDataResponse } from './components/egg-slot/hooks/useEggSlotData';
import FabButton from './components/fab-btn';
import MapView from './components/map-view';
import type { CapsuleItem } from './components/map-view/types';
import ResetEggSlot from './components/reset-egg-slot';
import { useEggForm } from './hooks/useEggForm';
import { useMapFeature } from './hooks/useMapFeature';
import { styles } from './styles';
import type { MapFeatureProps } from './types';

export default function MapFeature({ onEasterEggPress, onTimeCapsulePress }: MapFeatureProps = {}) {
  const { mapConfig } = useMapFeature();
  const { isEggFormVisible, handleEasterEggPress, handleCloseEggForm } = useEggForm({
    onEasterEggPress,
  });

  // 캡슐 상세 바텀시트 상태 관리
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleItem | null>(null);
  const [isCapsuleDetailVisible, setIsCapsuleDetailVisible] = useState(false);

  const handleCapsuleClick = (capsule: CapsuleItem) => {
    setSelectedCapsule(capsule);
    setIsCapsuleDetailVisible(true);
  };

  const handleCloseCapsuleDetail = () => {
    setIsCapsuleDetailVisible(false);
    setSelectedCapsule(null);
  };

  // 에그 슬롯 모달 상태 관리
  const [isEggSlotModalVisible, setIsEggSlotModalVisible] = useState(false);
  const [slotData, setSlotData] = useState<EggSlotDataResponse | null>(null);

  const handleEggSlotPress = (data: EggSlotDataResponse | null) => {
    setSlotData(data);
    setIsEggSlotModalVisible(true);
  };

  const handleCloseEggSlotModal = () => {
    setIsEggSlotModalVisible(false);
  };

  // 에그 디테일 힌트 모달 상태 관리 (UI 확인용: 기본값 true)
  const [isEggDetailHintVisible, setIsEggDetailHintVisible] = useState(true);

  const handleEggDetailHintPress = () => {
    setIsEggDetailHintVisible(true);
  };

  const handleCloseEggDetailHint = () => {
    setIsEggDetailHintVisible(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        center={mapConfig.center}
        level={mapConfig.level}
        onCapsuleClick={handleCapsuleClick}
        onEggSlotPress={handleEggDetailHintPress}
      />
      <FabButton onEasterEggPress={handleEasterEggPress} onTimeCapsulePress={onTimeCapsulePress} />
      <ResetEggSlot />
      <EggForm isVisible={isEggFormVisible} onClose={handleCloseEggForm} />
      <EggDetail
        isVisible={isCapsuleDetailVisible}
        onClose={handleCloseCapsuleDetail}
        capsule={selectedCapsule}
      />
      <EggSlotModal
        visible={isEggSlotModalVisible}
        onClose={handleCloseEggSlotModal}
        usedCount={slotData?.usedSlots ?? 0}
        totalCount={slotData?.totalSlots ?? 3}
      />
      <EggDetailHint visible={isEggDetailHintVisible} onClose={handleCloseEggDetailHint} />
    </View>
  );
}
