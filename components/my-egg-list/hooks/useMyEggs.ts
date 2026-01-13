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
import { buildEndpointWithQuery } from '@/utils/api';
import { apiClient } from '@/utils/apiClient';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import { useEffect, useMemo, useState } from 'react';

import type { KakaoAddressResponse } from '@/commons/hooks/useKakaoAddress';
import type {
  EasterEggItem,
  FoundEggItem,
  FoundEggsResponse,
  PlantedEggItem,
  PlantedEggsResponse,
} from '../types';

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
 * 변환 실패 시 null 반환 (호출부에서 좌표 문자열로 대체)
 */
const convertCoordinatesToAddress = async (lat: number, lng: number): Promise<string | null> => {
  try {
    // 좌표 유효성 검증
    if (
      lat === undefined ||
      lng === undefined ||
      lat === null ||
      lng === null ||
      isNaN(lat) ||
      isNaN(lng)
    ) {
      if (__DEV__) {
      }
      return null;
    }

    const kakaoApiKey =
      Constants.expoConfig?.extra?.kakaoRestApiKey || process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;

    if (!kakaoApiKey) {
      if (__DEV__) {
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
      return address || null; // 변환 실패 시 null 반환
    }
    return null;
  } catch (error) {
    if (__DEV__) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;
      } else {
      }
    }
    return null;
  }
};

/**
 * PlantedEggItem을 EasterEggItem으로 변환
 * location 필드는 무시하고 무조건 latitude/longitude 기반으로 주소 계산
 */
const transformPlantedEggItem = (
  item: PlantedEggItem,
  addressMap: Map<string, string>,
): EasterEggItem => {
  const itemKey = `${item.eggId}-location`;
  // addressMap에 변환된 주소가 있으면 사용
  const mappedLocation = addressMap.get(itemKey);
  let location: string | undefined;

  if (mappedLocation) {
    // 변환된 주소가 있으면 사용
    location = mappedLocation;
  } else if (item.latitude !== undefined && item.longitude !== undefined) {
    // latitude/longitude가 있으면 좌표 문자열로 표시 (주소 변환 실패 시)
    location = `${item.latitude}, ${item.longitude}`;
  }
  // latitude/longitude가 없으면 undefined (optional 처리)

  return {
    id: item.eggId,
    title: item.title,
    description: item.content || '',
    location,
    date: formatDate(item.createdDate),
    eggIcon: require('@/assets/images/filled_egg.svg'),
    hasImage: item.hasImage,
    hasAudio: item.hasAudio,
    hasVideo: item.hasVideo,
    viewCount: item.viewCount,
    status: item.status,
  };
};

/**
 * FoundEggItem을 EasterEggItem으로 변환
 * location 필드는 무시하고 무조건 latitude/longitude 기반으로 주소 계산
 */
const transformFoundEggItem = (
  item: FoundEggItem,
  addressMap: Map<string, string>,
): EasterEggItem => {
  // foundDate를 포맷팅하여 YYYY-MM-DD 형식으로 변환
  const formattedDate = formatDate(item.foundDate);

  const itemKey = `${item.eggId}-location`;
  // addressMap에 변환된 주소가 있으면 사용
  const mappedLocation = addressMap.get(itemKey);
  let location: string | undefined;

  if (mappedLocation) {
    // 변환된 주소가 있으면 사용
    location = mappedLocation;
  } else if (item.latitude !== undefined && item.longitude !== undefined) {
    // latitude/longitude가 있으면 좌표 문자열로 표시 (주소 변환 실패 시)
    location = `${item.latitude}, ${item.longitude}`;
  }
  // latitude/longitude가 없으면 undefined (optional 처리)

  return {
    id: item.eggId,
    title: item.title,
    description: item.content || '',
    location,
    date: formattedDate,
    eggIcon: require('@/assets/images/filled_egg.svg'),
    hasImage: item.hasImage,
    hasAudio: item.hasAudio,
    hasVideo: item.hasVideo,
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
          // location 필드는 무시하고 무조건 latitude/longitude만 사용
          if (item.latitude !== undefined && item.longitude !== undefined) {
            itemsToConvert.push({
              key: itemKey,
              lat: item.latitude,
              lng: item.longitude,
            });
          }
          // latitude/longitude가 없으면 변환하지 않음 (undefined로 처리됨)
        });
      } else {
        const response = data as FoundEggsResponse;
        response.data.forEach((item) => {
          const itemKey = `${item.eggId}-location`;
          // location 필드는 무시하고 무조건 latitude/longitude만 사용
          if (item.latitude !== undefined && item.longitude !== undefined) {
            itemsToConvert.push({
              key: itemKey,
              lat: item.latitude,
              lng: item.longitude,
            });
          }
          // latitude/longitude가 없으면 변환하지 않음 (undefined로 처리됨)
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
            return error.response?.data?.message || '알 목록을 불러오는 중 오류가 발생했습니다.';
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
