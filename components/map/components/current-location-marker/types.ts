/**
 * components/map/components/current-location-marker/types.ts
 * Current Location Marker Types
 * Version: 1.0.0
 * Updated: 2025-01-XX
 */

export interface LocationCoordinate {
  lat: number;
  lng: number;
}

export interface CurrentLocationMarkerConfig {
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: string;
  boxShadow?: string;
  /**
   * 반경 원 표시 여부
   * @default true
   */
  showRadius?: boolean;
  /**
   * 반경 원 크기 (미터 단위)
   * @default 300
   */
  radiusMeters?: number;
  /**
   * 반경 원 색상 (rgba 형식)
   * @default 'rgba(66,133,244,0.1)'
   */
  radiusColor?: string;
  /**
   * 반경 원 테두리 색상
   * @default 'rgba(66,133,244,0.2)'
   */
  radiusStrokeColor?: string;
  /**
   * 반경 원 테두리 두께
   * @default 1
   */
  radiusStrokeWeight?: number;
}
