/**
 * 카카오맵 WebView 내부 JavaScript 로직
 * 지도 초기화, 마커 관리, 이벤트 핸들링
 */

import { getCurrentLocationMarkerScript } from '../../current-location-marker/utils';

/**
 * 카카오맵 WebView 내부 JavaScript 코드 생성
 */
export function generateMapScript(): string {
  return `
    // ======= 상태 관리 =======
    let map = null;
    let markers = {};  // id -> kakao.maps.Marker
    let currentLocationMarker = null;

    // ======= 유틸리티 함수 =======
    function sendToRN(message) {
      if (window.ReactNativeWebView?.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
      }
    }

    function safeParse(raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }

    // ======= 지도 초기화 =======
    function initMap(payload) {
      if (!window.kakao || !window.kakao.maps) {
        return;
      }

      window.kakao.maps.load(() => {
        // 이미 초기화된 경우 카메라만 이동
        if (map) {
          moveCamera(payload.center);
          sendToRN({ type: "READY" });
          return;
        }

        const container = document.getElementById("map");
        if (!container) {
          return;
        }

        const center = new kakao.maps.LatLng(payload.center.lat, payload.center.lng);
        map = new kakao.maps.Map(container, {
          center,
          level: payload.level ?? 4,
        });

        // 지도 클릭 이벤트
        kakao.maps.event.addListener(map, "click", (mouseEvent) => {
          const latlng = mouseEvent.latLng;
          sendToRN({
            type: "MAP_CLICK",
            payload: { lat: latlng.getLat(), lng: latlng.getLng() },
          });
        });

        // 지도 중심점 변경 이벤트
        kakao.maps.event.addListener(map, "center_changed", () => {
          const center = map.getCenter();
          sendToRN({
            type: "CENTER_CHANGED",
            payload: { lat: center.getLat(), lng: center.getLng() },
          });
        });

        // 초기 중심점 전송
        sendToRN({
          type: "CENTER_CHANGED",
          payload: { lat: center.getLat(), lng: center.getLng() },
        });

        sendToRN({ type: "READY" });
      });
    }

    // ======= 마커 관리 =======
    function clearMarkers() {
      Object.values(markers).forEach((marker) => marker.setMap(null));
      markers = {};
    }

    function setMarkers(list) {
      if (!map) {
        return;
      }

      clearMarkers();

      list.forEach(({ id, lat, lng }) => {
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(lat, lng),
          map,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          sendToRN({ type: "MARKER_CLICK", payload: { id } });
        });

        markers[id] = marker;
      });
    }

    // ======= 카메라 제어 =======
    function moveCamera(center) {
      if (!map) {
        return;
      }
      map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    }

    // ======= 현재 위치 마커 =======
    ${getCurrentLocationMarkerScript()}

    // ======= 메시지 핸들러 =======
    function handleMessage(raw) {
      const msg = safeParse(raw);
      if (!msg || !msg.type) return;

      switch (msg.type) {
        case "INIT":
          initMap(msg.payload);
          break;
        case "SET_MARKERS":
          setMarkers(msg.payload);
          break;
        case "MOVE_CAMERA":
          moveCamera(msg.payload);
          break;
        case "SET_CURRENT_LOCATION":
          setCurrentLocationMarker(msg.payload);
          break;
        case "REMOVE_CURRENT_LOCATION":
          removeCurrentLocationMarker();
          break;
        default:
          break;
      }
    }

    // ======= 메시지 리스너 설정 =======
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.onMessage = (event) => {
        handleMessage(event.data);
      };
    }

    window.addEventListener("message", (e) => {
      if (e.data) {
        handleMessage(e.data);
      }
    });
  `;
}
