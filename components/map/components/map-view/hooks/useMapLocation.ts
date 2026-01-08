/**
 * Map Location Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 지도 위치 권한 및 현재 위치 관리
 * - 위치 권한 요청
 * - 현재 위치 좌표 가져오기
 */

import { useEffect, useState } from 'react';

// 네이티브 모듈이 없을 때를 대비한 안전한 import
let Location: typeof import('expo-location') | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Location = require('expo-location');
} catch (error) {
  // expo-location 모듈을 찾을 수 없음
}

export interface LocationCoordinate {
  lat: number;
  lng: number;
}

export interface UseMapLocationReturn {
  location: LocationCoordinate | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
}

/**
 * 위치 권한을 요청하고 현재 위치를 가져오는 Hook
 */
export function useMapLocation(): UseMapLocationReturn {
  const [location, setLocation] = useState<LocationCoordinate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 네이티브 모듈이 없으면 에러 처리
      if (!Location) {
        const errorMessage = '위치 서비스를 사용할 수 없습니다. 네이티브 빌드가 필요합니다.';
        setError(errorMessage);
        setIsLoading(false);
        if (__DEV__) {
          console.error('[useMapLocation] Location module not available');
        }
        return;
      }

      // 위치 서비스 활성화 여부 확인 (iOS에서만)
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        const errorMessage = '위치 서비스가 꺼져 있습니다. 설정에서 위치 서비스를 활성화해주세요.';
        setError(errorMessage);
        setIsLoading(false);
        if (__DEV__) {
          console.warn('[useMapLocation] Location services are disabled');
        }
        return;
      }

      // 위치 권한 상태 확인
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (__DEV__) {
        console.log('[useMapLocation] Permission status:', status);
      }

      if (status !== 'granted') {
        const errorMessage = '위치 권한이 거부되었습니다.';
        setError(errorMessage);
        setIsLoading(false);
        if (__DEV__) {
          console.warn('[useMapLocation] Location permission denied:', status);
        }
        return;
      }

      // 현재 위치 가져오기
      // iOS 시뮬레이터에서도 작동하도록 timeout 추가
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000, // 10초 타임아웃
      });

      if (__DEV__) {
        console.log('[useMapLocation] Location obtained:', {
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude,
        });
      }

      setLocation({
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
      });
      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '위치를 가져오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsLoading(false);
      if (__DEV__) {
        console.error('[useMapLocation] Error getting location:', err);
      }
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return {
    location,
    isLoading,
    error,
    requestPermission,
  };
}
