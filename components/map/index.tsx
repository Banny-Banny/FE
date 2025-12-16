import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { styles } from './styles';
import { KAKAO_MAP_HTML } from './webview/kakaoMapHtml';

export default function MapScreen() {
  const webViewRef = useRef<WebView>(null);

  // 카카오 API 키를 가져와서 HTML에 주입
  const kakaoApiKey = Constants.expoConfig?.extra?.kakaoApiKey || '';
  const htmlContent = KAKAO_MAP_HTML.replace('__KAKAO_JS_KEY__', kakaoApiKey);

  useEffect(() => {
    // 지도 초기화 메시지 전송 (서울시청 좌표)
    const timer = setTimeout(() => {
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: 'INIT',
          payload: {
            center: { lat: 37.5665, lng: 126.978 },
            level: 4,
          },
        }),
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
          break;
        case 'MARKER_CLICK':
          console.log('Marker clicked:', message.payload);
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
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
      />
    </View>
  );
}
