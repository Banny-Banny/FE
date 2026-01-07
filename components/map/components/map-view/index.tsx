/**
 * MapView Component
 * Version: 1.0.0
 * Updated: 2025-01-XX
 *
 * [Sub-Component] 지도 뷰 컴포넌트
 * - 비즈니스 로직은 hooks/useMapView에서 관리
 * - 이 컴포넌트는 렌더링만 담당
 */

import { useRef } from 'react';
import { Platform, Text, View } from 'react-native';
import WebView from 'react-native-webview';

import CurrentLocation from '../current-location';
import { CurrentLocationButton } from '../current-location-button';
import { CurrentLocationMarker } from '../current-location-marker';
import { EggSlot } from '../egg-slot';
import { ZoomControl } from '../zoom-control';
import { useMapView } from './hooks/useMapView';
import { styles } from './styles';
import type { MapViewProps } from './types';
import { WebMapView } from './web-map-view';

export default function MapView(props: MapViewProps = {}) {
  const {
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
    scale,
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    resetZoom,
  } = useMapView(props);

  // 웹 환경에서 지도 이동 함수를 저장할 ref
  const moveToLocationRef = useRef<((location: { lat: number; lng: number }) => void) | null>(null);

  // 웹 환경에서 현재 위치로 이동하는 함수
  const handleMoveToLocation = (loc: { lat: number; lng: number }) => {
    if (moveToLocationRef.current) {
      moveToLocationRef.current(loc);
    }
  };

  return (
    <View style={styles.container}>
      {!kakaoMapApiKey ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>카카오 API 키가 설정되지 않았습니다.</Text>
        </View>
      ) : Platform.OS === 'web' ? (
        <WebMapView
          mapCenter={mapCenter}
          level={zoomLevel}
          markers={markersForWeb}
          onMessage={handleMessageCommon}
          currentLocation={location}
          isLoadingLocation={locationLoading}
          moveToLocationRef={moveToLocationRef}
          scale={scale}
        />
      ) : (
        <>
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={['*']}
            onMessage={handleMessage}
          />
          <CurrentLocationMarker
            webViewRef={webViewRef}
            location={location}
            isLoading={locationLoading}
          />
        </>
      )}
      {/* 공통 UI 컴포넌트 - web과 native 모두에서 사용 */}
      {mapCenter && (
        <View style={styles.currentLocationWrapper}>
          <CurrentLocation lat={mapCenter.lat} lng={mapCenter.lng} />
        </View>
      )}
      <EggSlot onPress={props.onEggSlotPress} />
      {/* 현재 위치로 이동 버튼 */}
      <CurrentLocationButton
        webViewRef={webViewRef}
        location={location}
        isLoading={locationLoading}
        onMoveToLocation={Platform.OS === 'web' ? handleMoveToLocation : undefined}
      />
      {/* 확대/축소 컨트롤 */}
      <ZoomControl
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={resetZoom}
        canZoomIn={scale < 3}
        canZoomOut={scale > 0.5}
      />
    </View>
  );
}
