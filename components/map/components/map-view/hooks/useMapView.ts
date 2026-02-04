/**
 * useMapView Hook
 * MapView 컴포넌트의 모든 비즈니스 로직을 관리하는 커스텀 훅
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { WebView } from 'react-native-webview';

import { useMapGestures } from '@/commons/hooks/useMapGestures';

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
import {
  sendInitMessage,
  sendSetMarkersMessage,
  sendSetZoomLevelMessage,
} from '../webview/sendMessage';
import { useCapsules } from './useCapsules';
import { useMapLocation } from './useMapLocation';

/**
 * scale 값을 카카오맵 level로 변환
 * scale 0.5 -> level 14 (최대 축소)
 * scale 1.0 -> level 4 (기본)
 * scale 1.5 -> level 3 (한 단계 확대)
 * scale 2.0 -> level 2 (한 단계 확대)
 * scale 2.5 -> level 1 (한 단계 확대)
 * scale 3.0 -> level 1 (최대 확대)
 *
 * scale이 0.5씩 증가할 때마다 level이 1씩 감소
 */
function scaleToLevel(scale: number): number {
  // scale 범위: 0.5 ~ 3.0
  // level 범위: 1 ~ 14 (낮을수록 확대)
  const minLevel = 1;
  const maxLevel = 14;

  // scale 1.0 → level 4를 기준으로
  // scale이 0.5씩 증가할 때마다 level이 1씩 감소
  // scale 1.0 → level 4
  // scale 1.5 → level 3
  // scale 2.0 → level 2
  // scale 2.5 → level 1
  // scale 3.0 → level 1 (최대 확대)

  if (scale <= 1.0) {
    // scale 0.5 → level 14, scale 1.0 → level 4
    const ratio = (scale - 0.5) / (1.0 - 0.5); // 0 ~ 1
    const level = Math.round(14 - ratio * (14 - 4));
    return Math.max(minLevel, Math.min(maxLevel, level));
  } else {
    // scale 1.0 → level 4
    // scale 1.5 → level 3 (scale이 0.5 증가하면 level이 1 감소)
    // scale 2.0 → level 2
    // scale 2.5 → level 1
    // scale 3.0 → level 1 (최대 확대)
    const steps = (scale - 1.0) / 0.5; // 0, 1, 2, 3, 4
    const level = Math.max(1, Math.round(4 - steps));
    return Math.max(minLevel, Math.min(maxLevel, level));
  }
}

/**
 * 카카오맵 level을 scale 값으로 변환 (역함수)
 * level 14 -> scale 0.5 (최대 축소)
 * level 4 -> scale 1.0 (기본)
 * level 3 -> scale 1.5 (한 단계 확대)
 * level 2 -> scale 2.0 (한 단계 확대)
 * level 1 -> scale 2.5 (한 단계 확대)
 */
function levelToScale(level: number): number {
  const minScale = 0.5;
  const maxScale = 3.0;

  if (level >= 4) {
    // level 14 → scale 0.5, level 4 → scale 1.0
    const ratio = (level - 4) / (14 - 4); // 0 ~ 1
    const scale = 1.0 - ratio * (1.0 - 0.5);
    return Math.max(minScale, Math.min(maxScale, scale));
  } else {
    // level 4 → scale 1.0
    // level 3 → scale 1.5
    // level 2 → scale 2.0
    // level 1 → scale 2.5
    const steps = 4 - level; // 0, 1, 2, 3
    const scale = 1.0 + steps * 0.5;
    return Math.max(minScale, Math.min(maxScale, scale));
  }
}

export function useMapView({
  center,
  level,
  onMapClick,
  onMarkerClick,
  onCapsuleClick,
  onEggSlotPress,
}: MapViewProps) {
  const webViewRef = useRef<WebView>(null);
  const { location, isLoading: locationLoading } = useMapLocation();
  const { scale, setScale, handleZoomIn, handleZoomOut, resetZoom } = useMapGestures();

  const [mapCenterCoord, setMapCenterCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false); // ✅ iOS: HTML 로드 완료 추적

  const kakaoMapApiKey = useMemo(() => getKakaoMapApiKey(), []);

  const htmlContent = useMemo(() => {
    if (!kakaoMapApiKey) return '';
    return generateKakaoMapHtml(kakaoMapApiKey);
  }, [kakaoMapApiKey]);

  // scale에 따른 줌 레벨 계산
  const zoomLevel = useMemo(() => {
    return scaleToLevel(scale);
  }, [scale]);

  const initialMapConfig = useMemo(() => {
    return createMapConfig(center, level || zoomLevel, location);
  }, [center, level, location, zoomLevel]);

  const mapCenter = mapCenterCoord || initialMapConfig.center;

  // 현재 위치 기준으로 캡슐 조회 (지도 중심점이 아닌 실제 사용자 위치 사용)
  const { capsules, isLoading: capsulesLoading } = useCapsules({
    lat: location?.lat || initialMapConfig.center.lat,
    lng: location?.lng || initialMapConfig.center.lng,
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

  // ✅ iOS 대응: WebView HTML 로드 완료 후에만 INIT 메시지 전송
  useEffect(() => {
    if (!kakaoMapApiKey || !isWebViewLoaded) return;

    // WebView 초기화 시 ready 상태 리셋
    setIsWebViewReady(false);

    const timer = setTimeout(() => {
      sendInitMessage(webViewRef, {
        center: initialMapConfig.center,
        level: initialMapConfig.level,
      });
    }, WEBVIEW_INIT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [kakaoMapApiKey, initialMapConfig, isWebViewLoaded]);

  // 줌 레벨 변경 시 WebView에 전달
  useEffect(() => {
    if (!webViewRef.current) return;

    sendSetZoomLevelMessage(webViewRef, {
      level: zoomLevel,
      scale,
    });
  }, [zoomLevel, scale]);

  // 리셋 함수: scale을 1로 리셋하고 level 4로 명시적으로 설정
  const handleResetZoom = useCallback(() => {
    resetZoom(); // scale을 1로 리셋
    // level 4를 명시적으로 설정
    sendSetZoomLevelMessage(webViewRef, {
      level: 4,
      scale: 1,
    });
  }, [resetZoom]);

  // ✅ 최대 대기 시간 (3초) - mount 1회만 실행하여 스피너 무한 방지
  useEffect(() => {
    const maxWaitTimer = setTimeout(() => {
      setIsInitialLoadComplete(true);
    }, 3000);

    return () => clearTimeout(maxWaitTimer);
  }, []); // 빈 의존성 배열로 mount 시 1회만 실행

  // ✅ 모든 데이터가 준비되면 더 빨리 로딩 완료
  useEffect(() => {
    if (isWebViewReady && !locationLoading && !capsulesLoading) {
      const timer = setTimeout(() => {
        setIsInitialLoadComplete(true);
      }, WEBVIEW_MARKER_DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, [isWebViewReady, locationLoading, capsulesLoading]);

  // 마커 전송 (초기 로딩과 별개)
  useEffect(() => {
    if (locationLoading || capsulesLoading || capsuleMarkers.length === 0) return;

    const timer = setTimeout(() => {
      sendSetMarkersMessage(
        webViewRef,
        capsuleMarkers.map((marker) => ({
          id: marker.id,
          lat: marker.lat,
          lng: marker.lng,
          type: marker.data.type,
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
          onZoomChanged: (level: number) => {
            // 제스처 줌(핀치 줌)으로 level이 변경되면 scale 업데이트
            const newScale = levelToScale(level);
            setScale(newScale);
          },
          onReady: () => {
            setIsWebViewReady(true);
          },
        },
        messageHandlerState,
      ),
    [onMapClick, onMarkerClick, onCapsuleClick, messageHandlerState, setScale],
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
        type: marker.data.type,
      })),
    [capsuleMarkers],
  );

  // ✅ iOS: WebView HTML 로드 완료 콜백
  const handleWebViewLoad = useCallback(() => {
    setIsWebViewLoaded(true);
  }, []);

  return {
    webViewRef,
    kakaoMapApiKey,
    htmlContent,
    initialMapConfig,
    mapCenter,
    location,
    locationLoading,
    markersForWeb,
    handleMessage,
    handleMessageCommon,
    handleWebViewLoad, // ✅ iOS 대응
    isWebViewReady,
    isInitialLoadComplete,
    // 줌 제어
    scale,
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    resetZoom: handleResetZoom,
  };
}
