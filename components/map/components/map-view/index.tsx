import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import WebView from 'react-native-webview';
import { KAKAO_MAP_HTML } from './kakaoMapHtml';
import { styles } from './styles';
import type { MapViewProps } from './types';

export default function MapView({ center, level, onMapClick, onMarkerClick }: MapViewProps = {}) {
  const webViewRef = useRef<WebView>(null);

  // 카카오 API 키를 가져와서 HTML에 주입
  const kakaoApiKey = Constants.expoConfig?.extra?.kakaoApiKey || '';
  
  if (!kakaoApiKey) {
    console.error('[MapView] 카카오 API 키가 설정되지 않았습니다. EXPO_PUBLIC_KAKAO_API_KEY를 확인하세요.');
  } else {
    console.log('[MapView] 카카오 API 키 로드 완료:', kakaoApiKey.substring(0, 10) + '...');
  }
  
  const htmlContent = KAKAO_MAP_HTML.replace('__KAKAO_JS_KEY__', kakaoApiKey);

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
                center: center || { lat: 37.5665, lng: 126.978 },
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
  }, [center, level]);

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
            // WebView 로드 완료 후 INIT 메시지 전송
            setTimeout(() => {
              if (webViewRef.current) {
                console.log('[MapView] onLoadEnd 후 INIT 메시지 전송');
                webViewRef.current.postMessage(
                  JSON.stringify({
                    type: 'INIT',
                    payload: {
                      center: center || { lat: 37.5665, lng: 126.978 },
                      level: level || 4,
                    },
                  }),
                );
              }
            }, 500);
          }}
        />
      )}
    </View>
  );
}
