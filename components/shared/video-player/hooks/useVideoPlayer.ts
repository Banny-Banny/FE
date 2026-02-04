/**
 * useVideoPlayer Hook
 * 비디오 플레이어 비즈니스 로직
 *
 * 미디어 ID 또는 URL을 받아서, URL이면 그대로 사용하고 ID면 URL로 변환한 후 비디오 재생 상태를 관리합니다.
 */

import { useVideoPlayer as useExpoVideoPlayer } from 'expo-video';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { getMediaUrl } from '@/utils';

import type { VideoPlayerProps } from '../types';

/**
 * 문자열이 URL인지 확인
 */
const isUrl = (value: string): boolean => {
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:');
};

/**
 * AbortError를 조용히 무시하는 헬퍼 함수
 */
const safePause = (player: ReturnType<typeof useExpoVideoPlayer> | null | undefined): void => {
  if (!player) return;
  try {
    player.pause();
  } catch (error) {
    // AbortError는 조용히 무시
    if (!(error instanceof Error && error.name === 'AbortError')) {
      if (__DEV__) {
      }
    }
  }
};

const safePlay = (player: ReturnType<typeof useExpoVideoPlayer> | null | undefined): void => {
  if (!player) return;
  try {
    player.play();
  } catch (error) {
    // AbortError는 조용히 무시
    if (!(error instanceof Error && error.name === 'AbortError')) {
      if (__DEV__) {
      }
    }
  }
};

const safeReplace = (
  player: ReturnType<typeof useExpoVideoPlayer> | null | undefined,
  url: string,
): void => {
  if (!player || typeof player.replace !== 'function') return;
  try {
    player.replace(url);
  } catch (error) {
    // AbortError는 조용히 무시
    if (!(error instanceof Error && error.name === 'AbortError')) {
      if (__DEV__) {
      }
    }
  }
};

export interface UseVideoPlayerReturn {
  // 상태
  isLoading: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  progressValue: ReturnType<typeof useSharedValue<number>>;
  hasVideo: boolean;
  thumbnailUri: string | null;
  showControls: boolean;
  error: Error | null;

  // 핸들러
  handleTogglePlay: () => void;
  handleSeek: (time: number) => void;
  handleToggleControls: () => void;

  // VideoView props
  player: ReturnType<typeof useExpoVideoPlayer>;
}

/**
 * 비디오 플레이어 비즈니스 로직 훅
 */
export const useVideoPlayer = ({
  mediaId,
  thumbnailUrl,
  onPlayStateChange,
  onError,
}: VideoPlayerProps): UseVideoPlayerReturn => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(thumbnailUrl || null);
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 재생 방지를 위한 플래그
  const shouldPreventAutoPlay = useRef(true);
  const userInitiatedPlay = useRef(false);

  // 전역 unhandled rejection 핸들러 설정 (AbortError 무시)
  // 웹 환경에서만 처리 (React Native에서는 필요 없음)
  useEffect(() => {
    // 웹 환경에서만 unhandled rejection 이벤트 리스너 추가
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      typeof window.addEventListener === 'function'
    ) {
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        // AbortError는 조용히 무시
        if (event.reason instanceof Error && event.reason.name === 'AbortError') {
          event.preventDefault();
          return;
        }
      };

      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      return () => {
        if (typeof window.removeEventListener === 'function') {
          window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        }
      };
    }
  }, []);

  // expo-video의 useVideoPlayer hook 사용
  // url이 없으면 임시 더미 URL 사용
  const player = useExpoVideoPlayer(
    url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    (player) => {
      // 재생 상태 변경 감지 (안전하게 접근)
      try {
        const playing = player?.playing;
        if (playing !== undefined) {
          // 자동 재생 방지: 사용자가 명시적으로 재생하지 않은 경우 자동 재생 차단
          if (playing && !userInitiatedPlay.current) {
            // pause() 호출 시 에러 무시 (AbortError 방지)
            safePause(player);
            setIsPlaying(false);
            return;
          }
          setIsPlaying(playing);
          onPlayStateChange?.(playing);
        }
      } catch (error) {
        if (__DEV__) {
        }
      }
    },
  );

  // 자동 재생 방지: player가 생성되거나 업데이트될 때마다 강제로 재생 중지
  useEffect(() => {
    if (!player) return;

    // 즉시 재생 중지 (안전하게 접근)
    try {
      const playing = player?.playing;
      if (playing) {
        safePause(player);
        setIsPlaying(false);
      }
    } catch (error) {
      if (__DEV__) {
      }
    }

    // 주기적으로 체크해서 자동 재생되는 것을 막기 (안전하게 접근)
    const interval = setInterval(() => {
      try {
        const playing = player?.playing;
        if (playing && !userInitiatedPlay.current) {
          safePause(player);
          setIsPlaying(false);
        }
      } catch (error) {
        if (__DEV__) {
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [player]);

  // url이 변경되면 player의 source 업데이트
  useEffect(() => {
    if (!url || !player || typeof player.replace !== 'function') return;

    // URL 변경 시 사용자 재생 플래그 리셋
    userInitiatedPlay.current = false;
    shouldPreventAutoPlay.current = true;

    // replace 호출 전에 이미 pause 상태로 만들기 (자동 재생 방지, 안전하게 접근)
    try {
      const playing = player?.playing;
      if (playing) {
        safePause(player);
      }
    } catch {
      // playing 접근 에러 무시
    }

    // replace 호출 (에러 무시)
    safeReplace(player, url);

    // replace 후 재생 중지 (에러 무시, 더 긴 딜레이로 경쟁 조건 완화, 안전하게 접근)
    const timeouts = [100, 300, 500].map((delay) =>
      setTimeout(() => {
        try {
          const playing = player?.playing;
          if (playing && !userInitiatedPlay.current) {
            safePause(player);
            setIsPlaying(false);
          }
        } catch (error) {
          if (__DEV__) {
          }
        }
      }, delay),
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [url, player]);

  // mediaId가 URL인지 ID인지 판단하여 URL로 변환
  useEffect(() => {
    // mediaId가 변경될 때마다 재생 상태 초기화 및 자동 재생 방지 플래그 리셋
    shouldPreventAutoPlay.current = true;
    userInitiatedPlay.current = false;
    setIsPlaying(false);
    if (player) {
      // pause() 호출 시 에러 무시
      safePause(player);
    }

    if (!mediaId) {
      setUrl(null);
      setError(null);
      return;
    }

    // 이미 URL이면 그대로 사용
    if (isUrl(mediaId)) {
      setUrl(mediaId);
      setError(null);
      return;
    }

    // ID인 경우 URL로 변환
    const convertMediaId = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const convertedUrl = await getMediaUrl(mediaId);
        setUrl(convertedUrl);
        setError(null);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('미디어 URL 변환 실패');
        if (__DEV__) {
        }
        setError(err);
        onError?.(err);
        setUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    convertMediaId();
  }, [mediaId, onError, player]);

  // 썸네일 생성 (thumbnailUrl이 없고 url이 있을 때)
  useEffect(() => {
    if (thumbnailUrl) {
      setThumbnailUri(thumbnailUrl);
      return;
    }

    if (!url) {
      setThumbnailUri(null);
      return;
    }

    const generateThumbnail = async () => {
      // 웹 플랫폼에서는 썸네일 생성이 지원되지 않음
      if (Platform.OS === 'web') {
        setThumbnailUri(null);
        return;
      }

      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(url, {
          time: 1000, // 1초 지점의 썸네일
          quality: 0.8,
        });
        setThumbnailUri(uri);
      } catch (error) {
        if (__DEV__) {
        }
        // 썸네일 생성 실패해도 비디오는 재생 가능
        setThumbnailUri(null);
      }
    };

    generateThumbnail();
  }, [url, thumbnailUrl]);

  // 재생/일시정지 토글
  const handleTogglePlay = useCallback(() => {
    if (!player || !url) return;
    try {
      // 사용자가 명시적으로 재생 버튼을 누른 경우
      userInitiatedPlay.current = true;
      shouldPreventAutoPlay.current = false;

      // 안전하게 playing 상태 읽기
      const playing = player?.playing;
      if (playing) {
        safePause(player);
        setIsPlaying(false);
        onPlayStateChange?.(false);
      } else {
        safePlay(player);
        setIsPlaying(true);
        onPlayStateChange?.(true);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('재생 토글 실패');
      if (__DEV__) {
      }
      setError(err);
      onError?.(err);
    }
  }, [player, url, onError, onPlayStateChange]);

  // 특정 시간으로 이동 (밀리초 단위)
  const handleSeek = useCallback(
    (time: number) => {
      if (!player) return;
      // time이 유효하지 않으면 무시
      if (!isFinite(time) || time < 0) {
        if (__DEV__) {
        }
        return;
      }
      try {
        const seekTimeMs = time * 1000; // 초를 밀리초로 변환
        // seekTimeMs가 유효한지 확인하고 player가 currentTime 속성을 가지고 있는지 확인
        if (isFinite(seekTimeMs) && seekTimeMs >= 0 && player && 'currentTime' in player) {
          player.currentTime = seekTimeMs;
        }
      } catch (error) {
        // 에러 로깅을 안전하게 처리
        if (__DEV__) {
          const errorMessage = error instanceof Error ? error.message : String(error);
        }
      }
    },
    [player],
  );

  // 컨트롤 표시/숨김 토글 (사용하지 않음 - 버튼은 항상 표시)
  const handleToggleControls = useCallback(() => {
    // 영상 클릭 시 재생/일시정지 토글
    handleTogglePlay();
  }, [handleTogglePlay]);

  // 진행 상태 계산 (초 단위로 변환)
  const currentTime = useMemo(() => {
    if (!player?.currentTime) return 0;
    return player.currentTime / 1000;
  }, [player?.currentTime]);

  const duration = useMemo(() => {
    if (!player?.duration || player.duration === 0) return 0;
    return player.duration / 1000;
  }, [player?.duration]);

  const progress = useMemo(
    () => (duration > 0 ? currentTime / duration : 0),
    [currentTime, duration],
  );

  const progressValue = useSharedValue(progress);

  // progress 값이 변경될 때마다 업데이트
  useEffect(() => {
    progressValue.value = withTiming(progress, { duration: 100 });
  }, [progress, progressValue]);

  const hasVideo = Boolean(mediaId);

  return {
    isLoading,
    isPlaying,
    currentTime,
    duration,
    progress,
    progressValue,
    hasVideo,
    thumbnailUri,
    showControls,
    error,
    handleTogglePlay,
    handleSeek,
    handleToggleControls,
    player,
  };
};
