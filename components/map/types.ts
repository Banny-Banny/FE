/**
 * components/map/types.ts
 * 지도 기능 전반에서 사용하는 타입 정의
 */

export interface MapLocation {
  latitude: number;
  longitude: number;
}

export interface MapRegion extends MapLocation {
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapFeatureProps {
  // 필요시 추가
}

