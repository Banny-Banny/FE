/**
 * components/map/components/egg-detail-find/hooks/useEggDetailFind.ts
 * 이스터에그 발견 모달 비즈니스 로직 Hook
 *
 * @description
 * - 발견 데이터 조회 (API)
 * - 오디오 재생 상태 관리
 * - 미디어 타입별 처리
 */

import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { getMediaUrls } from '@/utils/mediaUrl';

import type { CapsuleDetailResponse } from '../../egg-detail-owner/types';
import type { MediaItem } from '../../shared/types';
import type { DiscoveryOrder, EggDetailFindProps, EggDiscoveryData } from '../types';

export interface UseEggDetailFindReturn {
  /** 발견 데이터 */
  discoveryData: EggDiscoveryData | null;
  /** 오디오 재생 중 여부 */
  isPlaying: boolean;
  /** 오디오 재생 시간 (초) */
  currentTime: number;
  /** 오디오 전체 시간 (초) */
  duration: number;
  /** 오디오 재생/일시정지 토글 */
  togglePlay: () => void;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  error: string | null;
}

/**
 * 발견 순서 계산
 * @param viewersLength 현재 열람자 수 (viewers 배열 길이)
 * @param viewLimit 최대 열람 횟수
 * @returns 발견 순서
 */
function calculateDiscoveryOrder(viewersLength: number, viewLimit: number): DiscoveryOrder {
  if (viewersLength === 1) {
    return 'first';
  } else if (viewersLength === viewLimit) {
    return 'last';
  } else {
    return 'second';
  }
}

/**
 * URL인지 미디어 ID인지 확인하는 함수
 * URL은 http:// 또는 https://로 시작하거나, data:로 시작하는 data URL
 */
function isUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:');
}

/**
 * API 응답 데이터를 EggDiscoveryData로 변환
 * 미디어 URL이 ID인 경우 URL로 변환하지 않고 그대로 사용 (비동기 변환은 Hook에서 처리)
 */
function transformCapsuleDetailToDiscoveryData(
  detailData: CapsuleDetailResponse,
): EggDiscoveryData {
  // 발견 순서 계산 (viewers 배열 길이 사용)
  const viewersLength = detailData.viewers?.length || 0;
  const viewLimit = detailData.view_limit || 3; // 기본값 3
  const discoveryOrder = calculateDiscoveryOrder(viewersLength, viewLimit);

  // 날짜 포맷팅 (MM.DD 형식)
  const createdAt = dayjs(detailData.created_at).format('MM.DD');

  // 미디어 데이터 변환
  const media: MediaItem[] = [];
  if (detailData.media_urls && detailData.media_types) {
    for (let i = 0; i < detailData.media_urls.length; i++) {
      const url = detailData.media_urls[i];
      const type = detailData.media_types[i];
      if (url && type) {
        media.push({
          id: `media-${i}`,
          type: type as MediaItem['type'],
          url, // URL 또는 ID (Hook에서 변환)
        });
      }
    }
  }

  return {
    eggId: detailData.id,
    discoveryOrder,
    author: {
      name: detailData.author.nickname || '익명',
      emoji: '🎁', // 기본 이모지 (API에서 제공되지 않으면 기본값)
    },
    createdAt,
    title: detailData.title || '제목 없음',
    content: detailData.content || '',
    media,
    viewCount: {
      current: viewersLength,
      max: viewLimit,
    },
    isExpiring: discoveryOrder === 'last',
  };
}

/**
 * 이스터에그 발견 모달 데이터 및 상태를 관리하는 Hook
 */
export function useEggDetailFind({
  visible,
  data,
  detailData,
  isLoading,
  error,
}: Pick<EggDetailFindProps, 'visible' | 'data'> & {
  detailData: CapsuleDetailResponse | null;
  isLoading: boolean;
  error: string | null;
}): UseEggDetailFindReturn {
  // API 데이터를 EggDiscoveryData로 변환 (초기 변환)
  const initialDiscoveryData = useMemo(() => {
    // props로 전달된 data가 있으면 우선 사용
    if (data) {
      return data;
    }

    // API 데이터가 있으면 변환
    if (detailData) {
      return transformCapsuleDetailToDiscoveryData(detailData);
    }

    return null;
  }, [data, detailData]);

  // 미디어 URL 변환 상태
  const [discoveryData, setDiscoveryData] = useState<EggDiscoveryData | null>(initialDiscoveryData);

  // 미디어 URL 변환 (ID인 경우 URL로 변환)
  useEffect(() => {
    if (!initialDiscoveryData || !initialDiscoveryData.media.length) {
      setDiscoveryData(initialDiscoveryData);
      return;
    }

    // 미디어 URL이 이미 URL인지 확인
    const needsConversion = initialDiscoveryData.media.some((m) => !isUrl(m.url));

    if (!needsConversion) {
      // 이미 URL이면 그대로 사용
      setDiscoveryData(initialDiscoveryData);
      return;
    }

    // 미디어 ID를 URL로 변환
    const convertMediaUrls = async () => {
      try {
        const mediaIds = initialDiscoveryData.media.map((m) => m.url);
        const convertedUrls = await getMediaUrls(mediaIds);

        // 변환된 URL로 미디어 데이터 업데이트
        const updatedMedia: MediaItem[] = initialDiscoveryData.media.map((m, index) => ({
          ...m,
          url: convertedUrls[index] || m.url,
        }));

        setDiscoveryData({
          ...initialDiscoveryData,
          media: updatedMedia,
        });
      } catch (err) {
        if (__DEV__) {
          console.error('[useEggDetailFind] 미디어 URL 변환 실패:', err);
        }
        // 변환 실패 시 원본 데이터 사용
        setDiscoveryData(initialDiscoveryData);
      }
    };

    convertMediaUrls();
  }, [initialDiscoveryData]);

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
    isLoading,
    error,
  };
}
