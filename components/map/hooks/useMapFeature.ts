/**
 * components/map/hooks/useMapFeature.ts
 * 지도 기능의 비즈니스 로직 (위치 권한, API 호출, 전역 상태 관리)
 */

import { useState, useEffect } from 'react';
import { MapRegion } from '../types';

export const useMapFeature = () => {
  const [region, setRegion] = useState<MapRegion>({
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [isLoading, setIsLoading] = useState(false);

  // 위치 권한 요청 로직
  const requestLocationPermission = async () => {
    try {
      setIsLoading(true);
      // TODO: 실제 위치 권한 요청 로직 구현
      console.log('위치 권한 요청');
    } catch (error) {
      console.error('위치 권한 요청 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return {
    region,
    setRegion,
    isLoading,
  };
};

