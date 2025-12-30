/**
 * Current Location Marker Utility
 * Version: 2.0.0
 * Created: 2025-01-XX
 *
 * [Design System] 현재 위치 커스텀 마커 스크립트 생성 유틸리티
 *
 * NOTE: 이 파일은 WebView 내부에서 사용되는 JavaScript 스크립트를 생성하는
 * 순수 함수(pure function)입니다. React Native 컴포넌트가 아닙니다.
 *
 * 변경 사항 (v2.0.0):
 * - 스타일을 동적으로 전달받도록 리팩토링
 * - React Native에서 props로 스타일을 받아 WebView로 전달하는 구조로 개선
 * - 타입 안정성 및 유지보수성 향상
 *
 * @see CurrentLocationMarker 컴포넌트를 사용하여 React Native에서 마커를 관리하세요.
 */

export { CurrentLocationMarker } from './CurrentLocationMarker';
export type { CurrentLocationMarkerProps } from './CurrentLocationMarker';

/**
 * 현재 위치 커스텀 마커를 생성하는 JavaScript 스크립트를 반환합니다.
 * 스타일은 동적으로 메시지를 통해 전달됩니다.
 * @returns HTML 요소를 생성하는 JavaScript 함수 문자열
 */
export function getCurrentLocationMarkerScript(): string {
  return `
    // ======= 현재 위치 커스텀 마커 컴포넌트 =======
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
        width: 16,
        height: 16,
        backgroundColor: "#3B82F6",
        borderColor: "#FFFFFF",
        borderWidth: 3,
        borderRadius: "50%",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
      };

      // 기존 현재 위치 마커 제거
      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
        currentLocationMarker = null;
      }

      // 커스텀 마커 요소 생성
      const content = createCurrentLocationMarkerElement(style);

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
