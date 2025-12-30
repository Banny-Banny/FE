/**
 * Current Location Marker Utility
 * Version: 2.0.0
 * Created: 2025-01-XX
 *
 * [Design System] 현재 위치 커스텀 마커 유틸리티
 *
 * NOTE: 이 파일은 WebView 내부에서 사용되는 JavaScript 스크립트를 생성하는
 * 순수 함수(pure function)입니다. React Native 컴포넌트가 아닙니다.
 *
 * @see components/map/components/current-location-marker/의 CurrentLocationMarker 컴포넌트를 사용하세요.
 */

import { DEFAULT_MARKER_STYLE_FOR_WEBVIEW } from './styles';

/**
 * WebView 내부에서 사용할 JavaScript 스크립트 생성
 * @returns HTML에 삽입할 JavaScript 함수 문자열
 */
export function getCurrentLocationMarkerScript(): string {
  // styles.ts에서 기본 스타일 가져오기
  const { width, height, backgroundColor, borderColor, borderWidth, borderRadius, boxShadow } =
    DEFAULT_MARKER_STYLE_FOR_WEBVIEW;

  return `
    function createCurrentLocationMarkerElement(style) {
      const content = document.createElement("div");
      content.style.width = style.width + "px";
      content.style.height = style.height + "px";
      content.style.backgroundColor = style.backgroundColor;
      content.style.border = style.borderWidth + "px solid " + style.borderColor;
      content.style.borderRadius = style.borderRadius;
      content.style.boxShadow = style.boxShadow;
      content.style.position = "relative";
      return content;
    }

    function setCurrentLocationMarker(payload) {
      if (!map || !payload || !payload.location) return;

      const location = payload.location;
      const style = payload.style || {
        width: ${width},
        height: ${height},
        backgroundColor: "${backgroundColor}",
        borderColor: "${borderColor}",
        borderWidth: ${borderWidth},
        borderRadius: "${borderRadius}",
        boxShadow: "${boxShadow}"
      };

      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
        currentLocationMarker = null;
      }

      const content = createCurrentLocationMarkerElement(style);
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
