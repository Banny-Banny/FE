/**
 * useMapView Hook
 * MapView 컴포넌트의 모든 비즈니스 로직을 관리하는 커스텀 훅
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { WebView } from 'react-native-webview';

import {
  CAPSULE_SEARCH_LIMIT,
  CAPSULE_SEARCH_RADIUS_M,
  WEBVIEW_INIT_DELAY_MS,
  WEBVIEW_MARKER_DELAY_MS,
} from '../constants';
import type { CapsuleMarker, MapViewProps } from '../types';
import {
  createMapConfig,
  createMessageHandler,
  getKakaoMapApiKey,
  type MessageHandlerState,
} from '../utils';
import { generateKakaoMapHtml } from '../webview/generateHtml';
import type { WebViewToRNMessage } from '../webview/messageTypes';
import { sendInitMessage, sendSetMarkersMessage } from '../webview/sendMessage';
import { useCapsules } from './useCapsules';
import { useEggSlot } from './useEggSlot';
import { useMapLocation } from './useMapLocation';

export function useMapView({
  center,
  level,
  onMapClick,
  onMarkerClick,
  onCapsuleClick,
}: MapViewProps) {
  const webViewRef = useRef<WebView>(null);
  const { location, isLoading: locationLoading } = useMapLocation();
  const { slotData } = useEggSlot();

  const [mapCenterCoord, setMapCenterCoord] = useState<{ lat: number; lng: number } | null>(null);

  const kakaoMapApiKey = useMemo(() => getKakaoMapApiKey(), []);

  const htmlContent = useMemo(() => {
    if (!kakaoMapApiKey) return '';
    return generateKakaoMapHtml(kakaoMapApiKey);
  }, [kakaoMapApiKey]);

  const initialMapConfig = useMemo(() => {
    return createMapConfig(center, level, location);
  }, [center, level, location]);

  const mapCenter = mapCenterCoord || initialMapConfig.center;

  const { capsules, isLoading: capsulesLoading } = useCapsules({
    lat: mapCenter.lat,
    lng: mapCenter.lng,
    radius_m: CAPSULE_SEARCH_RADIUS_M,
    limit: CAPSULE_SEARCH_LIMIT,
  });

  const capsuleMarkers: CapsuleMarker[] = useMemo(() => {
    return capsules.map((capsule) => ({
      id: capsule.id,
      lat: capsule.latitude,
      lng: capsule.longitude,
      data: capsule,
    }));
  }, [capsules]);

  useEffect(() => {
    if (!kakaoMapApiKey) return;

    const timer = setTimeout(() => {
      sendInitMessage(webViewRef, {
        center: initialMapConfig.center,
        level: initialMapConfig.level,
      });
    }, WEBVIEW_INIT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [kakaoMapApiKey, initialMapConfig]);

  useEffect(() => {
    if (locationLoading || capsulesLoading || capsuleMarkers.length === 0) return;

    const timer = setTimeout(() => {
      sendSetMarkersMessage(
        webViewRef,
        capsuleMarkers.map((marker) => ({
          id: marker.id,
          lat: marker.lat,
          lng: marker.lng,
        })),
      );
    }, WEBVIEW_MARKER_DELAY_MS);

    return () => clearTimeout(timer);
  }, [locationLoading, capsulesLoading, capsuleMarkers]);

  const centerChangedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messageHandlerState: MessageHandlerState = useMemo(
    () => ({
      centerChangedTimerRef,
      capsuleMarkers,
    }),
    [capsuleMarkers],
  );

  const handleMessageCommon = useMemo(
    () =>
      createMessageHandler(
        {
          onMapClick,
          onMarkerClick,
          onCapsuleClick,
          onCenterChanged: setMapCenterCoord,
        },
        messageHandlerState,
      ),
    [onMapClick, onMarkerClick, onCapsuleClick, messageHandlerState],
  );

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const message = JSON.parse(event.nativeEvent.data) as WebViewToRNMessage;
        handleMessageCommon(message);
      } catch {
        // 메시지 파싱 실패 시 무시
      }
    },
    [handleMessageCommon],
  );

  const markersForWeb = useMemo(
    () =>
      capsuleMarkers.map((marker) => ({
        id: marker.id,
        lat: marker.lat,
        lng: marker.lng,
      })),
    [capsuleMarkers],
  );

  return {
    webViewRef,
    kakaoMapApiKey,
    htmlContent,
    initialMapConfig,
    mapCenter,
    location,
    locationLoading,
    slotData,
    markersForWeb,
    handleMessage,
    handleMessageCommon,
  };
}
