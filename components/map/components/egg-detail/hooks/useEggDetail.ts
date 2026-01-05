/**
 * components/map/components/egg-detail/hooks/useEggDetail.ts
 * 이스터에그 상세 컴포넌트 비즈니스 로직 Hook
 *
 * @description
 * - 날짜 포맷팅 로직
 * - 위치 정보 처리 로직
 * - 발견 기록 수 관리
 */

import dayjs from 'dayjs';
import { useMemo } from 'react';

import type { CapsuleItem } from '../../map-view/types';

export interface UseEggDetailReturn {
  formattedDate: string;
  locationText: string;
  discoveryCount: number;
}

export interface UseEggDetailProps {
  capsule: CapsuleItem | null;
}

/**
 * 이스터에그 상세 정보를 처리하는 Hook
 */
export function useEggDetail({ capsule }: UseEggDetailProps): UseEggDetailReturn {
  // 날짜 포맷팅 (YYYY.MM.DD 형식) - open_at을 숨긴 날짜로 사용
  const formattedDate = useMemo(() => {
    if (!capsule?.open_at) return '날짜 정보 없음';
    return dayjs(capsule.open_at).format('YYYY.MM.DD');
  }, [capsule?.open_at]);

  // 위치 정보 (임시로 "위치 정보 없음" 표시, 추후 API 연동 시 수정)
  const locationText = useMemo(() => {
    // 추후 API에서 위치 정보를 받아올 수 있으면 사용
    return '위치 정보 없음';
  }, []);

  // 발견 기록 수 (현재는 0으로 고정, 추후 API 연동 시 수정)
  const discoveryCount = 0;

  return {
    formattedDate,
    locationText,
    discoveryCount,
  };
}
