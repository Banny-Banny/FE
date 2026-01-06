/**
 * MapView 공통 유틸리티
 * 지도 설정, API 키, 메시지 핸들링 등 공통 로직
 */

import Constants from 'expo-constants';
import type React from 'react';

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_LEVEL, MAP_CENTER_CHANGED_DEBOUNCE_MS } from './constants';
import type { CapsuleMarker } from './types';
import type { WebViewToRNMessage } from './webview/messageTypes';

/**
 * 카카오 지도 API 키 가져오기
 */
export function getKakaoMapApiKey(): string | undefined {
  return Constants.expoConfig?.extra?.kakaoMapApiKey || process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY;
}

/**
 * 지도 설정
 */
export interface MapConfig {
  center: { lat: number; lng: number };
  level: number;
}

/**
 * 지도 초기 설정 생성
 * 우선순위: userLocation > center > DEFAULT_MAP_CENTER
 * 사용자 위치가 있으면 우선적으로 사용하여 현재 위치를 중심으로 렌더링
 */
export function createMapConfig(
  center?: { lat: number; lng: number },
  level?: number,
  userLocation?: { lat: number; lng: number } | null,
): MapConfig {
  return {
    center: userLocation || center || DEFAULT_MAP_CENTER,
    level: level ?? DEFAULT_MAP_LEVEL,
  };
}

/**
 * 메시지 핸들러 콜백
 */
export interface MessageHandlerCallbacks {
  onMapClick?: (coord: { lat: number; lng: number }) => void;
  onMarkerClick?: (id: string) => void;
  onCapsuleClick?: (capsule: any) => void;
  onCenterChanged?: (coord: { lat: number; lng: number }) => void;
}

/**
 * 메시지 핸들러 상태
 */
export interface MessageHandlerState {
  centerChangedTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  capsuleMarkers: CapsuleMarker[];
}

/**
 * 공통 메시지 핸들러 생성
 * WebView와 Web 환경에서 공통으로 사용되는 메시지 처리 로직
 */
export function createMessageHandler(
  callbacks: MessageHandlerCallbacks,
  state: MessageHandlerState,
) {
  return (message: WebViewToRNMessage) => {
    switch (message.type) {
      case 'READY':
        break;

      case 'CENTER_CHANGED':
        if (state.centerChangedTimerRef.current) {
          clearTimeout(state.centerChangedTimerRef.current);
        }
        state.centerChangedTimerRef.current = setTimeout(() => {
          callbacks.onCenterChanged?.(message.payload);
        }, MAP_CENTER_CHANGED_DEBOUNCE_MS);
        break;

      case 'MAP_CLICK':
        callbacks.onMapClick?.(message.payload);
        break;

      case 'MARKER_CLICK': {
        const clickedMarker = state.capsuleMarkers.find((m) => m.id === message.payload.id);
        if (clickedMarker) {
          callbacks.onCapsuleClick?.(clickedMarker.data);
        }
        callbacks.onMarkerClick?.(message.payload.id);
        break;
      }

      case 'WEB_ERROR':
      case 'WEB_WARN':
      case 'WEB_ONERROR':
        break;

      default:
        break;
    }
  };
}
