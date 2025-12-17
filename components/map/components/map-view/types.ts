/**
 * components/map/components/map-view/types.ts
 * MapView 컴포넌트의 Props 타입
 */

import { MapRegion } from '../../types';

export interface MapViewProps {
  region: MapRegion;
  onRegionChange?: (region: MapRegion) => void;
}

