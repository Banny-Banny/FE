/**
 * components/map/components/current-location-marker/utils.ts
 * Current Location Marker Utility
 * Version: 2.0.0
 * Updated: 2025-01-XX
 *
 * [Feature Utility] 현재 위치 커스텀 마커 유틸리티
 *
 * NOTE: 이 파일은 WebView 내부에서 사용되는 JavaScript 스크립트를 생성하는
 * 순수 함수(pure function)입니다.
 */

import { DEFAULT_MARKER_STYLE_FOR_WEBVIEW } from './styles';

/**
 * WebView 내부에서 사용할 JavaScript 스크립트 생성
 * @returns HTML에 삽입할 JavaScript 함수 문자열
 */
export function getCurrentLocationMarkerScript(): string {
  // styles.ts에서 기본 스타일 가져오기
  const {
    width,
    height,
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    boxShadow,
    showRadius,
    radiusMeters,
    radiusColor,
    radiusStrokeColor,
    radiusStrokeWeight,
  } = DEFAULT_MARKER_STYLE_FOR_WEBVIEW;

  return `
    let currentLocationCircle = null;

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

    function setCurrentLocationRadiusCircle(location, radiusConfig) {
      if (!map || !location || !radiusConfig || !radiusConfig.showRadius || !window.kakao || !window.kakao.maps) {
        if (currentLocationCircle) {
          currentLocationCircle.setMap(null);
          currentLocationCircle = null;
        }
        return;
      }

      // kakao.maps API가 완전히 로드되었는지 확인
      if (typeof window.kakao.maps.LatLng !== 'function') {
        window.kakao.maps.load(() => {
          if (!map) return;
          createRadiusCircle(location, radiusConfig);
        });
      } else {
        createRadiusCircle(location, radiusConfig);
      }
    }

    function createRadiusCircle(location, radiusConfig) {
      if (!map) return;

      if (currentLocationCircle) {
        currentLocationCircle.setMap(null);
        currentLocationCircle = null;
      }

      try {
        const position = new kakao.maps.LatLng(location.lat, location.lng);
        currentLocationCircle = new kakao.maps.Circle({
          center: position,
          radius: radiusConfig.radiusMeters || ${radiusMeters},
          strokeWeight: radiusConfig.radiusStrokeWeight || ${radiusStrokeWeight},
          strokeColor: radiusConfig.radiusStrokeColor || "${radiusStrokeColor}",
          strokeOpacity: 1,
          strokeStyle: "solid",
          fillColor: radiusConfig.radiusColor || "${radiusColor}",
          fillOpacity: 1,
        });

        currentLocationCircle.setMap(map);
      } catch (error) {
        // 개발 환경에서만 에러 로깅
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
        }
      }
    }

    function setCurrentLocationMarker(payload) {
      if (!map || !payload || !payload.location || !window.kakao || !window.kakao.maps) return;

      // kakao.maps API가 완전히 로드되었는지 확인
      if (typeof window.kakao.maps.LatLng !== 'function') {
        window.kakao.maps.load(() => {
          if (!map) return;
          createCurrentLocationMarker(payload);
        });
      } else {
        createCurrentLocationMarker(payload);
      }
    }

    function createCurrentLocationMarker(payload) {
      if (!map) return;

      const location = payload.location;
      const style = payload.style || {
        width: ${width},
        height: ${height},
        backgroundColor: "${backgroundColor}",
        borderColor: "${borderColor}",
        borderWidth: ${borderWidth},
        borderRadius: "${borderRadius}",
        boxShadow: "${boxShadow}",
        showRadius: ${showRadius},
        radiusMeters: ${radiusMeters},
        radiusColor: "${radiusColor}",
        radiusStrokeColor: "${radiusStrokeColor}",
        radiusStrokeWeight: ${radiusStrokeWeight}
      };

      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
        currentLocationMarker = null;
      }

      try {
        const content = createCurrentLocationMarkerElement(style);
        const position = new kakao.maps.LatLng(location.lat, location.lng);
        currentLocationMarker = new kakao.maps.CustomOverlay({
          position: position,
          content: content,
          yAnchor: 0.5,
          xAnchor: 0.5,
        });

        currentLocationMarker.setMap(map);

        // 반경 원 표시
        if (style.showRadius) {
          setCurrentLocationRadiusCircle(location, {
            showRadius: style.showRadius,
            radiusMeters: style.radiusMeters,
            radiusColor: style.radiusColor,
            radiusStrokeColor: style.radiusStrokeColor,
            radiusStrokeWeight: style.radiusStrokeWeight,
          });
        }
      } catch (error) {
        // 개발 환경에서만 에러 로깅
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
        }
      }
    }

    function removeCurrentLocationMarker() {
      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
        currentLocationMarker = null;
      }
      if (currentLocationCircle) {
        currentLocationCircle.setMap(null);
        currentLocationCircle = null;
      }
    }
  `;
}
