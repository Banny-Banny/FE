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
        MarkerImage: new (src: string, size: any, options?: any) => any;
        Size: new (width: number, height: number) => any;
        Point: new (x: number, y: number) => any;
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
  markers: Array<{ id: string; lat: number; lng: number; type?: 'EASTER_EGG' | 'TIME_CAPSULE' }>;
  currentLocation?: { lat: number; lng: number } | null;
  isLoadingLocation?: boolean;
  moveToLocationRef?: React.MutableRefObject<((location: { lat: number; lng: number }) => void) | null>;
}

export function WebMapView({
  mapCenter,
  level,
  markers,
  onMessage,
  currentLocation,
  isLoadingLocation,
  moveToLocationRef,
}: WebMapViewProps) {
  const viewRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const currentLocationMarkerRef = useRef<any>(null);
  const currentLocationCircleRef = useRef<any>(null);
  const scriptLoadedRef = useRef(false);
  const mapsLoadedRef = useRef(false);
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
    if (!mapRef.current || !window.kakao?.maps || !mapsLoadedRef.current) return;

    const kakaoMaps = window.kakao.maps;

    // LatLng가 생성자로 사용 가능한지 확인
    if (typeof kakaoMaps.LatLng !== 'function') return;

    Object.values(markersRef.current).forEach((marker: any) => {
      marker.setMap(null);
    });
    markersRef.current = {};

    // 이스터에그 마커 SVG (base64 인코딩)
    const easterEggMarkerSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA1MCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM2RjZGNkYiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNi43MzIxIDYxQzI1Ljk2MjMgNjIuMzMzMyAyNC4wMzc3IDYyLjMzMzMgMjMuMjY3OSA2MUwxNS44ODk4IDQ4LjIyMDZDMTUuMDM5OCA0Ni43NDgzIDE2LjI5NzggNDQuOTU0MSAxNy45NzE3IDQ1LjI1MTRMMjQuNjUwMiA0Ni40Mzc5QzI0Ljg4MTYgNDYuNDc5IDI1LjExODQgNDYuNDc5IDI1LjM0OTggNDYuNDM3OUwzMi4wMjgzIDQ1LjI1MTRDMzMuNzAyMiA0NC45NTQxIDM0Ljk2MDIgNDYuNzQ4MyAzNC4xMTAyIDQ4LjIyMDZMMjYuNzMyMSA2MVoiIGZpbGw9IiM2RjZGNkYiLz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzkzNl8yNzg3KSI+CjxwYXRoIGQ9Ik0yNSAxMkMxOC43NSAxMiAxNSAxOS44MTI1IDE1IDI2LjA2MjVDMTUgMzIuMzEyNSAxOS4zNzUgMzcgMjUgMzdDMzAuNjI1IDM3IDM1IDMyLjMxMjUgMzUgMjYuMDYyNUMzNSAxOS44MTI1IDMxLjI1IDEyIDI1IDEyWiIgZmlsbD0iIzZGNkY2RiIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzkzNl8yNzg3Ij4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjI1IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUgMTIpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==';

    markers.forEach(({ id, lat, lng, type }) => {
      try {
        let marker;
        
        // 이스터에그일 경우 커스텀 SVG 마커 사용
        if (type === 'EASTER_EGG') {
          const imageSize = new kakaoMaps.Size(35, 45); // 마커 이미지 크기
          const imageOption = { offset: new kakaoMaps.Point(17.5, 45) }; // 마커 이미지의 옵션 (하단 중앙 기준)
          
          const markerImage = new kakaoMaps.MarkerImage(
            easterEggMarkerSvg,
            imageSize,
            imageOption
          );
          
          marker = new kakaoMaps.Marker({
            position: new kakaoMaps.LatLng(lat, lng),
            image: markerImage,
            map: mapRef.current,
          });
        } else {
          // 일반 마커 (타임캡슐 또는 기본)
          marker = new kakaoMaps.Marker({
            position: new kakaoMaps.LatLng(lat, lng),
            map: mapRef.current,
          });
        }

        kakaoMaps.event.addListener(marker, 'click', () => {
          onMessage?.({
            type: 'MARKER_CLICK',
            payload: { id },
          });
        });

        markersRef.current[id] = marker;
      } catch (error) {
        // 마커 생성 실패 시 조용히 처리
      }
    });
  }, [markers, onMessage]);

  const initMap = useCallback(() => {
    if (!mapContainerRef.current || !window.kakao?.maps) return;

    const kakaoMaps = window.kakao.maps;

    // LatLng가 생성자로 사용 가능한지 확인
    if (typeof kakaoMaps.LatLng !== 'function') {
      return;
    }

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

    mapsLoadedRef.current = true;
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
            mapsLoadedRef.current = true;
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
        mapsLoadedRef.current = true;
        initMap();
      });
    }
  }, [kakaoMapApiKey, initMap]);

  useEffect(() => {
    if (mapRef.current && window.kakao?.maps && mapsLoadedRef.current) {
      const kakaoMaps = window.kakao.maps;
      if (typeof kakaoMaps.LatLng === 'function') {
        const center = new kakaoMaps.LatLng(mapCenter.lat, mapCenter.lng);
        mapRef.current.setCenter(center);
      }
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
    if (!mapRef.current || !window.kakao?.maps || !mapsLoadedRef.current || isLoadingLocation || !currentLocation) {
      clearCurrentLocationMarker();
      return;
    }

    const kakaoMaps = window.kakao.maps;

    // LatLng가 생성자로 사용 가능한지 확인
    if (typeof kakaoMaps.LatLng !== 'function') {
      return;
    }

    const style = DEFAULT_MARKER_STYLE_FOR_WEBVIEW;

    clearCurrentLocationMarker();

    try {
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
    } catch (error) {
      // 현재 위치 마커 업데이트 실패 시 조용히 처리
    }
  }, [currentLocation, isLoadingLocation, clearCurrentLocationMarker]);

  useEffect(() => {
    if (mapRef.current && window.kakao?.maps && mapsLoadedRef.current) {
      updateMarkers();
      updateCurrentLocationMarker();
    }
  }, [updateMarkers, updateCurrentLocationMarker]);

  // 현재 위치로 이동하는 함수
  const moveToLocation = useCallback(
    (location: { lat: number; lng: number }) => {
      if (!mapRef.current || !window.kakao?.maps || !mapsLoadedRef.current) return;

      const kakaoMaps = window.kakao.maps;
      if (typeof kakaoMaps.LatLng === 'function') {
        const position = new kakaoMaps.LatLng(location.lat, location.lng);
        mapRef.current.setCenter(position);
      }
    },
    [],
  );

  // moveToLocation 함수를 외부에서 사용할 수 있도록 ref에 저장
  useEffect(() => {
    if (moveToLocationRef) {
      moveToLocationRef.current = moveToLocation;
    }
  }, [moveToLocation, moveToLocationRef]);

  return <View ref={viewRef} style={styles.webMapViewContainer} />;
}
