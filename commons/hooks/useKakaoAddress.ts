/**
 * Kakao Address API Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 카카오 로컬 API를 사용하여 위도/경도를 주소로 변환하는 공통 훅
 * - 카카오 로컬 API (coord2address) 호출
 * - 원시 주소 데이터 반환 (포맷팅은 별도 유틸 함수 사용)
 */

import axios from 'axios';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

export interface KakaoAddressResponse {
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_4depth_name: string;
    region_type: string;
    code: string;
  } | null;
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
  } | null;
}

export interface UseKakaoAddressParams {
  lat: number | null;
  lng: number | null;
}

export interface UseKakaoAddressReturn {
  addressData: KakaoAddressResponse | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 카카오 로컬 API를 사용하여 위도/경도를 주소로 변환하는 공통 훅
 *
 * @param params - 위도(lat)와 경도(lng)
 * @returns 원시 주소 데이터, 로딩 상태, 에러 상태
 */
export function useKakaoAddress({ lat, lng }: UseKakaoAddressParams): UseKakaoAddressReturn {
  const [addressData, setAddressData] = useState<KakaoAddressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 위도/경도가 유효하지 않으면 API 호출하지 않음
    if (!lat || !lng) {
      setAddressData(null);
      return;
    }

    const fetchAddress = async () => {
      // 카카오 API 키 가져오기
      const kakaoApiKey =
        Constants.expoConfig?.extra?.kakaoRestApiKey || process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;

      try {
        setIsLoading(true);
        setError(null);

        if (!kakaoApiKey) {
          throw new Error('카카오 API 키가 설정되지 않았습니다.');
        }

        // 카카오 로컬 API 호출 (카카오 데브톡 권장 방식)
        const response = await axios.get('https://dapi.kakao.com/v2/local/geo/coord2address.json', {
          params: {
            x: lng, // 경도
            y: lat, // 위도
          },
          headers: {
            Authorization: `KakaoAK ${kakaoApiKey}`,
          },
        });

        // 응답 데이터에서 주소 추출
        const documents = response.data?.documents;
        if (documents && documents.length > 0) {
          const firstDoc = documents[0];
          setAddressData({
            address: firstDoc.address || null,
            road_address: firstDoc.road_address || null,
          });
        } else {
          setAddressData(null);
        }

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);

        if (axios.isAxiosError(err)) {
          const status = err.response?.status;

          if (status === 401) {
            const errorMessage = '카카오 API 인증 실패. API 키와 도메인/IP 등록을 확인하세요.';
            setError(errorMessage);
          } else {
            const errorMessage =
              err.response?.data?.message ||
              `주소를 가져오는 중 오류가 발생했습니다. (${status || 'Network Error'})`;
            setError(errorMessage);
          }
        } else {
          const errorMessage =
            err instanceof Error ? err.message : '주소를 가져오는 중 오류가 발생했습니다.';
          setError(errorMessage);
        }
      }
    };

    fetchAddress();
  }, [lat, lng]);

  return {
    addressData,
    isLoading,
    error,
  };
}
