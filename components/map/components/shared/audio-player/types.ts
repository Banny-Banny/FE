/**
 * AudioPlayer Component Types
 */

import type { MediaItem } from '../types';

export interface AudioPlayerProps {
  /** 오디오 미디어 아이템 */
  audio: MediaItem;
  /** 재생 중 여부 */
  isPlaying: boolean;
  /** 현재 재생 시간 (초) */
  currentTime: number;
  /** 전체 재생 시간 (초) */
  duration: number;
  /** 재생/일시정지 토글 함수 */
  onTogglePlay: () => void;
}

