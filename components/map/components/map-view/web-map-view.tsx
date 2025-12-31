/**
 * Web MapView Component
 * 웹 환경에서 카카오 지도를 직접 렌더링하는 컴포넌트
 */

import { useCallback, useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';

import { DEFAULT_MARKER_STYLE_FOR_WEBVIEW } from '../current-location-marker/styles';
import { DEFAULT_MAP_LEVEL } from './constants';
import { styles } from './styles';
import type { MapViewProps } from './types';
import { getKakaoMapApiKey } from './utils';

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: any) => any;
        LatLng: new (lat: number, lng: number) => any;
        Marker: new (options: any) => any;
        CustomOverlay: new (options: any) => any;
        Circle: new (options: any) => any;
        event: {
          addListener: (target: any, event: string, callback: (e: any) => void) => void;
        };
      };
    };
  }
}

interface WebMapViewProps extends MapViewProps {
  onMessage?: (message: any) => void;
  mapCenter: { lat: number; lng: number };
  level?: number;
  markers: Array<{ id: string; lat: number; lng: number }>;
  currentLocation?: { lat: number; lng: number } | null;
  isLoadingLocation?: boolean;
}

export function WebMapView({
  mapCenter,
  level,
  markers,
  onMessage,
  currentLocation,
  isLoadingLocation,
}: WebMapViewProps) {
  const viewRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const currentLocationMarkerRef = useRef<any>(null);
  const currentLocationCircleRef = useRef<any>(null);
  const scriptLoadedRef = useRef(false);
  const kakaoMapApiKey = getKakaoMapApiKey();

  useEffect(() => {
    if (Platform.OS !== 'web' || !viewRef.current) return;

    const viewElement = viewRef.current as any;
    const domElement = viewElement._nativeNode || viewElement;

    if (!domElement || domElement.tagName !== 'DIV') return;

    const container = document.createElement('div');
    container.id = 'kakao-map-container';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.margin = '0';
    container.style.padding = '0';

    domElement.appendChild(container);
    mapContainerRef.current = container;

    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !window.kakao?.maps) return;

    const kakaoMaps = window.kakao.maps;

    Object.values(markersRef.current).forEach((marker: any) => {
      marker.setMap(null);
    });
    markersRef.current = {};

    markers.forEach(({ id, lat, lng }) => {
      const marker = new kakaoMaps.Marker({
        position: new kakaoMaps.LatLng(lat, lng),
        map: mapRef.current,
      });

      kakaoMaps.event.addListener(marker, 'click', () => {
        onMessage?.({
          type: 'MARKER_CLICK',
          payload: { id },
        });
      });

      markersRef.current[id] = marker;
    });
  }, [markers, onMessage]);

  const initMap = useCallback(() => {
    if (!mapContainerRef.current || !window.kakao?.maps) return;

    const kakaoMaps = window.kakao.maps;
    const container = mapContainerRef.current;
    const center = new kakaoMaps.LatLng(mapCenter.lat, mapCenter.lng);

    mapRef.current = new kakaoMaps.Map(container, {
      center,
      level: level ?? DEFAULT_MAP_LEVEL,
    });

    kakaoMaps.event.addListener(mapRef.current, 'click', (mouseEvent: any) => {
      const latlng = mouseEvent.latLng;
      onMessage?.({
        type: 'MAP_CLICK',
        payload: { lat: latlng.getLat(), lng: latlng.getLng() },
      });
    });

    kakaoMaps.event.addListener(mapRef.current, 'center_changed', () => {
      const center = mapRef.current.getCenter();
      onMessage?.({
        type: 'CENTER_CHANGED',
        payload: { lat: center.getLat(), lng: center.getLng() },
      });
    });

    updateMarkers();
  }, [mapCenter.lat, mapCenter.lng, level, onMessage, updateMarkers]);

  useEffect(() => {
    if (!kakaoMapApiKey || !mapContainerRef.current) return;

    if (window.kakao?.maps && scriptLoadedRef.current) {
      initMap();
      return;
    }

    if (!scriptLoadedRef.current) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&autoload=false`;
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        if (window.kakao?.maps && mapContainerRef.current) {
          window.kakao.maps.load(() => {
            initMap();
          });
        }
      };
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else if (window.kakao?.maps) {
      window.kakao.maps.load(() => {
        initMap();
      });
    }
  }, [kakaoMapApiKey, initMap]);

  useEffect(() => {
    if (mapRef.current && window.kakao?.maps) {
      const kakaoMaps = window.kakao.maps;
      const center = new kakaoMaps.LatLng(mapCenter.lat, mapCenter.lng);
      mapRef.current.setCenter(center);
    }
  }, [mapCenter.lat, mapCenter.lng]);

  useEffect(() => {
    if (mapRef.current && level) {
      mapRef.current.setLevel(level);
    }
  }, [level]);

  const clearCurrentLocationMarker = useCallback(() => {
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
      currentLocationMarkerRef.current = null;
    }
    if (currentLocationCircleRef.current) {
      currentLocationCircleRef.current.setMap(null);
      currentLocationCircleRef.current = null;
    }
  }, []);

  const updateCurrentLocationMarker = useCallback(() => {
    if (!mapRef.current || !window.kakao?.maps || isLoadingLocation || !currentLocation) {
      clearCurrentLocationMarker();
      return;
    }

    const kakaoMaps = window.kakao.maps;
    const style = DEFAULT_MARKER_STYLE_FOR_WEBVIEW;

    clearCurrentLocationMarker();

    // 마커 생성
    const content = document.createElement('div');
    content.style.width = `${style.width}px`;
    content.style.height = `${style.height}px`;
    content.style.backgroundColor = style.backgroundColor;
    content.style.border = `${style.borderWidth}px solid ${style.borderColor}`;
    content.style.borderRadius = style.borderRadius;
    content.style.boxShadow = style.boxShadow;
    content.style.position = 'relative';

    const position = new kakaoMaps.LatLng(currentLocation.lat, currentLocation.lng);
    currentLocationMarkerRef.current = new kakaoMaps.CustomOverlay({
      position,
      content,
      yAnchor: 0.5,
      xAnchor: 0.5,
    });

    currentLocationMarkerRef.current.setMap(mapRef.current);

    // 반경 원 표시
    if (style.showRadius) {
      currentLocationCircleRef.current = new kakaoMaps.Circle({
        center: position,
        radius: style.radiusMeters || 300,
        strokeWeight: style.radiusStrokeWeight || 1,
        strokeColor: style.radiusStrokeColor || 'rgba(66,133,244,0.2)',
        strokeOpacity: 1,
        strokeStyle: 'solid',
        fillColor: style.radiusColor || 'rgba(66,133,244,0.1)',
        fillOpacity: 1,
      });

      currentLocationCircleRef.current.setMap(mapRef.current);
    }
  }, [currentLocation, isLoadingLocation, clearCurrentLocationMarker]);

  useEffect(() => {
    if (mapRef.current && window.kakao?.maps) {
      updateMarkers();
      updateCurrentLocationMarker();
    }
  }, [updateMarkers, updateCurrentLocationMarker]);

  return <View ref={viewRef} style={styles.webMapViewContainer} />;
}
