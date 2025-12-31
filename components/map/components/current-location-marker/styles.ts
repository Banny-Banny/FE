/**
 * components/map/components/current-location-marker/styles.ts
 * Current Location Marker 스타일 및 상수 정의
 * Version: 2.0.0
 * Updated: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 최소화 (Colors 토큰 우선 사용)
 * - [x] WebView 내부 JavaScript에서 사용할 스타일 상수만 정의
 * - [x] React Native와 WebView 양쪽에서 사용 가능한 스타일 제공
 *
 * NOTE: 이 컴포넌트는 `return null`을 하므로 React Native View를 렌더링하지 않습니다.
 * 따라서 StyleSheet.create()가 필요하지 않으며, WebView 내부 JavaScript에서
 * 사용할 스타일 상수만 정의합니다.
 */

import { Colors } from '@/commons/constants/color';
import type { CurrentLocationMarkerConfig } from './types';

/**
 * 현재 위치 마커 디자인 시스템 스타일
 */
const MARKER_STYLES = {
  /**
   * 마커 너비 (px)
   */
  width: 16,

  /**
   * 마커 높이 (px)
   */
  height: 16,

  /**
   * 마커 배경색
   * 디자인 시스템 Blue 색상 사용
   */
  backgroundColor: Colors.blue[500],

  /**
   * 마커 테두리 색상
   * 디자인 시스템 White 색상 사용
   */
  borderColor: Colors.white[50],

  /**
   * 마커 테두리 두께 (px)
   */
  borderWidth: 3,

  /**
   * 마커 모서리 둥글기
   */
  borderRadius: '50%',

  /**
   * 마커 그림자 효과
   */
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
} as const;

/**
 * 반경 원 기본 설정
 */
const RADIUS_CIRCLE_STYLES = {
  /**
   * 반경 원 표시 여부
   */
  showRadius: true,

  /**
   * 반경 원 크기 (미터 단위)
   * 기본값: 300m
   */
  radiusMeters: 300,

  /**
   * 반경 원 색상
   * Figma 디자인 기준: rgba(66,133,244,0.1)
   * NOTE: Figma 디자인 색상이 Colors.blue[500]과 다르므로 디자인 정확도를 위해 하드코딩 유지
   */
  radiusColor: 'rgba(66,133,244,0.1)',

  /**
   * 반경 원 테두리 색상
   * Figma 디자인 기준: rgba(66,133,244,0.2)
   * NOTE: Figma 디자인 색상이 Colors.blue[500]과 다르므로 디자인 정확도를 위해 하드코딩 유지
   */
  radiusStrokeColor: 'rgba(66,133,244,0.2)',

  /**
   * 반경 원 테두리 두께
   */
  radiusStrokeWeight: 1,
} as const;

/**
 * 현재 위치 마커 기본 설정
 * React Native 컴포넌트에서 사용
 */
export const DEFAULT_MARKER_CONFIG: CurrentLocationMarkerConfig = {
  width: MARKER_STYLES.width,
  height: MARKER_STYLES.height,
  backgroundColor: MARKER_STYLES.backgroundColor,
  borderColor: MARKER_STYLES.borderColor,
  borderWidth: MARKER_STYLES.borderWidth,
  borderRadius: MARKER_STYLES.borderRadius,
  boxShadow: MARKER_STYLES.boxShadow,
  showRadius: RADIUS_CIRCLE_STYLES.showRadius,
  radiusMeters: RADIUS_CIRCLE_STYLES.radiusMeters,
  radiusColor: RADIUS_CIRCLE_STYLES.radiusColor,
  radiusStrokeColor: RADIUS_CIRCLE_STYLES.radiusStrokeColor,
  radiusStrokeWeight: RADIUS_CIRCLE_STYLES.radiusStrokeWeight,
};

/**
 * WebView 내부 JavaScript에서 사용할 기본 스타일 객체
 * getCurrentLocationMarkerScript 함수에서 사용
 */
export const DEFAULT_MARKER_STYLE_FOR_WEBVIEW = {
  width: MARKER_STYLES.width,
  height: MARKER_STYLES.height,
  backgroundColor: MARKER_STYLES.backgroundColor,
  borderColor: MARKER_STYLES.borderColor,
  borderWidth: MARKER_STYLES.borderWidth,
  borderRadius: MARKER_STYLES.borderRadius,
  boxShadow: MARKER_STYLES.boxShadow,
  showRadius: RADIUS_CIRCLE_STYLES.showRadius,
  radiusMeters: RADIUS_CIRCLE_STYLES.radiusMeters,
  radiusColor: RADIUS_CIRCLE_STYLES.radiusColor,
  radiusStrokeColor: RADIUS_CIRCLE_STYLES.radiusStrokeColor,
  radiusStrokeWeight: RADIUS_CIRCLE_STYLES.radiusStrokeWeight,
} as const;
