/**
 * AudioPlayer Component Types
 */

export interface AudioPlayerProps {
  /** 오디오 미디어 ID (API에서 받은 audioMediaId) */
  mediaId: string | null;
  /** 직접 오디오 URL 전달 (하위 호환용, mediaId가 있으면 무시됨) */
  audioUrl?: string | null;
  /** 재생 상태 변경 시 호출되는 콜백 */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** 에러 발생 시 호출되는 콜백 */
  onError?: (error: Error) => void;
}

