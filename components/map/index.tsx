/**
 * components/map/index.tsx
 * 지도 기능 Feature Container (조립 공장)
 * 비즈니스 로직과 UI 컴포넌트를 조합
 */

import React from 'react';
import { View } from 'react-native';
import { useMapFeature } from './hooks/useMapFeature';
import { MapView } from './components/map-view';
import { MapFeatureProps } from './types';

/**
 * MapFeature: 지도 기능의 진입점
 * - 비즈니스 로직(useMapFeature)과 UI(MapView)를 연결
 * - app/에서는 이 컴포넌트만 import하여 사용
 */
export const MapFeature: React.FC<MapFeatureProps> = () => {
  const { region, setRegion, isLoading } = useMapFeature();

  return (
    <View style={{ flex: 1 }}>
      <MapView region={region} onRegionChange={setRegion} />
    </View>
  );
};

// 기본 export (하위 호환성)
export default MapFeature;
