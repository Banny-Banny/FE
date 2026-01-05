/**
 * 카카오맵 WebView 내부 JavaScript 로직
 * 지도 초기화, 마커 관리, 이벤트 핸들링
 */

import { getCurrentLocationMarkerScript } from '@/components/map/components/current-location-marker/utils';

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

      // 이스터에그 마커 SVG (base64 인코딩)
      const easterEggMarkerSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA1MCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM2RjZGNkYiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNi43MzIxIDYxQzI1Ljk2MjMgNjIuMzMzMyAyNC4wMzc3IDYyLjMzMzMgMjMuMjY3OSA2MUwxNS44ODk4IDQ4LjIyMDZDMTUuMDM5OCA0Ni43NDgzIDE2LjI5NzggNDQuOTU0MSAxNy45NzE3IDQ1LjI1MTRMMjQuNjUwMiA0Ni40Mzc5QzI0Ljg4MTYgNDYuNDc5IDI1LjExODQgNDYuNDc5IDI1LjM0OTggNDYuNDM3OUwzMi4wMjgzIDQ1LjI1MTRDMzMuNzAyMiA0NC45NTQxIDM0Ljk2MDIgNDYuNzQ4MyAzNC4xMTAyIDQ4LjIyMDZMMjYuNzMyMSA2MVoiIGZpbGw9IiM2RjZGNkYiLz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzkzNl8yNzg3KSI+CjxwYXRoIGQ9Ik0yNSAxMkMxOC43NSAxMiAxNSAxOS44MTI1IDE1IDI2LjA2MjVDMTUgMzIuMzEyNSAxOS4zNzUgMzcgMjUgMzdDMzAuNjI1IDM3IDM1IDMyLjMxMjUgMzUgMjYuMDYyNUMzNSAxOS44MTI1IDMxLjI1IDEyIDI1IDEyWiIgZmlsbD0iIzZGNkY2RiIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzkzNl8yNzg3Ij4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjI1IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUgMTIpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==';

      list.forEach(({ id, lat, lng, type }) => {
        let marker;
        
        // 이스터에그일 경우 커스텀 SVG 마커 사용
        if (type === 'EASTER_EGG') {
          const imageSize = new kakao.maps.Size(35, 45); // 마커 이미지 크기
          const imageOption = { offset: new kakao.maps.Point(17.5, 45) }; // 마커 이미지의 옵션 (하단 중앙 기준)
          
          const markerImage = new kakao.maps.MarkerImage(
            easterEggMarkerSvg,
            imageSize,
            imageOption
          );
          
          marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lat, lng),
            image: markerImage,
            map,
          });
        } else {
          // 일반 마커 (타임캡슐 또는 기본)
          marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lat, lng),
            map,
          });
        }

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
