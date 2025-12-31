/**
 * WebView 메시지 핸들러 유틸리티
 * React Native에서 WebView로 메시지를 보내는 헬퍼 함수
 */

import type { WebView } from 'react-native-webview';

import type {
  InitMapMessage,
  RemoveCurrentLocationMessage,
  SetCurrentLocationMessage,
  SetMarkersMessage,
} from './messageTypes';

/**
 * WebView에 메시지를 안전하게 전송
 */
function sendMessage(webViewRef: React.RefObject<WebView | null>, message: string) {
  if (!webViewRef.current) {
    return false;
  }

  try {
    webViewRef.current.postMessage(message);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 지도 초기화 메시지 전송
 */
export function sendInitMessage(
  webViewRef: React.RefObject<WebView | null>,
  payload: InitMapMessage['payload'],
) {
  const message: InitMapMessage = {
    type: 'INIT',
    payload,
  };
  return sendMessage(webViewRef, JSON.stringify(message));
}

/**
 * 마커 설정 메시지 전송
 */
export function sendSetMarkersMessage(
  webViewRef: React.RefObject<WebView | null>,
  payload: SetMarkersMessage['payload'],
) {
  const message: SetMarkersMessage = {
    type: 'SET_MARKERS',
    payload,
  };
  return sendMessage(webViewRef, JSON.stringify(message));
}

/**
 * 현재 위치 마커 설정 메시지 전송
 */
export function sendSetCurrentLocationMessage(
  webViewRef: React.RefObject<WebView | null>,
  payload: {
    location: { lat: number; lng: number };
    style?: {
      width?: number;
      height?: number;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      borderRadius?: string;
      boxShadow?: string;
    };
  },
) {
  // style이 제공되지 않으면 WebView에서 기본값 사용
  const message: SetCurrentLocationMessage = {
    type: 'SET_CURRENT_LOCATION',
    payload: payload.style
      ? {
          location: payload.location,
          style: payload.style as SetCurrentLocationMessage['payload']['style'],
        }
      : {
          location: payload.location,
        },
  };
  return sendMessage(webViewRef, JSON.stringify(message));
}

/**
 * 현재 위치 마커 제거 메시지 전송
 */
export function sendRemoveCurrentLocationMessage(webViewRef: React.RefObject<WebView | null>) {
  const message: RemoveCurrentLocationMessage = {
    type: 'REMOVE_CURRENT_LOCATION',
  };
  return sendMessage(webViewRef, JSON.stringify(message));
}
