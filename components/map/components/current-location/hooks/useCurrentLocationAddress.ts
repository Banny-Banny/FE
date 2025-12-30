/**
 * Current Location Address Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 카카오 로컬 API를 사용하여 위도/경도를 주소로 변환
 * - 카카오 로컬 API (coord2address) 호출
 * - 행정 구역 주소 추출 및 반환
 */

import axios from 'axios';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

export interface UseCurrentLocationAddressParams {
  lat: number;
  lng: number;
}

export interface UseCurrentLocationAddressReturn {
  address: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 카카오 로컬 API를 사용하여 위도/경도를 주소로 변환하는 Hook
 *
 * @param params - 위도(lat)와 경도(lng)
 * @returns 주소, 로딩 상태, 에러 상태
 */
export function useCurrentLocationAddress({
  lat,
  lng,
}: UseCurrentLocationAddressParams): UseCurrentLocationAddressReturn {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 위도/경도가 유효하지 않으면 API 호출하지 않음
    if (!lat || !lng) {
      return;
    }

    const fetchAddress = async () => {
      // 카카오 API 키 가져오기 (catch 블록에서도 접근 가능하도록 상위 스코프에 선언)
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

          // address 객체에서 주소 추출 (일반 주소 우선, 없으면 도로명 주소)
          const address = firstDoc.address || firstDoc.road_address;

          if (address) {
            const sido = address.region_1depth_name; // 시/도
            const sigungu = address.region_2depth_name; // 시/군/구

            if (sido && sigungu) {
              setAddress(`${sido} ${sigungu}`);
            } else if (sido) {
              setAddress(sido);
            } else {
              // address_name이 있으면 사용
              const addressName = address.address_name;
              if (addressName) {
                // "서울특별시 강남구" 형식으로 파싱 시도
                const parts = addressName.split(' ');
                if (parts.length >= 2) {
                  setAddress(`${parts[0]} ${parts[1]}`);
                } else {
                  setAddress(addressName);
                }
              } else {
                setAddress(null);
              }
            }
          } else {
            setAddress(null);
          }
        } else {
          setAddress(null);
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
    address,
    isLoading,
    error,
  };
}
