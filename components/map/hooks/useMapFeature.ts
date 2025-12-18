/**
 * Map Feature Hook
 * Version: 1.0.0
 * Created: 2025-12-17
 *
 * [Business Logic] 지도 기능의 핵심 로직
 * - 위치 권한 관리
 * - API 호출
 * - 전역 상태 관리
 */

import { useEffect, useState } from 'react';
import type { MapConfig } from '../types';

export const useMapFeature = () => {
  const [mapConfig, setMapConfig] = useState<MapConfig>({
    center: { lat: 37.5665, lng: 126.978 }, // 서울시청
    level: 4,
  });

  useEffect(() => {
    // TODO: 위치 권한 요청 및 현재 위치 가져오기
    // TODO: API를 통해 마커 데이터 가져오기
  }, []);

  return {
    mapConfig,
    setMapConfig,
  };
};

