/**
 * useAudioPlayer Hook
 * 오디오 플레이어 비즈니스 로직
 *
 * 미디어 ID 또는 URL을 받아서, URL이면 그대로 사용하고 ID면 URL로 변환한 후 오디오 재생 상태를 관리합니다.
 */

import { Audio } from 'expo-av';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { getMediaUrl } from '@/utils';

import type { AudioPlayerProps } from '../types';

/**
 * 문자열이 URL인지 확인
 */
const isUrl = (value: string): boolean => {
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:');
};

export interface UseAudioPlayerReturn {
  // 상태
  isLoading: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  progressValue: ReturnType<typeof useSharedValue<number>>;
  hasAudio: boolean;

  // 핸들러
  handleTogglePlay: () => Promise<void>;

  // 스타일
  progressBarStyle: { width: string };
}

/**
 * 오디오 플레이어 비즈니스 로직 훅
 */
export const useAudioPlayer = ({
  mediaId,
  onPlayStateChange,
  onError,
}: AudioPlayerProps): UseAudioPlayerReturn => {
  // 오디오 URL 상태
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 재생 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  // mediaId가 URL인지 ID인지 판단하여 URL로 변환
  useEffect(() => {
    if (!mediaId) {
      setUrl(null);
      return;
    }

    // 이미 URL이면 그대로 사용
    if (isUrl(mediaId)) {
      setUrl(mediaId);
      return;
    }

    // ID인 경우 URL로 변환
    const convertMediaId = async () => {
      setIsLoading(true);
      try {
        const convertedUrl = await getMediaUrl(mediaId);
        setUrl(convertedUrl);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('미디어 URL 변환 실패');
        if (__DEV__) {
          console.error('[AudioPlayer] 미디어 URL 변환 실패:', err);
        }
        onError?.(err);
        setUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    convertMediaId();
  }, [mediaId, onError]);

  // 오디오 로드 및 재생 상태 관리
  useEffect(() => {
    if (!url) {
      // URL이 없으면 기존 Sound 객체 정리
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(console.error);
        soundRef.current = null;
      }
      setIsPlaying(false);
      setPositionMillis(0);
      setDurationMillis(0);
      return;
    }

    const loadSound = async () => {
      try {
        // 기존 Sound 객체가 있으면 정리
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }

        // 새로운 Sound 객체 생성
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: false },
          (status) => {
            if (status.isLoaded) {
              setPositionMillis(status.positionMillis || 0);
              setDurationMillis(status.durationMillis || 0);

              // 재생 완료 시
              if (status.didJustFinish) {
                setIsPlaying(false);
                setPositionMillis(0);
                onPlayStateChange?.(false);
              }
            }
          },
        );

        soundRef.current = sound;

        // 초기 duration 가져오기
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setDurationMillis(status.durationMillis || 0);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('오디오 로드 실패');
        if (__DEV__) {
          console.error('[AudioPlayer] 오디오 로드 오류:', err);
        }
        onError?.(err);
      }
    };

    loadSound();

    // 정리 함수
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(console.error);
        soundRef.current = null;
      }
    };
  }, [url, onError, onPlayStateChange]);

  // 재생/일시정지 토글
  const handleTogglePlay = async () => {
    if (!soundRef.current) {
      return;
    }

    try {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) {
        return;
      }

      if (status.isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        onPlayStateChange?.(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
        onPlayStateChange?.(true);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('재생 토글 실패');
      if (__DEV__) {
        console.error('[AudioPlayer] 재생 토글 오류:', err);
      }
      onError?.(err);
    }
  };

  // 재생 상태가 변경될 때 콜백 호출
  useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  // progress 계산 (초 단위로 변환)
  const currentTime = useMemo(() => positionMillis / 1000, [positionMillis]);
  const duration = useMemo(() => durationMillis / 1000, [durationMillis]);
  const progress = useMemo(
    () => (duration > 0 ? currentTime / duration : 0),
    [currentTime, duration],
  );
  const progressValue = useSharedValue(progress);

  // progress 값이 변경될 때마다 업데이트
  useEffect(() => {
    progressValue.value = progress;
  }, [progress, progressValue]);

  // 동적 width를 위한 animated style 계산
  const progressBarStyle = useMemo(
    () => ({
      width: `${progress * 100}%`,
    }),
    [progress],
  );

  // 오디오 존재 여부
  const hasAudio = Boolean(mediaId);

  return {
    isLoading,
    isPlaying,
    currentTime,
    duration,
    progress,
    progressValue,
    hasAudio,
    handleTogglePlay,
    progressBarStyle,
  };
};
