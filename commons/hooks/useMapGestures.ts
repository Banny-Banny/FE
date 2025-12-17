/**
 * components/map/components/map-view/hooks/useMapGestures.ts
 * 지도 줌/패닝 제어 로직 (UI Logic)
 */

import { useState } from 'react';

export const useMapGestures = () => {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
  };

  return {
    scale,
    handleZoomIn,
    handleZoomOut,
    resetZoom,
  };
};
