/**
 * components/map/components/current-location-marker/types.ts
 * Current Location Marker Types
 * Version: 1.0.0
 * Created: 2025-01-XX
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
}
