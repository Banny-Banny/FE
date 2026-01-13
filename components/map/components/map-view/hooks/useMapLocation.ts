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
import { Platform } from 'react-native';

import { DEFAULT_MAP_CENTER } from '../constants/mapConfig';

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

      // 네이티브 모듈이 없으면 고정값으로 대체 (안드로이드 에뮬레이터 대응)
      if (!Location) {
        const errorMessage = '위치 서비스를 사용할 수 없습니다. 네이티브 빌드가 필요합니다.';
        setError(errorMessage);
        // 안드로이드 에뮬레이터 등에서 위치를 불러오지 못할 때 고정값 사용
        setLocation({
          lat: DEFAULT_MAP_CENTER.lat,
          lng: DEFAULT_MAP_CENTER.lng,
        });
        setIsLoading(false);
        if (__DEV__) {
        }
        return;
      }

      // 위치 서비스 활성화 여부 확인 (iOS에서만)
      if (Platform.OS === 'ios') {
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationEnabled) {
          const errorMessage =
            '위치 서비스가 꺼져 있습니다. 설정에서 위치 서비스를 활성화해주세요.';
          setError(errorMessage);
          // 위치 서비스가 꺼져 있을 때 고정값 사용
          setLocation({
            lat: DEFAULT_MAP_CENTER.lat,
            lng: DEFAULT_MAP_CENTER.lng,
          });
          setIsLoading(false);
          if (__DEV__) {
          }
          return;
        }
      }

      // 위치 권한 상태 확인
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (__DEV__) {
      }

      if (status !== 'granted') {
        const errorMessage = '위치 권한이 거부되었습니다.';
        setError(errorMessage);
        // 위치 권한이 거부되었을 때 고정값 사용
        setLocation({
          lat: DEFAULT_MAP_CENTER.lat,
          lng: DEFAULT_MAP_CENTER.lng,
        });
        setIsLoading(false);
        if (__DEV__) {
        }
        return;
      }

      // 현재 위치 가져오기
      // 타임아웃 처리를 위해 Promise.race 사용
      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('위치를 가져오는 데 시간이 너무 오래 걸립니다.')), 10000);
      });

      const currentLocation = await Promise.race([locationPromise, timeoutPromise]);

      if (__DEV__) {
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
      // 위치 가져오기 실패 시 고정값 사용 (안드로이드 에뮬레이터 타임아웃 등 대응)
      setLocation({
        lat: DEFAULT_MAP_CENTER.lat,
        lng: DEFAULT_MAP_CENTER.lng,
      });
      setIsLoading(false);
      if (__DEV__) {
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
