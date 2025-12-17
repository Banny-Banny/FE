/**
 * MapView Component Types
 * Version: 1.0.0
 * Created: 2025-12-17
 */

export interface MapViewProps {
  center?: {
    lat: number;
    lng: number;
  };
  level?: number;
  onMapClick?: (coord: { lat: number; lng: number }) => void;
  onMarkerClick?: (id: string) => void;
}
