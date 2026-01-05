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
    let map = null;
    let markers = {};
    let currentLocationMarker = null;

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

    function initMap(payload) {
      if (!window.kakao || !window.kakao.maps) {
        return;
      }

      window.kakao.maps.load(() => {
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

        kakao.maps.event.addListener(map, "click", (mouseEvent) => {
          const latlng = mouseEvent.latLng;
          sendToRN({
            type: "MAP_CLICK",
            payload: { lat: latlng.getLat(), lng: latlng.getLng() },
          });
        });

        kakao.maps.event.addListener(map, "center_changed", () => {
          const center = map.getCenter();
          sendToRN({
            type: "CENTER_CHANGED",
            payload: { lat: center.getLat(), lng: center.getLng() },
          });
        });

        sendToRN({
          type: "CENTER_CHANGED",
          payload: { lat: center.getLat(), lng: center.getLng() },
        });

        sendToRN({ type: "READY" });
      });
    }

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

    function moveCamera(center) {
      if (!map) {
        return;
      }
      map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    }

    ${getCurrentLocationMarkerScript()}

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
