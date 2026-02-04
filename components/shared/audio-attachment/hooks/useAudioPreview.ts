/**
 * components/shared/audio-attachment/hooks/useAudioPreview.ts
 * 오디오 미리보기 Hook (재생 기능)
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] expo-audio 사용 (expo-av에서 마이그레이션)
 * - [x] 재생 상태 관리
 */

import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useMemo } from 'react';

interface UseAudioPreviewReturn {
  /** 재생 중 여부 */
  isPlaying: boolean;
  /** 재생 시간 (밀리초) */
  positionMillis: number;
  /** 전체 시간 (밀리초) */
  durationMillis: number;
  /** 재생 시작/일시정지 */
  togglePlay: () => Promise<void>;
  /** 재생 중지 및 리셋 */
  stop: () => Promise<void>;
  /** 리소스 정리 */
  unload: () => Promise<void>;
}

/**
 * 오디오 미리보기 Hook
 * 로컬 URI의 오디오 파일을 재생하는 기능 제공
 */
export const useAudioPreview = (uri: string | null): UseAudioPreviewReturn => {
  // expo-audio의 useAudioPlayer hook 사용
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  // 재생 완료 시 자동 리셋
  useEffect(() => {
    if (status.isLoaded && status.didJustFinish) {
      player.seekTo(0);
    }
  }, [status.didJustFinish, status.isLoaded, player]);

  /**
   * 재생 시작/일시정지 토글
   */
  const togglePlay = async (): Promise<void> => {
    if (!status.isLoaded) {
      return;
    }

    try {
      if (status.playing) {
        player.pause();
      } else {
        player.play();
      }
    } catch (error) {
    }
  };

  /**
   * 재생 중지 및 리셋
   */
  const stop = async (): Promise<void> => {
    if (!status.isLoaded) {
      return;
    }

    try {
      player.pause();
      player.seekTo(0);
    } catch (error) {
    }
  };

  /**
   * 리소스 정리
   * expo-audio는 자동으로 정리되므로 별도 작업 불필요
   */
  const unload = async (): Promise<void> => {
    // expo-audio는 컴포넌트 언마운트 시 자동으로 정리됨
    try {
      if (status.isLoaded) {
        player.pause();
        player.seekTo(0);
      }
    } catch (error) {
    }
  };

  // 밀리초 단위로 변환
  const positionMillis = useMemo(
    () => Math.floor((status.currentTime || 0) * 1000),
    [status.currentTime],
  );
  const durationMillis = useMemo(
    () => Math.floor((status.duration || 0) * 1000),
    [status.duration],
  );

  return {
    isPlaying: status.playing || false,
    positionMillis,
    durationMillis,
    togglePlay,
    stop,
    unload,
  };
};
