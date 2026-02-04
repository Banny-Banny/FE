/**
 * Easter Egg Modal Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 이스터에그 모달의 비즈니스 로직
 * - 미디어 URL 변환
 * - 주소 변환
 * - 오디오/비디오 재생 상태 관리
 * - 날짜 포맷팅
 * - 발견 순서 계산
 */

import { useKakaoAddress } from '@/commons/hooks/useKakaoAddress';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { getMediaUrl, isValidImageUrl } from '@/utils';
import { formatRoadAddress } from '@/utils/addressFormat';
import { useEffect, useMemo, useState } from 'react';

import type { EggDetailResponse } from '../../../hooks/useEggDetail';

export interface UseEasterEggModalProps {
  data: EggDetailResponse | null;
}

export interface UseEasterEggModalReturn {
  // 사용자 정보
  user: ReturnType<typeof useAuth>['user'];

  // 미디어 관련
  mediaUrls: {
    imageUrl: string | null;
  };

  // 주소 관련
  locationAddress: string;
  isAddressLoading: boolean;

  // 프로필 이미지
  authorProfileImg: string | null;

  // 날짜 포맷팅
  createdDate: string;
  foundDate: string | null;
  formatShortDate: (dateString: string) => string;
  formatShortDateWithTime: (dateString: string) => string;

  // 발견 순서 관련
  getDiscoveryOrderText: () => string | null;
  getCurrentUserViewedAt: () => string | null;
}

/**
 * 이스터에그 모달의 비즈니스 로직을 관리하는 Hook
 */
export function useEasterEggModal({ data }: UseEasterEggModalProps): UseEasterEggModalReturn {
  // 현재 사용자 정보
  const { user } = useAuth();

  // 미디어 URL 상태 관리 (이미지만 URL로 변환, 오디오/비디오는 각각의 Player 컴포넌트에서 처리)
  const [mediaUrls, setMediaUrls] = useState<{
    imageUrl: string | null;
  }>({
    imageUrl: null,
  });

  // 미디어 ID를 URL로 변환 (이미지만)
  useEffect(() => {
    if (!data) {
      setMediaUrls({
        imageUrl: null,
      });
      return;
    }

    const fetchMediaUrls = async () => {
      try {
        const imageUrl = data.imageMediaId
          ? await getMediaUrl(data.imageMediaId).catch(() => null)
          : null;

        setMediaUrls({ imageUrl });
      } catch (error) {
        if (__DEV__) {
        }
        setMediaUrls({
          imageUrl: null,
        });
      }
    };

    fetchMediaUrls();
  }, [data]);

  // 주소 변환 (useKakaoAddress 훅 사용)
  const { addressData: kakaoAddressData, isLoading: isAddressLoading } = useKakaoAddress({
    lat: data?.location.latitude ?? null,
    lng: data?.location.longitude ?? null,
  });

  // 주소 결정: location.address가 있으면 우선 사용, 없으면 카카오 주소 변환 결과 사용
  const locationAddress = useMemo(() => {
    return (
      data?.location.address ||
      (kakaoAddressData ? formatRoadAddress(kakaoAddressData) : null) ||
      '위치 정보 없음'
    );
  }, [data?.location.address, kakaoAddressData]);

  // 프로필 이미지 URL 유효성 검사
  const authorProfileImg = useMemo(() => {
    return isValidImageUrl(data?.author.profileImg) ? data?.author.profileImg || null : null;
  }, [data?.author.profileImg]);

  // 날짜 포맷팅 (MM.DD 형식)
  const formatShortDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };

  // 날짜 포맷팅 (MM.DD HH:mm 형식)
  const formatShortDateWithTime = (dateString: string): string => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}.${day} ${hours}:${minutes}`;
  };

  // 생성 날짜
  const createdDate = useMemo(() => {
    return data ? formatShortDate(data.createdAt) : '';
  }, [data?.createdAt]);

  // 발견 날짜 (FOUND 타입일 때만)
  const foundDate = useMemo(() => {
    return data?.type === 'FOUND' && data.foundAt ? formatShortDate(data.foundAt) : null;
  }, [data?.type, data?.foundAt]);

  // 발견 순서 텍스트 (FOUND 타입일 때만)
  const getDiscoveryOrderText = (): string | null => {
    if (data?.type === 'FOUND' && data.viewers && data.viewers.length > 0 && user?.id) {
      const currentUserIndex = data.viewers.findIndex((viewer) => viewer.id === user.id);
      if (currentUserIndex === -1) {
        return null;
      }

      const maxViewCount = data.discoveredCount || 3;

      if (currentUserIndex === 0) {
        return '첫 번째';
      }
      if (currentUserIndex === 1) {
        return '두 번째';
      }
      if (currentUserIndex === maxViewCount - 1) {
        return '마지막';
      }
      return `${currentUserIndex + 1}번째`;
    }
    return null;
  };

  // 현재 사용자의 발견 날짜 및 시간 (FOUND 타입일 때만)
  const getCurrentUserViewedAt = (): string | null => {
    if (data?.type === 'FOUND' && data.viewers && data.viewers.length > 0 && user?.id) {
      const currentUser = data.viewers.find((viewer) => viewer.id === user.id);
      if (currentUser?.viewedAt) {
        return formatShortDateWithTime(currentUser.viewedAt);
      }
    }
    return null;
  };

  return {
    // 사용자 정보
    user,

    // 미디어 관련
    mediaUrls,

    // 주소 관련
    locationAddress,
    isAddressLoading,

    // 프로필 이미지
    authorProfileImg,

    // 날짜 포맷팅
    createdDate,
    foundDate,
    formatShortDate,
    formatShortDateWithTime,

    // 발견 순서 관련
    getDiscoveryOrderText,
    getCurrentUserViewedAt,
  };
}
