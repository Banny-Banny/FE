/**
 * Road Address Hook
 * Version: 2.0.0
 * Created: 2025-01-XX
 * Updated: 2025-01-XX
 *
 * [Business Logic] 도로명 주소를 반환하는 Hook
 * - 공통 훅(useKakaoAddress) 사용
 * - 도로명 주소 포맷팅 적용
 */

import { useKakaoAddress } from '@/commons/hooks/useKakaoAddress';
import { formatRoadAddress } from '@/utils/addressFormat';

export interface UseRoadAddressParams {
  lat: number | null;
  lng: number | null;
}

export interface UseRoadAddressReturn {
  address: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 도로명 주소를 반환하는 Hook
 *
 * @param params - 위도(lat)와 경도(lng)
 * @returns 도로명 주소, 로딩 상태, 에러 상태
 */
export function useRoadAddress({ lat, lng }: UseRoadAddressParams): UseRoadAddressReturn {
  const { addressData, isLoading, error } = useKakaoAddress({ lat, lng });

  const address = formatRoadAddress(addressData);

  return {
    address,
    isLoading,
    error,
  };
}
