/**
 * EggDetailHint Component Types
 * Version: 1.0.0
 * Created: 2025-01-XX
 */

export interface EggHintData {
  /** 이스터에그 제목 */
  title: string;
  /** 거리 (미터) */
  distance: number;
  /** 방향 각도 (0-360도, 북쪽이 0도, 시계방향) */
  direction?: number;
}

export interface EggDetailHintProps {
  /** 토스트 표시 여부 */
  visible: boolean;
  /** 토스트 닫기 함수 */
  onClose: () => void;
}
