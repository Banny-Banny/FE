/**
 * components/shared/audio-attachment/hooks/useAudioPreview.ts
 * 오디오 미리보기 Hook (재생 기능)
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] expo-av Audio.Sound 사용
 * - [x] 재생 상태 관리
 */

import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  // URI 변경 시 Sound 객체 생성
  useEffect(() => {
    if (!uri) {
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
          { uri },
          { shouldPlay: false },
          (status) => {
            if (status.isLoaded) {
              setPositionMillis(status.positionMillis || 0);
              setDurationMillis(status.durationMillis || 0);

              // 재생 완료 시
              if (status.didJustFinish) {
                setIsPlaying(false);
                setPositionMillis(0);
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
        console.error('오디오 로드 오류:', error);
      }
    };

    loadSound();

    // 정리 함수
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(console.error);
      }
    };
  }, [uri]);

  /**
   * 재생 시작/일시정지 토글
   */
  const togglePlay = async (): Promise<void> => {
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
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('재생 토글 오류:', error);
    }
  };

  /**
   * 재생 중지 및 리셋
   */
  const stop = async (): Promise<void> => {
    if (!soundRef.current) {
      return;
    }

    try {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
      setIsPlaying(false);
      setPositionMillis(0);
    } catch (error) {
      console.error('재생 중지 오류:', error);
    }
  };

  /**
   * 리소스 정리
   */
  const unload = async (): Promise<void> => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch (error) {
        console.error('리소스 정리 오류:', error);
      }
    }
    setIsPlaying(false);
    setPositionMillis(0);
    setDurationMillis(0);
  };

  return {
    isPlaying,
    positionMillis,
    durationMillis,
    togglePlay,
    stop,
    unload,
  };
};
