/**
 * My Eggs API Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 내 알 목록 조회 API 통신
 * - GET /api/capsules/my-eggs?type={type}&sort={sort} 엔드포인트 호출
 * - react-query를 사용한 데이터 페칭
 * - API 응답을 UI 타입으로 변환
 */

import { API_ENDPOINTS, queryKeys } from '@/commons/constants';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { formatRoadAddress } from '@/utils/addressFormat';
import { apiClient } from '@/utils/apiClient';
import { buildEndpointWithQuery } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';

import type {
  EasterEggItem,
  FoundEggItem,
  FoundEggsResponse,
  PlantedEggItem,
  PlantedEggsResponse,
} from '../types';
import type { KakaoAddressResponse } from '@/commons/hooks/useKakaoAddress';

export interface UseMyEggsParams {
  type: 'PLANTED' | 'FOUND';
  sort?: 'LATEST' | 'OLDEST';
}

export interface UseMyEggsReturn {
  /** 알 목록 데이터 */
  items: EasterEggItem[];
  /** 요약 정보 (카운트 등) */
  summary: {
    totalPlantedCount?: number;
    activeCount?: number;
    totalFoundCount?: number;
  } | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 데이터 재조회 함수 */
  refetch: () => Promise<void>;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return dateString;
  }
};

/**
 * 카카오 주소 API를 사용하여 좌표를 주소로 변환
 */
const convertCoordinatesToAddress = async (
  lat: number,
  lng: number,
): Promise<string | null> => {
  try {
    // 좌표 유효성 검증
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      if (__DEV__) {
        console.warn('[useMyEggs] 유효하지 않은 좌표:', { lat, lng });
      }
      return null;
    }

    const kakaoApiKey =
      Constants.expoConfig?.extra?.kakaoRestApiKey ||
      process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;

    if (!kakaoApiKey) {
      if (__DEV__) {
        console.warn('[useMyEggs] 카카오 API 키가 설정되지 않았습니다.');
      }
      return null;
    }

    // 카카오 API는 경도(x), 위도(y) 순서로 받습니다
    const response = await axios.get('https://dapi.kakao.com/v2/local/geo/coord2address.json', {
      params: {
        x: String(lng), // 경도 (문자열로 변환)
        y: String(lat), // 위도 (문자열로 변환)
      },
      headers: {
        Authorization: `KakaoAK ${kakaoApiKey}`,
      },
    });

    const documents = response.data?.documents;
    if (documents && documents.length > 0) {
      const firstDoc = documents[0];
      const addressData: KakaoAddressResponse = {
        address: firstDoc.address || null,
        road_address: firstDoc.road_address || null,
      };
      const address = formatRoadAddress(addressData);
      return address || '위치 정보 없음';
    }
    return null;
  } catch (error) {
    if (__DEV__) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;
        console.error('[useMyEggs] 주소 변환 실패:', {
          status,
          error: errorData,
          lat,
          lng,
          message: error.message,
        });
      } else {
        console.error('[useMyEggs] 주소 변환 실패:', error);
      }
    }
    return null;
  }
};

/**
 * location을 문자열로 변환
 * location 문자열이 있으면 우선 사용, 없으면 latitude/longitude를 카카오 주소 API로 변환
 */
const formatLocation = async (
  location: string | { lat: number; lng: number } | null | undefined,
  latitude?: number,
  longitude?: number,
): Promise<string> => {
  // location 문자열이 있으면 우선 사용
  if (location && typeof location === 'string') {
    return location;
  }

  // latitude/longitude가 있으면 카카오 주소 API로 변환
  if (latitude !== undefined && longitude !== undefined) {
    const address = await convertCoordinatesToAddress(latitude, longitude);
    if (address) {
      return address;
    }
    // 변환 실패 시 좌표 문자열 반환
    return `${latitude}, ${longitude}`;
  }

  if (!location) {
    return '위치 정보 없음';
  }

  // 객체인 경우 주소 정보가 없으므로 좌표를 문자열로 변환
  if (typeof location === 'object' && 'lat' in location && 'lng' in location) {
    const address = await convertCoordinatesToAddress(location.lat, location.lng);
    if (address) {
      return address;
    }
    return `${location.lat}, ${location.lng}`;
  }
  return '위치 정보 없음';
};

/**
 * PlantedEggItem을 EasterEggItem으로 변환 (주소는 나중에 변환)
 */
const transformPlantedEggItem = (
  item: PlantedEggItem,
  addressMap: Map<string, string>,
): EasterEggItem => {
  const itemKey = `${item.eggId}-location`;
  const location =
    addressMap.get(itemKey) ||
    (item.location && typeof item.location === 'string'
      ? item.location
      : item.latitude !== undefined && item.longitude !== undefined
        ? `${item.latitude}, ${item.longitude}`
        : '위치 정보 없음');

  return {
    id: item.eggId,
    title: item.title,
    description: item.content || '',
    location,
    date: formatDate(item.createdDate),
    eggIcon: require('@/assets/images/filled_egg.svg'),
    hasImage: item.hasImage,
    hasAudio: item.hasAudio,
    viewCount: item.viewCount,
    status: item.status,
  };
};

/**
 * FoundEggItem을 EasterEggItem으로 변환 (주소는 나중에 변환)
 */
const transformFoundEggItem = (
  item: FoundEggItem,
  addressMap: Map<string, string>,
): EasterEggItem => {
  // foundDate를 포맷팅하여 "발견한 날: YYYY-MM-DD" 형식으로 변환
  const formattedDate = formatDate(item.foundDate);
  const dateWithLabel = `발견한 날: ${formattedDate}`;

  const itemKey = `${item.eggId}-location`;
  const location =
    addressMap.get(itemKey) ||
    (item.location && typeof item.location === 'string'
      ? item.location
      : item.latitude !== undefined && item.longitude !== undefined
        ? `${item.latitude}, ${item.longitude}`
        : '위치 정보 없음');

  return {
    id: item.eggId,
    title: item.title,
    description: item.content || '',
    location,
    date: dateWithLabel,
    eggIcon: require('@/assets/images/filled_egg.svg'),
    hasImage: item.hasImage,
    hasAudio: item.hasAudio,
    viewCount: item.viewCount,
  };
};

/**
 * 내 알 목록을 조회하는 Hook
 *
 * @param params 조회 파라미터
 * @returns 알 목록, 요약 정보, 로딩 상태, 에러, 재조회 함수
 */
export function useMyEggs(params: UseMyEggsParams): UseMyEggsReturn {
  const { accessToken, isLoading: authLoading } = useAuth();

  const {
    data,
    isLoading,
    error,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: queryKeys.myEggs({ type: params.type, sort: params.sort }),
    queryFn: async () => {
      // 인증 토큰이 없으면 API 호출하지 않음
      if (!accessToken) {
        if (__DEV__) {
          console.warn('[useMyEggs] 토큰이 없어 API 호출을 건너뜁니다.');
        }
        return null;
      }

      // 쿼리 파라미터 구성
      const queryParams: Record<string, string> = {
        type: params.type,
      };
      if (params.sort) {
        queryParams.sort = params.sort;
      }

      const endpoint = buildEndpointWithQuery(API_ENDPOINTS.CAPSULE.MY_EGGS, queryParams);

      if (params.type === 'PLANTED') {
        const response = await apiClient.get<PlantedEggsResponse>(endpoint);
        return response.data;
      } else {
        const response = await apiClient.get<FoundEggsResponse>(endpoint);
        return response.data;
      }
    },
    enabled: !!accessToken && !authLoading && !!params.type,
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });

  // 주소 변환 맵 (itemId -> address)
  const [addressMap, setAddressMap] = useState<Map<string, string>>(new Map());

  // 주소 변환 로직
  useEffect(() => {
    if (!data) {
      return;
    }

    const convertAddresses = async () => {
      const newAddressMap = new Map<string, string>();
      const itemsToConvert: Array<{ key: string; lat: number; lng: number }> = [];

      if (params.type === 'PLANTED') {
        const response = data as PlantedEggsResponse;
        [...response.data.activeEggs, ...response.data.expiredEggs].forEach((item) => {
          const itemKey = `${item.eggId}-location`;
          // location 문자열이 있으면 그대로 사용
          if (item.location && typeof item.location === 'string') {
            newAddressMap.set(itemKey, item.location);
          }
          // latitude/longitude가 있으면 주소 변환 필요
          else if (item.latitude !== undefined && item.longitude !== undefined) {
            itemsToConvert.push({
              key: itemKey,
              lat: item.latitude,
              lng: item.longitude,
            });
          }
        });
      } else {
        const response = data as FoundEggsResponse;
        response.data.forEach((item) => {
          const itemKey = `${item.eggId}-location`;
          // location 문자열이 있으면 그대로 사용
          if (item.location && typeof item.location === 'string') {
            newAddressMap.set(itemKey, item.location);
          }
          // latitude/longitude가 있으면 주소 변환 필요
          else if (item.latitude !== undefined && item.longitude !== undefined) {
            itemsToConvert.push({
              key: itemKey,
              lat: item.latitude,
              lng: item.longitude,
            });
          }
        });
      }

      // 주소 변환 (순차적으로 처리하여 API 호출 제한 고려)
      for (const item of itemsToConvert) {
        const address = await convertCoordinatesToAddress(item.lat, item.lng);
        if (address) {
          newAddressMap.set(item.key, address);
        } else {
          // 변환 실패 시 좌표 문자열 사용
          newAddressMap.set(item.key, `${item.lat}, ${item.lng}`);
        }
        // API 호출 제한을 고려하여 약간의 딜레이 추가
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setAddressMap(newAddressMap);
    };

    convertAddresses();
  }, [data, params.type]);

  // API 응답을 UI 타입으로 변환
  const items: EasterEggItem[] = useMemo(() => {
    if (!data) {
      return [];
    }

    if (params.type === 'PLANTED') {
      const response = data as PlantedEggsResponse;
      const activeItems = response.data.activeEggs.map((item) =>
        transformPlantedEggItem(item, addressMap),
      );
      const expiredItems = response.data.expiredEggs.map((item) =>
        transformPlantedEggItem(item, addressMap),
      );
      // 활성 알과 소멸된 알을 합치기 (활성 알이 먼저)
      return [...activeItems, ...expiredItems];
    } else {
      const response = data as FoundEggsResponse;
      return response.data.map((item) => transformFoundEggItem(item, addressMap));
    }
  }, [data, params.type, addressMap]);

  // 요약 정보 추출
  const summary = useMemo(() => {
    if (!data) {
      return null;
    }

    if (params.type === 'PLANTED') {
      const response = data as PlantedEggsResponse;
      return {
        totalPlantedCount: response.summary.totalPlantedCount,
        activeCount: response.summary.activeCount,
      };
    } else {
      const response = data as FoundEggsResponse;
      return {
        totalFoundCount: response.summary.totalFoundCount,
      };
    }
  }, [data, params.type]);

  const refetch = async () => {
    if (accessToken) {
      await refetchQuery();
    }
  };

  return {
    items,
    summary,
    isLoading: isLoading || authLoading,
    error: error
      ? (() => {
          if (error instanceof AxiosError) {
            return (
              error.response?.data?.message ||
              '알 목록을 불러오는 중 오류가 발생했습니다.'
            );
          }
          if (error instanceof Error) {
            return error.message;
          }
          return '알 목록을 불러오는 중 오류가 발생했습니다.';
        })()
      : null,
    refetch,
  };
}

