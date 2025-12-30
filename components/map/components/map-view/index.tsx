/**
 * MapView Component
 * Version: 1.0.0
 * Updated: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] nativewind 토큰 참조만 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 */

import Constants from 'expo-constants';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import WebView from 'react-native-webview';
import CurrentLocation from '../current-location';
import { EggSlot } from '../egg-slot';
import { useCapsules } from './hooks/useCapsules';
import { useMapLocation } from './hooks/useMapLocation';
import { KAKAO_MAP_HTML } from './kakaoMapHtml';
import { styles } from './styles';
import type { CapsuleMarker, MapViewProps } from './types';

// 서울시청 기준 주변 5개 지점 고정 데이터 (기본값)
const SEOUL_CITY_HALL = { lat: 37.5665, lng: 126.978 };

// Mock 데이터: 사용된 egg-slot 개수 (총 3개 중 2개 사용)
const MOCK_EGG_SLOT_USED_COUNT = 2;

export default function MapView({ center, level, onMapClick, onMarkerClick }: MapViewProps = {}) {
  const webViewRef = useRef<WebView>(null);
  const { location, isLoading: locationLoading } = useMapLocation();

  // 지도 중심점 좌표 상태 (지도 이동 시 업데이트됨)
  const [mapCenterCoord, setMapCenterCoord] = useState<{ lat: number; lng: number } | null>(null);

  // 지도 중심 좌표 결정: props center > 현재 위치 > 서울시청 기본값
  const initialMapCenter = center || location || SEOUL_CITY_HALL;

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

  // 카카오 API 키를 가져와서 HTML에 주입
  const kakaoMapApiKey =
    Constants.expoConfig?.extra?.kakaoMapApiKey || process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY;

  if (!kakaoMapApiKey) {
    console.error(
      '[MapView] 카카오 API 키가 설정되지 않았습니다. EXPO_PUBLIC_KAKAO_MAP_API_KEY를 확인하세요.',
    );
  } else {
    console.log('[MapView] 카카오 API 키 로드 완료:', kakaoMapApiKey.substring(0, 10) + '...');
  }

  const htmlContent = useMemo(
    () => KAKAO_MAP_HTML.replace('__KAKAO_JS_KEY__', kakaoMapApiKey),
    [kakaoMapApiKey],
  );

  // 웹뷰 콘솔/에러를 RN으로 전달해 디버깅 (iOS에서 맵 미표시 원인 추적용)
  const errorBridgeScript = useMemo(
    () => `
      (function() {
        const send = (type, payload) => {
          if (window.ReactNativeWebView?.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
          }
        };
        const origError = console.error;
        console.error = function() {
          send('WEB_ERROR', Array.from(arguments).map(String).join(' '));
          origError && origError.apply(console, arguments);
        };
        const origWarn = console.warn;
        console.warn = function() {
          send('WEB_WARN', Array.from(arguments).map(String).join(' '));
          origWarn && origWarn.apply(console, arguments);
        };
        window.onerror = function(message, source, lineno, colno, error) {
          send('WEB_ONERROR', { message, source, lineno, colno, error: error?.message });
        };
      })();
    `,
    [],
  );

  useEffect(() => {
    // 지도 초기화 메시지 전송
    // WebView가 로드된 후에 메시지를 보내야 함
    const timer = setTimeout(() => {
      if (webViewRef.current) {
        console.log('[MapView] INIT 메시지 전송 시도');
        try {
          webViewRef.current.postMessage(
            JSON.stringify({
              type: 'INIT',
              payload: {
                center: initialMapCenter,
                level: level || 4,
              },
            }),
          );
          console.log('[MapView] INIT 메시지 전송 완료');
        } catch (error) {
          console.error('[MapView] INIT 메시지 전송 실패:', error);
        }
      } else {
        console.warn('[MapView] webViewRef가 아직 준비되지 않음');
      }
    }, 2000); // WebView 로드 대기 시간 증가

    return () => clearTimeout(timer);
  }, [initialMapCenter, level]);

  // 캡슐 마커 표시 (API 응답 데이터 사용)
  useEffect(() => {
    if (!webViewRef.current || locationLoading || capsulesLoading || capsuleMarkers.length === 0)
      return;

    const timer = setTimeout(() => {
      if (webViewRef.current) {
        try {
          // WebView로 전달할 때는 id, lat, lng만 전달하고, 전체 데이터는 별도로 관리
          const markersForWebView = capsuleMarkers.map((marker) => ({
            id: marker.id,
            lat: marker.lat,
            lng: marker.lng,
          }));

          webViewRef.current.postMessage(
            JSON.stringify({
              type: 'SET_MARKERS',
              payload: markersForWebView,
            }),
          );
          console.log('[MapView] 캡슐 마커 표시 완료:', capsuleMarkers.length, '개');
        } catch (error) {
          console.error('[MapView] 마커 표시 실패:', error);
        }
      }
    }, 2500); // 지도 초기화 후 마커 표시

    return () => clearTimeout(timer);
  }, [locationLoading, capsulesLoading, capsuleMarkers]);

  // 현재 위치 커스텀 마커 표시
  useEffect(() => {
    if (!webViewRef.current || locationLoading || !location) return;

    const timer = setTimeout(() => {
      if (webViewRef.current && location) {
        try {
          webViewRef.current.postMessage(
            JSON.stringify({
              type: 'SET_CURRENT_LOCATION',
              payload: location,
            }),
          );
          console.log('[MapView] 현재 위치 커스텀 마커 표시 완료:', location);
        } catch (error) {
          console.error('[MapView] 현재 위치 마커 표시 실패:', error);
        }
      }
    }, 3000); // 지도 및 일반 마커 표시 후 현재 위치 마커 표시

    return () => clearTimeout(timer);
  }, [location, locationLoading]);

  // WebView로부터 메시지 수신
  const handleMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', message);

      switch (message.type) {
        case 'READY':
          console.log('Map is ready');
          break;
        case 'CENTER_CHANGED':
          // 지도 중심점 변경 시 좌표 업데이트
          setMapCenterCoord(message.payload);
          break;
        case 'MAP_CLICK':
          console.log('Map clicked:', message.payload);
          onMapClick?.(message.payload);
          break;
        case 'MARKER_CLICK':
          console.log('Marker clicked:', message.payload);
          // 마커 ID로 전체 데이터 찾기
          const clickedMarker = capsuleMarkers.find((m) => m.id === message.payload.id);
          if (clickedMarker) {
            console.log('[MapView] 마커 전체 데이터:', clickedMarker.data);
          }
          onMarkerClick?.(message.payload.id);
          break;
        case 'WEB_ERROR':
          console.error('[MapView][Web] ERROR:', message.payload);
          break;
        case 'WEB_WARN':
          console.warn('[MapView][Web] WARN:', message.payload);
          break;
        case 'WEB_ONERROR':
          console.error('[MapView][Web] ONERROR:', message.payload);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  };

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
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('[MapView] WebView error:', nativeEvent);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('[MapView] WebView HTTP error:', nativeEvent);
            }}
            onLoadStart={() => {
              console.log('[MapView] WebView 로드 시작');
            }}
            onLoadEnd={() => {
              console.log('[MapView] WebView 로드 완료');
            }}
          />
          {/* Current Location Indicator - 지도 중심점 기준 */}
          {mapCenter && (
            <View style={styles.currentLocationWrapper}>
              <CurrentLocation lat={mapCenter.lat} lng={mapCenter.lng} />
            </View>
          )}
          {/* Egg Slot Indicator */}
          <EggSlot usedCount={MOCK_EGG_SLOT_USED_COUNT} totalCount={3} />
        </>
      )}
    </View>
  );
}
