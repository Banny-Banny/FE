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

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { EggDetailFind } from './components/egg-detail-find';
import { useCapsuleViewer } from './components/egg-detail-find/hooks/useCapsuleViewer';
import { useEggDiscovery } from './components/egg-detail-find/hooks/useEggDiscovery';
import { EggDetailHint } from './components/egg-detail-hint';
import { EggDetail } from './components/egg-detail-owner';
import { EggForm } from './components/egg-form';
import { EggSlotModal } from './components/egg-slot-modal';
import type { EggSlotDataResponse } from './components/egg-slot/hooks/useEggSlotData';
import FabButton from './components/fab-btn';
import MapView from './components/map-view';
import { useCapsules } from './components/map-view/hooks/useCapsules';
import { useMapLocation } from './components/map-view/hooks/useMapLocation';
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

  // 현재 위치 가져오기
  const { location: currentLocation } = useMapLocation();

  // 캡슐 리스트 가져오기 (진입 감지용) - 실제 사용자 위치 사용
  const { capsules } = useCapsules({
    lat: currentLocation?.lat || mapConfig.center.lat,
    lng: currentLocation?.lng || mapConfig.center.lng,
    radius_m: 300, // 기본값
    limit: 50, // 기본값
  });

  // 캡슐 상세 바텀시트 상태 관리
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleItem | null>(null);
  const [isCapsuleDetailVisible, setIsCapsuleDetailVisible] = useState(false);

  const handleCapsuleClick = (capsule: CapsuleItem) => {
    setSelectedCapsule(capsule);
    // 조건부 렌더링: is_mine === true && type === EASTER_EGG일 때만 표시
    if (capsule.is_mine === true && capsule.type === 'EASTER_EGG') {
      setIsCapsuleDetailVisible(true);
    }
    // 조건부 렌더링: is_mine === false && type === EASTER_EGG일 때만 힌트 표시
    if (capsule.is_mine === false && capsule.type === 'EASTER_EGG') {
      setHintCapsule(capsule);
      setIsEggDetailHintVisible(true);
    }
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

  // 에그 디테일 힌트 모달 상태 관리
  const [isEggDetailHintVisible, setIsEggDetailHintVisible] = useState(false);
  const [hintCapsule, setHintCapsule] = useState<CapsuleItem | null>(null);

  const handleCloseEggDetailHint = () => {
    setIsEggDetailHintVisible(false);
    setHintCapsule(null);
  };

  // 에그 디테일 발견 모달 상태 관리
  const [isEggDetailFindVisible, setIsEggDetailFindVisible] = useState(false);
  const [discoveredCapsuleId, setDiscoveredCapsuleId] = useState<string | null>(null);
  const [processedCapsuleIds, setProcessedCapsuleIds] = useState<Set<string>>(new Set());

  // POST /api/capsules/:id/viewers API 호출
  const { postViewer, isLoading: isViewerLoading } = useCapsuleViewer();

  // 진입 감지 로직
  const { discoveredCapsuleId: detectedCapsuleId, discoveredCapsule } = useEggDiscovery({
    capsules,
    currentLocation,
    isModalVisible: isEggDetailFindVisible,
    isApiLoading: isViewerLoading,
  });

  // 발견된 캡슐이 있으면 POST /viewers API 호출
  useEffect(() => {
    if (!detectedCapsuleId || !currentLocation) return;
    if (isEggDetailFindVisible) return; // 이미 모달이 열려있으면 무시
    if (isViewerLoading) return; // API 요청 중이면 무시
    if (processedCapsuleIds.has(detectedCapsuleId)) return; // 이미 처리한 캡슐이면 무시

    const handleDiscovery = async () => {
      try {
        const result = await postViewer(detectedCapsuleId, currentLocation);
        if (result) {
          // 처리 완료 표시
          setProcessedCapsuleIds((prev) => new Set(prev).add(detectedCapsuleId));
          // API 성공 시 모달 표시
          setDiscoveredCapsuleId(detectedCapsuleId);
          setIsEggDetailFindVisible(true);
        }
      } catch (error) {
        console.error('[MapFeature] Discovery API error:', error);
      }
    };

    handleDiscovery();
  }, [
    detectedCapsuleId,
    currentLocation,
    isEggDetailFindVisible,
    isViewerLoading,
    processedCapsuleIds,
    postViewer,
  ]);

  const handleCloseEggDetailFind = () => {
    setIsEggDetailFindVisible(false);
    setDiscoveredCapsuleId(null);
  };

  // 현재 위치가 있으면 그것을 중심으로, 없으면 기본 설정 사용
  const mapCenter = currentLocation || mapConfig.center;

  return (
    <View style={styles.container}>
      <MapView
        center={mapCenter}
        level={mapConfig.level}
        onCapsuleClick={handleCapsuleClick}
        onEggSlotPress={handleEggSlotPress}
      />
      <FabButton onEasterEggPress={handleEasterEggPress} onTimeCapsulePress={onTimeCapsulePress} />
      <ResetEggSlot />
      <EggForm isVisible={isEggFormVisible} onClose={handleCloseEggForm} />
      <EggDetail
        isVisible={isCapsuleDetailVisible}
        onClose={handleCloseCapsuleDetail}
        capsule={selectedCapsule}
        currentLocation={currentLocation}
      />
      <EggSlotModal
        visible={isEggSlotModalVisible}
        onClose={handleCloseEggSlotModal}
        usedCount={slotData?.usedSlots ?? 0}
        totalCount={slotData?.totalSlots ?? 3}
      />
      <EggDetailHint
        visible={isEggDetailHintVisible}
        onClose={handleCloseEggDetailHint}
        capsule={hintCapsule}
        currentLocation={currentLocation}
      />
      <EggDetailFind
        visible={isEggDetailFindVisible}
        onClose={handleCloseEggDetailFind}
        capsuleId={discoveredCapsuleId}
        currentLocation={currentLocation}
      />
    </View>
  );
}
