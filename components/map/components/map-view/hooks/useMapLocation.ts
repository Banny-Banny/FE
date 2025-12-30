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
import * as Location from 'expo-location';

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

      // 위치 권한 상태 확인
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('위치 권한이 거부되었습니다.');
        setIsLoading(false);
        return;
      }

      // 현재 위치 가져오기
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
      });
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '위치를 가져오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsLoading(false);
      console.error('[useMapLocation] 위치 가져오기 실패:', err);
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

