/**
 * utils/coordinate.ts
 * 좌표 관련 계산 유틸리티 (순수 함수)
 *
 * @description
 * - 두 좌표 간 방향 각도 계산
 * - 좌표 관련 수학 계산
 */

export interface Coordinate {
  lat: number;
  lng: number;
}

/**
 * 두 좌표 간 방향 각도 계산 (베어링)
 * @param from 시작 좌표
 * @param to 목표 좌표
 * @returns 방향 각도 (0-360도, 북쪽이 0도, 시계방향)
 */
export function calculateDirection(from: Coordinate, to: Coordinate): number {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const deltaLng = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

  const bearing = Math.atan2(y, x);
  const bearingDegrees = (bearing * 180) / Math.PI;

  // 0-360도 범위로 정규화
  return (bearingDegrees + 360) % 360;
}
