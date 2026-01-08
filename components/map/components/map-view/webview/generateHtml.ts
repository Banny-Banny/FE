/**
 * 카카오맵 WebView HTML 생성
 * API 키를 주입하여 최종 HTML 문자열 생성
 */

import { generateMapScript } from './mapScript';

/**
 * 카카오맵 WebView HTML 생성
 * @param apiKey 카카오맵 JavaScript API 키
 * @returns 완성된 HTML 문자열
 */
export function generateKakaoMapHtml(apiKey: string): string {
  const script = generateMapScript();

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <style>
      html, body, #map {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    </style>
    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false"></script>
  </head>
  <body>
    <div id="map"></div>
    <script>
      // 카카오 맵 SDK 스크립트가 로드된 후에만 내부 스크립트 실행
      (function() {
        function initMapScript() {
          if (window.kakao && window.kakao.maps) {
            ${script}
          } else {
            // 스크립트가 아직 로드되지 않았으면 재시도
            setTimeout(initMapScript, 100);
          }
        }
        
        // DOM이 로드된 후 실행
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initMapScript);
        } else {
          initMapScript();
        }
      })();
    </script>
  </body>
</html>`;
}
