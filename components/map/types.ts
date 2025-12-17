/**
 * Map Feature Types
 * Version: 1.0.0
 * Created: 2025-12-17
 *
 * Map 기능 전반에서 사용하는 타입 정의
 */

export interface MapCoordinate {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
}

export interface MapConfig {
  center: MapCoordinate;
  level?: number;
}

export interface MapFeatureProps {
  onEasterEggPress?: () => void;
  onTimeCapsulePress?: () => void;
}
