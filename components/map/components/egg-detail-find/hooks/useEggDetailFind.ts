/**
 * components/map/components/egg-detail-find/hooks/useEggDetailFind.ts
 * 이스터에그 발견 모달 비즈니스 로직 Hook
 *
 * @description
 * - 발견 데이터 조회 (API 또는 Mock)
 * - 오디오 재생 상태 관리
 * - 미디어 타입별 처리
 */

import { useState } from 'react';

import { MOCK_DATA_FIRST, MOCK_DATA_LAST, MOCK_DATA_SECOND } from '../constants';
import type { EggDetailFindProps, EggDiscoveryData } from '../types';

export interface UseEggDetailFindReturn {
  /** 발견 데이터 */
  discoveryData: EggDiscoveryData;
  /** 오디오 재생 중 여부 */
  isPlaying: boolean;
  /** 오디오 재생 시간 (초) */
  currentTime: number;
  /** 오디오 전체 시간 (초) */
  duration: number;
  /** 오디오 재생/일시정지 토글 */
  togglePlay: () => void;
}

/**
 * 이스터에그 발견 모달 데이터 및 상태를 관리하는 Hook
 */
export function useEggDetailFind({
  visible,
  data,
}: Pick<EggDetailFindProps, 'visible' | 'data'>): UseEggDetailFindReturn {
  // TODO: API 연동 시 여기서 발견 데이터를 가져옴
  // 현재는 Mock 데이터 사용
  // 발견 순서에 따라 다른 Mock 데이터 사용
  const getMockData = (): EggDiscoveryData => {
    if (data) {
      return data;
    }
    // 랜덤하게 Mock 데이터 선택 (실제로는 API에서 받아온 데이터 사용)
    const random = Math.floor(Math.random() * 3);
    if (random === 0) {
      return MOCK_DATA_FIRST;
    } else if (random === 1) {
      return MOCK_DATA_SECOND;
    } else {
      return MOCK_DATA_LAST;
    }
  };

  const discoveryData = getMockData();

  // 오디오 재생 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 오디오 재생/일시정지 토글
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    // TODO: 실제 오디오 플레이어 연동
  };

  return {
    discoveryData,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
  };
}
