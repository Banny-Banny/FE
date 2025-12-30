/**
 * Current Location Marker Component
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Feature Component] 현재 위치 커스텀 마커
 *
 * MapView에서 사용하는 현재 위치 마커 컴포넌트
 * WebView와 통신하여 카카오맵에 마커를 표시합니다.
 */

import { useEffect } from 'react';
import type { WebView } from 'react-native-webview';

import {
  sendRemoveCurrentLocationMessage,
  sendSetCurrentLocationMessage,
} from '../map-view/webview/messageHandler';
import { DEFAULT_MARKER_CONFIG } from './styles';
import type { CurrentLocationMarkerConfig, LocationCoordinate } from './types';

export interface CurrentLocationMarkerProps {
  /**
   * WebView ref - MapView에서 관리하는 WebView 인스턴스
   */
  webViewRef: React.RefObject<WebView | null>;
  /**
   * 현재 위치 좌표
   */
  location: LocationCoordinate | null;
  /**
   * 마커 스타일 설정 (선택사항)
   */
  style?: CurrentLocationMarkerConfig;
  /**
   * 로딩 상태
   */
  isLoading?: boolean;
}

/**
 * 현재 위치 커스텀 마커 컴포넌트
 *
 * @example
 * ```tsx
 * <CurrentLocationMarker
 *   webViewRef={webViewRef}
 *   location={{ lat: 37.5665, lng: 126.978 }}
 *   style={{ width: 20, height: 20, backgroundColor: '#3B82F6' }}
 * />
 * ```
 */
export function CurrentLocationMarker({
  webViewRef,
  location,
  style = DEFAULT_MARKER_CONFIG,
  isLoading = false,
}: CurrentLocationMarkerProps) {
  // 현재 위치 마커 표시
  useEffect(() => {
    if (isLoading || !location) return;

    const timer = setTimeout(() => {
      const mergedStyle = {
        ...DEFAULT_MARKER_CONFIG,
        ...style,
      };

      sendSetCurrentLocationMessage(webViewRef, {
        location,
        style: mergedStyle,
      });
    }, 2000); // 지도 및 일반 마커 표시 후 현재 위치 마커 표시

    return () => clearTimeout(timer);
  }, [location, isLoading, style, webViewRef]);

  // 컴포넌트 언마운트 시 마커 제거
  useEffect(() => {
    return () => {
      sendRemoveCurrentLocationMessage(webViewRef);
    };
  }, [webViewRef]);

  return null;
}
