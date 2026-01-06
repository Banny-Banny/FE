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

      // 이스터에그 마커 SVG (base64 인코딩) - 파란색
      const easterEggMarkerSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA1MCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiM2MEEwRUEiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNi43MzIxIDYxQzI1Ljk2MjMgNjIuMzMzMyAyNC4wMzc3IDYyLjMzMzMgMjMuMjY3OSA2MUwxNS44ODk4IDQ4LjIyMDZDMTUuMDM5OCA0Ni43NDgzIDE2LjI5NzggNDQuOTU0MSAxNy45NzE3IDQ1LjI1MTRMMjQuNjUwMiA0Ni40Mzc5QzI0Ljg4MTYgNDYuNDc5IDI1LjExODQgNDYuNDc5IDI1LjM0OTggNDYuNDM3OUwzMi4wMjgzIDQ1LjI1MTRDMzMuNzAyMiA0NC45NTQxIDM0Ljk2MDIgNDYuNzQ4MyAzNC4xMTAyIDQ4LjIyMDZMMjYuNzMyMSA2MVoiIGZpbGw9IiM2MEEwRUEiLz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzk4MV8yNjQzKSI+CjxwYXRoIGQ9Ik0yNSAxMkMxOC43NSAxMiAxNSAxOS44MTI1IDE1IDI2LjA2MjVDMTUgMzIuMzEyNSAxOS4zNzUgMzcgMjUgMzdDMzAuNjI1IDM3IDM1IDMyLjMxMjUgMzUgMjYuMDYyNUMzNSAxOS44MTI1IDMxLjI1IDEyIDI1IDEyWiIgZmlsbD0iIzYwQTBFQSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzk4MV8yNjQzIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjI1IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUgMTIpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==';
      
      // 타임캡슐 마커 SVG (base64 인코딩) - 빨간색
      const timeCapsuleMarkerSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA1MCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNGRjdCN0IiLz4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNi43MzIxIDYxQzI1Ljk2MjMgNjIuMzMzMyAyNC4wMzc3IDYyLjMzMzMgMjMuMjY3OSA2MUwxNS44ODk4IDQ4LjIyMDZDMTUuMDM5OCA0Ni43NDgzIDE2LjI5NzggNDQuOTU0MSAxNy45NzE3IDQ1LjI1MTRMMjQuNjUwMiA0Ni40Mzc5QzI0Ljg4MTYgNDYuNDc5IDI1LjExODQgNDYuNDc5IDI1LjM0OTggNDYuNDM3OUwzMi4wMjgzIDQ1LjI1MTRDMzMuNzAyMiA0NC45NTQxIDM0Ljk2MDIgNDYuNzQ4MyAzNC4xMTAyIDQ4LjIyMDZMMjYuNzMyMSA2MVoiIGZpbGw9IiNGRjdCN0IiLz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzk4MV8yNjUwKSI+CjxtYXNrIGlkPSJwYXRoLTQtaW5zaWRlLTFfOTgxXzI2NTAiIGZpbGw9IndoaXRlIj4KPHBhdGggZD0iTTE3Ljc3MzggMTcuMDYzMUMyMC4xMDc5IDEyLjA1NzcgMjYuMDU3NyA5Ljg5MjEzIDMxLjA2MzEgMTIuMjI2MkMzNi4wNjg1IDE0LjU2MDIgMzguMjM0IDIwLjUxIDM1LjkgMjUuNTE1NEwzMi41MTkgMzIuNzY1OUMzMC4xODUgMzcuNzcxMyAyNC4yMzUyIDM5LjkzNjkgMTkuMjI5OCAzNy42MDI4QzE0LjIyNDQgMzUuMjY4NyAxMi4wNTg4IDI5LjMxODkgMTQuMzkyOSAyNC4zMTM1TDE3Ljc3MzggMTcuMDYzMVoiLz4KPC9tYXNrPgo8cGF0aCBkPSJNMTcuNzczOCAxNy4wNjMxQzIwLjEwNzkgMTIuMDU3NyAyNi4wNTc3IDkuODkyMTMgMzEuMDYzMSAxMi4yMjYyQzM2LjA2ODUgMTQuNTYwMiAzOC4yMzQgMjAuNTEgMzUuOSAyNS41MTU0TDMyLjUxOSAzMi43NjU5QzMwLjE4NSAzNy43NzEzIDI0LjIzNTIgMzkuOTM2OSAxOS4yMjk4IDM3LjYwMjhDMTQuMjI0NCAzNS4yNjg3IDEyLjA1ODggMjkuMzE4OSAxNC4zOTI5IDI0LjMxMzVMMTcuNzczOCAxNy4wNjMxWiIgZmlsbD0id2hpdGUiLz4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNy44OTYgMjEuNTMzMikgcm90YXRlKDI1KSIgZmlsbD0iI0ZGN0I3QiIvPgo8L2c+CjxwYXRoIGQ9Ik0zNS45IDI1LjUxNTRMMzQuMDg3NCAyNC42NzAyTDMwLjcwNjQgMzEuOTIwN0wzMi41MTkgMzIuNzY1OUwzNC4zMzE2IDMzLjYxMTFMMzcuNzEyNiAyNi4zNjA3TDM1LjkgMjUuNTE1NFpNMTQuMzkyOSAyNC4zMTM1TDE2LjIwNTUgMjUuMTU4OEwxOS41ODY0IDE3LjkwODNMMTcuNzczOCAxNy4wNjMxTDE1Ljk2MTIgMTYuMjE3OEwxMi41ODAzIDIzLjQ2ODNMMTQuMzkyOSAyNC4zMTM1Wk0xOS4yMjk4IDM3LjYwMjhMMjAuMDc1IDM1Ljc5MDJDMTYuMDcwNyAzMy45MjI5IDE0LjMzODIgMjkuMTYzMSAxNi4yMDU1IDI1LjE1ODhMMTQuMzkyOSAyNC4zMTM1TDEyLjU4MDMgMjMuNDY4M0M5Ljc3OTM5IDI5LjQ3NDggMTIuMzc4MSAzNi42MTQ1IDE4LjM4NDUgMzkuNDE1NEwxOS4yMjk4IDM3LjYwMjhaTTMyLjUxOSAzMi43NjU5TDMwLjcwNjQgMzEuOTIwN0MyOC44MzkyIDM1LjkyNSAyNC4wNzkzIDM3LjY1NzQgMjAuMDc1IDM1Ljc5MDJMMTkuMjI5OCAzNy42MDI4TDE4LjM4NDUgMzkuNDE1NEMyNC4zOTEgNDIuMjE2MyAzMS41MzA4IDM5LjYxNzYgMzQuMzMxNiAzMy42MTExTDMyLjUxOSAzMi43NjU5Wk0zMS4wNjMxIDEyLjIyNjJMMzAuMjE3OCAxNC4wMzg4QzM0LjIyMjIgMTUuOTA2IDM1Ljk1NDYgMjAuNjY1OSAzNC4wODc0IDI0LjY3MDJMMzUuOSAyNS41MTU0TDM3LjcxMjYgMjYuMzYwN0M0MC41MTM1IDIwLjM1NDIgMzcuOTE0OCAxMy4yMTQ0IDMxLjkwODMgMTAuNDEzNkwzMS4wNjMxIDEyLjIyNjJaTTMxLjA2MzEgMTIuMjI2MkwzMS45MDgzIDEwLjQxMzZDMjUuOTAxOCA3LjYxMjcgMTguNzYyMSAxMC4yMTE0IDE1Ljk2MTIgMTYuMjE3OEwxNy43NzM4IDE3LjA2MzFMMTkuNTg2NCAxNy45MDgzQzIxLjQ1MzcgMTMuOTA0IDI2LjIxMzUgMTIuMTcxNiAzMC4yMTc4IDE0LjAzODhMMzEuMDYzMSAxMi4yMjYyWiIgZmlsbD0iI0ZGN0I3QiIgbWFzaz0idXJsKCNwYXRoLTQtaW5zaWRlLTFfOTgxXzI2NTApIi8+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzk4MV8yNjUwIj4KPHBhdGggZD0iTTE3Ljc3MzggMTcuMDYzMUMyMC4xMDc5IDEyLjA1NzcgMjYuMDU3NyA5Ljg5MjEzIDMxLjA2MzEgMTIuMjI2MkMzNi4wNjg1IDE0LjU2MDIgMzguMjM0IDIwLjUxIDM1LjkgMjUuNTE1NEwzMi41MTkgMzIuNzY1OUMzMC4xODUgMzcuNzcxMyAyNC4yMzUyIDM5LjkzNjkgMTkuMjI5OCAzNy42MDI4QzE0LjIyNDQgMzUuMjY4NyAxMi4wNTg4IDI5LjMxODkgMTQuMzkyOSAyNC4zMTM1TDE3Ljc3MzggMTcuMDYzMVoiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==';

      list.forEach(({ id, lat, lng, type }) => {
        let marker;
        const imageSize = new kakao.maps.Size(35, 45); // 마커 이미지 크기
        const imageOption = { offset: new kakao.maps.Point(17.5, 45) }; // 마커 이미지의 옵션 (하단 중앙 기준)
        
        // 이스터에그일 경우 파란색 커스텀 SVG 마커 사용
        if (type === 'EASTER_EGG') {
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
        } else if (type === 'TIME_CAPSULE') {
          // 타임캡슐일 경우 빨간색 커스텀 SVG 마커 사용
          const markerImage = new kakao.maps.MarkerImage(
            timeCapsuleMarkerSvg,
            imageSize,
            imageOption
          );
          
          marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lat, lng),
            image: markerImage,
            map,
          });
        } else {
          // 기본 마커
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
