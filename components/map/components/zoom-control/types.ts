/**
 * ZoomControl Component Types
 * Version: 1.0.0
 * Created: 2025-01-XX
 */

export interface ZoomControlProps {
  /**
   * 확대 버튼 클릭 핸들러
   */
  onZoomIn: () => void;
  /**
   * 축소 버튼 클릭 핸들러
   */
  onZoomOut: () => void;
  /**
   * 줌 리셋 버튼 클릭 핸들러 (선택적)
   */
  onReset?: () => void;
  /**
   * 확대 버튼 활성화 여부
   */
  canZoomIn?: boolean;
  /**
   * 축소 버튼 활성화 여부
   */
  canZoomOut?: boolean;
}

