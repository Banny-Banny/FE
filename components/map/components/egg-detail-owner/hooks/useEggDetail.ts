/**
 * components/map/components/egg-detail-owner/hooks/useEggDetail.ts
 * 이스터에그 상세 컴포넌트 비즈니스 로직 Hook
 *
 * @description
 * - 날짜 포맷팅 로직
 * - 위치 정보 처리 로직
 * - 발견 기록 수 관리
 * - 상세 API 호출 및 데이터 바인딩
 */

import dayjs from 'dayjs';
import { useMemo } from 'react';

import type { CapsuleItem } from '@/components/map/components/map-view/types';
import { useCapsuleDetail } from './useCapsuleDetail';
import { useRoadAddress } from './useRoadAddress';

export interface UseEggDetailReturn {
  formattedDate: string;
  locationText: string;
  discoveryCount: number;
  authorNickname: string;
  viewers: Array<{ id: string; nickname: string; viewed_at: string }>;
  isLoading: boolean;
  error: string | null;
}

export interface UseEggDetailProps {
  capsule: CapsuleItem | null;
  currentLocation: { lat: number; lng: number } | null;
}

/**
 * 이스터에그 상세 정보를 처리하는 Hook
 */
export function useEggDetail({ capsule, currentLocation }: UseEggDetailProps): UseEggDetailReturn {
  // 상세 API 호출
  const {
    data: detailData,
    isLoading,
    error,
  } = useCapsuleDetail({
    capsuleId: capsule?.id || null,
    lat: currentLocation?.lat || null,
    lng: currentLocation?.lng || null,
  });

  // 주소 변환 (상세 API에서 받은 latitude, longitude 사용)
  const { address: roadAddress } = useRoadAddress({
    lat: detailData?.latitude || null,
    lng: detailData?.longitude || null,
  });

  // 날짜 포맷팅 (YYYY.MM.DD 형식) - created_at 사용
  const formattedDate = useMemo(() => {
    if (!detailData?.created_at) return '날짜 정보 없음';
    return dayjs(detailData.created_at).format('YYYY.MM.DD');
  }, [detailData?.created_at]);

  // 위치 정보 (도로명 주소)
  const locationText = useMemo(() => {
    if (roadAddress) {
      return roadAddress;
    }
    return '위치 정보 없음';
  }, [roadAddress]);

  // 발견 기록 수 (view_count 사용)
  const discoveryCount = useMemo(() => {
    return detailData?.view_count || 0;
  }, [detailData?.view_count]);

  // 작성자 닉네임
  const authorNickname = useMemo(() => {
    return detailData?.author?.nickname || '';
  }, [detailData?.author?.nickname]);

  // 발견자 리스트
  const viewers = useMemo(() => {
    return detailData?.viewers || [];
  }, [detailData?.viewers]);

  return {
    formattedDate,
    locationText,
    discoveryCount,
    authorNickname,
    viewers,
    isLoading,
    error,
  };
}
