/**
 * Address Formatting Utilities
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Pure Functions] 카카오 주소 API 응답 데이터를 다양한 형식으로 포맷팅
 */

import type { KakaoAddressResponse } from '../commons/hooks/useKakaoAddress';

/**
 * 행정 구역 주소 포맷팅 (시/도, 시/군/구)
 * 예: "서울특별시 강남구"
 *
 * @param addressData - 카카오 주소 API 응답 데이터
 * @returns 포맷팅된 행정 구역 주소 또는 null
 */
export function formatAdministrativeAddress(
  addressData: KakaoAddressResponse | null,
): string | null {
  if (!addressData) {
    return null;
  }

  // address 객체에서 주소 추출 (일반 주소 우선, 없으면 도로명 주소)
  const address = addressData.address || addressData.road_address;

  if (address) {
    const sido = address.region_1depth_name; // 시/도
    const sigungu = address.region_2depth_name; // 시/군/구

    if (sido && sigungu) {
      return `${sido} ${sigungu}`;
    } else if (sido) {
      return sido;
    } else {
      // address_name이 있으면 사용
      const addressName = address.address_name;
      if (addressName) {
        // "서울특별시 강남구" 형식으로 파싱 시도
        const parts = addressName.split(' ');
        if (parts.length >= 2) {
          return `${parts[0]} ${parts[1]}`;
        } else {
          return addressName;
        }
      }
    }
  }

  return null;
}

/**
 * 도로명 주소 포맷팅
 * 예: "서울특별시 강남구 테헤란로 152"
 *
 * @param addressData - 카카오 주소 API 응답 데이터
 * @returns 포맷팅된 도로명 주소 또는 null
 */
export function formatRoadAddress(addressData: KakaoAddressResponse | null): string | null {
  if (!addressData) {
    return null;
  }

  // 도로명 주소 우선 사용
  const roadAddress = addressData.road_address;

  if (roadAddress && roadAddress.address_name) {
    return roadAddress.address_name;
  }

  // 도로명 주소가 없으면 일반 주소 사용
  const address = addressData.address;
  if (address && address.address_name) {
    return address.address_name;
  }

  return null;
}
