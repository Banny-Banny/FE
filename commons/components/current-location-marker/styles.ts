/**
 * Current Location Marker Styles
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Design System] 현재 위치 마커 스타일 상수
 * - 디자인 시스템 색상 토큰 사용 (Colors)
 * - WebView 내부에서 사용되는 마커 스타일 정의
 */

import { Colors } from '@/commons/constants/color';
import type { CurrentLocationMarkerConfig } from './types';

export const DEFAULT_MARKER_CONFIG: CurrentLocationMarkerConfig = {
  width: 16,
  height: 16,
  backgroundColor: Colors.blue[500], // 디자인 시스템 Blue 색상 사용
  borderColor: Colors.white[50], // 디자인 시스템 White 색상 사용
  borderWidth: 3,
  borderRadius: '50%',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
};
