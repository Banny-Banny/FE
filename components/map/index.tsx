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

import React from 'react';
import { View } from 'react-native';
import { EggForm } from './components/egg-form';
import FabButton from './components/fab-btn';
import MapView from './components/map-view';
import { useEggForm } from './hooks/useEggForm';
import { useMapFeature } from './hooks/useMapFeature';
import type { MapFeatureProps } from './types';

export default function MapFeature({ onEasterEggPress, onTimeCapsulePress }: MapFeatureProps = {}) {
  const { mapConfig } = useMapFeature();
  const { isEggFormVisible, handleEasterEggPress, handleCloseEggForm } = useEggForm({
    onEasterEggPress,
  });

  return (
    <View style={{ flex: 1 }}>
      <MapView center={mapConfig.center} level={mapConfig.level} />
      <FabButton onEasterEggPress={handleEasterEggPress} onTimeCapsulePress={onTimeCapsulePress} />
      <EggForm isVisible={isEggFormVisible} onClose={handleCloseEggForm} />
    </View>
  );
}
