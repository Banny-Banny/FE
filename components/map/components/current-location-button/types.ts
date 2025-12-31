/**
 * CurrentLocationButton Component Types
 * Version: 1.0.0
 * Created: 2025-01-XX
 */

import type { WebView } from 'react-native-webview';

export interface CurrentLocationButtonProps {
  /**
   * WebView ref (Native 환경용)
   */
  webViewRef?: React.RefObject<WebView | null>;
  /**
   * 현재 위치 좌표
   */
  location: { lat: number; lng: number } | null;
  /**
   * 위치 로딩 상태
   */
  isLoading?: boolean;
  /**
   * 웹 환경에서 지도 이동 함수 (Web 환경용)
   */
  onMoveToLocation?: (location: { lat: number; lng: number }) => void;
}
