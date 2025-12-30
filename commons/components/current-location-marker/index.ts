/**
 * Current Location Marker Utility
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Design System] 현재 위치 커스텀 마커 스크립트 생성 유틸리티
 *
 * NOTE: 이 파일은 WebView 내부에서 사용되는 JavaScript 스크립트를 생성하는
 * 순수 함수(pure function)입니다. React Native 컴포넌트가 아닙니다.
 *
 * 프로젝트 구조 규칙:
 * - commons/components/는 일반적으로 React Native 컴포넌트를 포함하지만,
 *   이 경우는 WebView 내부 스크립트 생성 유틸리티로 특수한 케이스입니다.
 * - 디자인 시스템의 마커 스타일을 관리하는 역할을 합니다.
 *
 * - 커스텀 마커 HTML 요소 생성 스크립트 제공
 * - 마커 스타일 정의 (디자인 시스템 토큰 사용)
 * - WebView 내부에서 사용되는 JavaScript 함수 문자열 반환
 */

import { DEFAULT_MARKER_CONFIG } from './styles';
import type { CurrentLocationMarkerConfig } from './types';

/**
 * 현재 위치 커스텀 마커를 생성하는 JavaScript 스크립트를 반환합니다.
 * @param config 마커 스타일 설정 (선택사항)
 * @returns HTML 요소를 생성하는 JavaScript 함수 문자열
 */
export function getCurrentLocationMarkerScript(
  config: CurrentLocationMarkerConfig = DEFAULT_MARKER_CONFIG,
): string {
  const { width, height, backgroundColor, borderColor, borderWidth, borderRadius, boxShadow } = {
    ...DEFAULT_MARKER_CONFIG,
    ...config,
  };

  return `
    // ======= 현재 위치 커스텀 마커 컴포넌트 =======
    function createCurrentLocationMarkerElement() {
      const content = document.createElement("div");
      content.style.width = "${width}px";
      content.style.height = "${height}px";
      content.style.backgroundColor = "${backgroundColor}";
      content.style.border = "${borderWidth}px solid ${borderColor}";
      content.style.borderRadius = "${borderRadius}";
      content.style.boxShadow = "${boxShadow}";
      content.style.position = "relative";
      return content;
    }

    function setCurrentLocationMarker(location) {
      if (!map || !location) return;

      // 기존 현재 위치 마커 제거
      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
        currentLocationMarker = null;
      }

      // 커스텀 마커 요소 생성
      const content = createCurrentLocationMarkerElement();

      // 커스텀 오버레이로 현재 위치 표시
      const position = new kakao.maps.LatLng(location.lat, location.lng);
      currentLocationMarker = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 0.5,
        xAnchor: 0.5,
      });

      currentLocationMarker.setMap(map);
    }

    function removeCurrentLocationMarker() {
      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
        currentLocationMarker = null;
      }
    }
  `;
}
