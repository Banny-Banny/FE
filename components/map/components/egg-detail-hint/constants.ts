/**
 * components/map/components/egg-detail-hint/constants.ts
 * 이스터에그 힌트 컴포넌트 상수 정의
 *
 * @description
 * - 하드코딩된 값들을 상수로 분리
 * - Mock data 및 설정값 정의
 */

import { calculateDirection } from '@/utils/coordinate';

import type { CapsuleItem } from '../map-view/types';

// Mock data (API 적용 전 임시 데이터)
// 실제 API 응답 구조(CapsuleItem)를 기반으로 생성
export const MOCK_HINT_DATA: {
  title: string;
  distance: number;
  direction: number;
} = {
  title: '근처에 이스터에그가 있어요!',
  distance: 70, // 미터 단위
  direction: 45, // 방향 각도 (0-360도, 북쪽이 0도, 시계방향)
};

/**
 * CapsuleItem에서 힌트 데이터 생성 (API 연동 시 사용)
 * @param capsule 캡슐 정보
 * @param currentLocation 현재 위치
 * @returns 힌트 데이터
 */
export function createHintDataFromCapsule(
  capsule: CapsuleItem,
  currentLocation?: { lat: number; lng: number },
): {
  title: string;
  distance: number;
  direction?: number;
} {
  const distance = capsule.distance_m ?? 0;
  let direction: number | undefined;

  // 현재 위치가 있으면 방향 계산
  if (currentLocation) {
    direction = calculateDirection(currentLocation, {
      lat: capsule.latitude,
      lng: capsule.longitude,
    });
  }

  return {
    title: capsule.title || '근처에 이스터에그가 있어요!',
    distance,
    direction,
  };
}

// 토스트 표시 시간 (밀리초)
export const DURATION_MS = 10000; // 10초

// 프로그레스 바 너비 계산용
export const PROGRESS_CONTAINER_WIDTH = 234; // 전체 너비 260px - 패딩 26px
