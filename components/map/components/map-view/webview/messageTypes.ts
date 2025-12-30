/**
 * WebView 메시지 타입 정의
 * React Native <-> WebView 간 통신 메시지 타입
 */

// RN -> WebView 메시지 타입
export interface InitMapMessage {
  type: 'INIT';
  payload: {
    center: { lat: number; lng: number };
    level?: number;
  };
}

export interface SetMarkersMessage {
  type: 'SET_MARKERS';
  payload: Array<{ id: string; lat: number; lng: number }>;
}

export interface MoveCameraMessage {
  type: 'MOVE_CAMERA';
  payload: { lat: number; lng: number };
}

export interface SetCurrentLocationMessage {
  type: 'SET_CURRENT_LOCATION';
  payload: {
    location: { lat: number; lng: number };
    style?: {
      width: number;
      height: number;
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      borderRadius: string;
      boxShadow: string;
    };
  };
}

export interface RemoveCurrentLocationMessage {
  type: 'REMOVE_CURRENT_LOCATION';
}

export type RNToWebViewMessage =
  | InitMapMessage
  | SetMarkersMessage
  | MoveCameraMessage
  | SetCurrentLocationMessage
  | RemoveCurrentLocationMessage;

// WebView -> RN 메시지 타입
export interface ReadyMessage {
  type: 'READY';
}

export interface CenterChangedMessage {
  type: 'CENTER_CHANGED';
  payload: { lat: number; lng: number };
}

export interface MapClickMessage {
  type: 'MAP_CLICK';
  payload: { lat: number; lng: number };
}

export interface MarkerClickMessage {
  type: 'MARKER_CLICK';
  payload: { id: string };
}

export interface WebErrorMessage {
  type: 'WEB_ERROR' | 'WEB_WARN' | 'WEB_ONERROR';
  payload:
    | string
    | { message: string; source?: string; lineno?: number; colno?: number; error?: string };
}

export type WebViewToRNMessage =
  | ReadyMessage
  | CenterChangedMessage
  | MapClickMessage
  | MarkerClickMessage
  | WebErrorMessage;
