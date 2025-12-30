/**
 * MapView Component
 * Version: 1.0.0
 * Updated: 2025-01-XX
 */

import Constants from 'expo-constants';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import WebView from 'react-native-webview';

import CurrentLocation from '../current-location';
import { CurrentLocationMarker } from '../current-location-marker';
import { EggSlot } from '../egg-slot';
import { useCapsules } from './hooks/useCapsules';
import { useEggSlot } from './hooks/useEggSlot';
import { useMapLocation } from './hooks/useMapLocation';
import { styles } from './styles';
import type { CapsuleMarker, MapViewProps } from './types';
import { generateKakaoMapHtml } from './webview/generateHtml';
import { sendInitMessage, sendSetMarkersMessage } from './webview/messageHandler';
import type { WebViewToRNMessage } from './webview/messageTypes';

// 서울시청 기본값
const SEOUL_CITY_HALL = { lat: 37.5665, lng: 126.978 };

export default function MapView({
  center,
  level,
  onMapClick,
  onMarkerClick,
  onCapsuleClick,
}: MapViewProps = {}) {
  const webViewRef = useRef<WebView>(null);
  const { location, isLoading: locationLoading } = useMapLocation();
  const { slotData } = useEggSlot();

  // 지도 중심점 좌표 상태 (지도 이동 시 업데이트됨)
  const [mapCenterCoord, setMapCenterCoord] = useState<{ lat: number; lng: number } | null>(null);

  // 카카오 API 키를 가져와서 HTML에 주입 (메모이제이션)
  const kakaoMapApiKey = useMemo(() => {
    const key =
      Constants.expoConfig?.extra?.kakaoMapApiKey || process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY;

    return key;
  }, []);

  // HTML 콘텐츠 메모이제이션 (API 키가 변경될 때만 재생성)
  const htmlContent = useMemo(() => {
    if (!kakaoMapApiKey) return '';
    return generateKakaoMapHtml(kakaoMapApiKey);
  }, [kakaoMapApiKey]);

  // 지도 중심 좌표 결정: props center > 현재 위치 > 서울시청 기본값 (메모이제이션)
  const initialMapCenter = useMemo(() => {
    return center || location || SEOUL_CITY_HALL;
  }, [center, location]);

  // 지도 중심 좌표 (실시간 업데이트된 중심점 또는 초기값)
  const mapCenter = mapCenterCoord || initialMapCenter;

  // 캡슐 목록 조회 (위치가 있을 때만)
  const { capsules, isLoading: capsulesLoading } = useCapsules({
    lat: mapCenter.lat,
    lng: mapCenter.lng,
    radius_m: 300,
    limit: 50,
  });

  // 캡슐 데이터를 마커 형식으로 변환
  const capsuleMarkers: CapsuleMarker[] = useMemo(() => {
    return capsules.map((capsule) => ({
      id: capsule.id,
      lat: capsule.latitude,
      lng: capsule.longitude,
      data: capsule,
    }));
  }, [capsules]);

  // 지도 초기화: WebView 로드 후 실행
  useEffect(() => {
    if (!kakaoMapApiKey) return;

    const timer = setTimeout(() => {
      sendInitMessage(webViewRef, {
        center: initialMapCenter,
        level: level || 4,
      });
    }, 1000); // WebView 로드 대기

    return () => clearTimeout(timer);
  }, [kakaoMapApiKey, initialMapCenter, level]);

  // 캡슐 마커 표시
  useEffect(() => {
    if (locationLoading || capsulesLoading || capsuleMarkers.length === 0) return;

    const timer = setTimeout(() => {
      const markersForWebView = capsuleMarkers.map((marker) => ({
        id: marker.id,
        lat: marker.lat,
        lng: marker.lng,
      }));

      sendSetMarkersMessage(webViewRef, markersForWebView);
    }, 1500); // 지도 초기화 후 마커 표시

    return () => clearTimeout(timer);
  }, [locationLoading, capsulesLoading, capsuleMarkers]);

  // CENTER_CHANGED 이벤트 디바운싱을 위한 ref
  const centerChangedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // WebView로부터 메시지 수신 핸들러
  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const message = JSON.parse(event.nativeEvent.data) as WebViewToRNMessage;

        switch (message.type) {
          case 'READY':
            break;

          case 'CENTER_CHANGED':
            // 지도 중심점 변경 시 좌표 업데이트 (디바운싱: 500ms)
            if (centerChangedTimerRef.current) {
              clearTimeout(centerChangedTimerRef.current);
            }
            centerChangedTimerRef.current = setTimeout(() => {
              setMapCenterCoord(message.payload);
            }, 500);
            break;

          case 'MAP_CLICK':
            onMapClick?.(message.payload);
            break;

          case 'MARKER_CLICK': {
            // 마커 ID로 전체 데이터 찾기
            const clickedMarker = capsuleMarkers.find((m) => m.id === message.payload.id);
            if (clickedMarker) {
              onCapsuleClick?.(clickedMarker.data);
            }
            onMarkerClick?.(message.payload.id);
            break;
          }

          case 'WEB_ERROR':
          case 'WEB_WARN':
          case 'WEB_ONERROR':
            // WebView 에러는 개발 환경에서만 로깅
            if (__DEV__) {
              console.error(`[MapView][Web] ${message.type}:`, message.payload);
            }
            break;

          default:
            if (__DEV__) {
              console.warn('[MapView] 알 수 없는 메시지 타입:', (message as any).type);
            }
            break;
        }
      } catch (error) {
        // 메시지 파싱 실패 시 개발 환경에서만 로깅
        if (__DEV__) {
          console.error('[MapView] 메시지 파싱 실패:', error);
        }
      }
    },
    [capsuleMarkers, onMapClick, onMarkerClick, onCapsuleClick],
  );

  return (
    <View style={styles.container}>
      {!kakaoMapApiKey ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>카카오 API 키가 설정되지 않았습니다.</Text>
        </View>
      ) : (
        <>
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={handleMessage}
          />
          {/* Current Location Marker - WebView 내부에 표시 */}
          <CurrentLocationMarker
            webViewRef={webViewRef}
            location={location}
            isLoading={locationLoading}
          />
          {/* Current Location Indicator - 지도 중심점 기준 */}
          {mapCenter && (
            <View style={styles.currentLocationWrapper}>
              <CurrentLocation lat={mapCenter.lat} lng={mapCenter.lng} />
            </View>
          )}
          {/* Egg Slot Indicator */}
          <EggSlot usedCount={slotData.usedCount} totalCount={slotData.totalCount} />
        </>
      )}
    </View>
  );
}
