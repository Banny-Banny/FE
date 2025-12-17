/**
 * app/(taps)/map.tsx
 * 지도 페이지 라우팅
 * 로직 없음 - MapFeature만 렌더링
 */

import { MapFeature } from '@/components/map';
import { withDrawerLayout } from '@/commons/layout/Drawer';

export default withDrawerLayout(MapFeature);

