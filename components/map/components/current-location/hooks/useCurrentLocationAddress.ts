/**
 * Current Location Address Hook
 * Version: 2.0.0
 * Created: 2025-01-XX
 * Updated: 2025-01-XX
 *
 * [Business Logic] 행정 구역 주소(시/도, 시/군/구)를 반환하는 Hook
 * - 공통 훅(useKakaoAddress) 사용
 * - 행정 구역 주소 포맷팅 적용
 */

import { useKakaoAddress } from '@/commons/hooks/useKakaoAddress';
import { formatAdministrativeAddress } from '@/utils/addressFormat';

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
 * 행정 구역 주소(시/도, 시/군/구)를 반환하는 Hook
 *
 * @param params - 위도(lat)와 경도(lng)
 * @returns 행정 구역 주소, 로딩 상태, 에러 상태
 */
export function useCurrentLocationAddress({
  lat,
  lng,
}: UseCurrentLocationAddressParams): UseCurrentLocationAddressReturn {
  const { addressData, isLoading, error } = useKakaoAddress({ lat, lng });

  const address = formatAdministrativeAddress(addressData);

  return {
    address,
    isLoading,
    error,
  };
}
