/**
 * Current Location Marker Component
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Design System] 현재 위치 커스텀 마커 컴포넌트
 *
 * React Native 컴포넌트로 현재 위치 마커의 스타일을 관리하고,
 * WebView로 메시지를 전달하여 카카오맵에 마커를 표시합니다.
 */

import { useEffect, useRef } from 'react';
import type { WebView } from 'react-native-webview';
import { DEFAULT_MARKER_CONFIG } from './styles';
import type { CurrentLocationMarkerConfig, LocationCoordinate } from './types';

export interface CurrentLocationMarkerProps {
  /**
   * WebView ref - MapView에서 관리하는 WebView 인스턴스
   */
  webViewRef: React.RefObject<WebView>;
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
    if (!webViewRef.current || isLoading || !location) return;

    const timer = setTimeout(() => {
      if (webViewRef.current && location) {
        try {
          webViewRef.current.postMessage(
            JSON.stringify({
              type: 'SET_CURRENT_LOCATION',
              payload: {
                location,
                style: {
                  ...DEFAULT_MARKER_CONFIG,
                  ...style,
                },
              },
            }),
          );
          console.log('[CurrentLocationMarker] 현재 위치 커스텀 마커 표시 완료:', location);
        } catch (error) {
          console.error('[CurrentLocationMarker] 현재 위치 마커 표시 실패:', error);
        }
      }
    }, 3000); // 지도 및 일반 마커 표시 후 현재 위치 마커 표시

    return () => clearTimeout(timer);
  }, [location, isLoading, style, webViewRef]);

  // 컴포넌트 언마운트 시 마커 제거
  useEffect(() => {
    return () => {
      if (webViewRef.current) {
        try {
          webViewRef.current.postMessage(
            JSON.stringify({
              type: 'REMOVE_CURRENT_LOCATION',
            }),
          );
        } catch (error) {
          console.error('[CurrentLocationMarker] 마커 제거 실패:', error);
        }
      }
    };
  }, [webViewRef]);

  // 이 컴포넌트는 UI를 렌더링하지 않습니다 (WebView 내부에 마커를 표시)
  return null;
}

