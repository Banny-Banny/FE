import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import WebView from 'react-native-webview';
import { useMapLocation } from './hooks/useMapLocation';
import { KAKAO_MAP_HTML } from './kakaoMapHtml';
import { styles } from './styles';
import type { MapViewProps } from './types';

// 서울시청 기준 주변 5개 지점 고정 데이터
const SEOUL_CITY_HALL = { lat: 37.5665, lng: 126.978 };
const NEARBY_MARKERS = [
  { id: 'marker-1', lat: 37.5636, lng: 126.9827, name: '명동' },
  { id: 'marker-2', lat: 37.566, lng: 126.9824, name: '을지로입구' },
  { id: 'marker-3', lat: 37.5647, lng: 126.977, name: '시청역' },
  { id: 'marker-4', lat: 37.5658, lng: 126.975, name: '덕수궁' },
  { id: 'marker-5', lat: 37.5715, lng: 126.9768, name: '광화문' },
];

export default function MapView({ center, level, onMapClick, onMarkerClick }: MapViewProps = {}) {
  const webViewRef = useRef<WebView>(null);
  const { location, isLoading: locationLoading } = useMapLocation();

  // 카카오 API 키를 가져와서 HTML에 주입
  const kakaoApiKey =
    Constants.expoConfig?.extra?.kakaoMapApiKey || process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY;

  if (!kakaoApiKey) {
    console.error(
      '[MapView] 카카오 API 키가 설정되지 않았습니다. EXPO_PUBLIC_KAKAO_API_KEY를 확인하세요.',
    );
  } else {
    console.log('[MapView] 카카오 API 키 로드 완료:', kakaoApiKey.substring(0, 10) + '...');
  }

  const htmlContent = KAKAO_MAP_HTML.replace('__KAKAO_JS_KEY__', kakaoApiKey);

  // 지도 중심 좌표 결정: 현재 위치 > props center > 서울시청 기본값
  const mapCenter = center || location || SEOUL_CITY_HALL;

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
                center: mapCenter,
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
  }, [mapCenter, level]);

  // 마커 표시
  useEffect(() => {
    if (!webViewRef.current || locationLoading) return;

    const timer = setTimeout(() => {
      if (webViewRef.current) {
        try {
          webViewRef.current.postMessage(
            JSON.stringify({
              type: 'SET_MARKERS',
              payload: NEARBY_MARKERS,
            }),
          );
          console.log('[MapView] 마커 표시 완료:', NEARBY_MARKERS.length, '개');
        } catch (error) {
          console.error('[MapView] 마커 표시 실패:', error);
        }
      }
    }, 2500); // 지도 초기화 후 마커 표시

    return () => clearTimeout(timer);
  }, [locationLoading]);

  // WebView로부터 메시지 수신
  const handleMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', message);

      switch (message.type) {
        case 'READY':
          console.log('Map is ready');
          break;
        case 'MAP_CLICK':
          console.log('Map clicked:', message.payload);
          onMapClick?.(message.payload);
          break;
        case 'MARKER_CLICK':
          console.log('Marker clicked:', message.payload);
          onMarkerClick?.(message.payload.id);
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
      {!kakaoApiKey ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>카카오 API 키가 설정되지 않았습니다.</Text>
        </View>
      ) : (
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
      )}
    </View>
  );
}
