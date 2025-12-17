export const KAKAO_MAP_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
    />
    <style>
      html, body, #map {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    </style>

    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=__KAKAO_JS_KEY__&autoload=false"></script>
  </head>

  <body>
    <div id="map"></div>

    <script>
      // ======= 상태 =======
      let map = null;
      let markers = {};      // id -> kakao.maps.Marker

      function sendToRN(message) {
        if (window.ReactNativeWebView?.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
        }
      }

      function safeParse(raw) {
        try { return JSON.parse(raw); } catch { return null; }
      }

      // ======= 지도 초기화 (중복 방지) =======
      function initMap(payload) {
        if (!window.kakao || !window.kakao.maps) return;

        window.kakao.maps.load(() => {
          if (map) {
            // 이미 초기화 되어 있으면 center만 갱신
            moveCamera(payload.center);
            sendToRN({ type: "READY" });
            return;
          }

          const container = document.getElementById("map");
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

          sendToRN({ type: "READY" });
        });
      }

      function clearMarkers() {
        Object.values(markers).forEach((m) => m.setMap(null));
        markers = {};
      }

      function setMarkers(list) {
        if (!map) return;
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
        if (!map) return;
        map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
      }

      // ======= RN -> WebView 메시지 수신 =======
      function onMessage(raw) {
        const msg = safeParse(raw);
        if (!msg) return;

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
          default:
            break;
        }
      }

      // React Native WebView 메시지 수신
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.onMessage = (event) => {
          onMessage(event.data);
        };
      }
      
      // 폴백: 일반 window message 이벤트 리스너
      window.addEventListener("message", (e) => {
        if (e.data) {
          onMessage(e.data);
        }
      });
      
      document.addEventListener("message", (e) => {
        if (e.data) {
          onMessage(e.data);
        }
      });
    </script>
  </body>
</html>
`;
