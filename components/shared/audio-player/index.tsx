/**
 * AudioPlayer Component
 * 오디오 플레이어 Smart Component
 *
 * 미디어 ID를 받아 내부에서 URL 변환 및 재생 로직을 처리합니다.
 */

import { Audio } from 'expo-av';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Icon from 'react-native-remix-icon';

import { Colors } from '@/commons/constants';
import { getMediaUrl } from '@/utils';

import { styles } from './styles';
import type { AudioPlayerProps } from './types';

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  mediaId,
  audioUrl,
  onPlayStateChange,
  onError,
}) => {
  // 오디오 URL 상태
  const [url, setUrl] = useState<string | null>(audioUrl || null);
  const [isLoading, setIsLoading] = useState(false);

  // 재생 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  // 미디어 ID를 URL로 변환
  useEffect(() => {
    if (!mediaId) {
      setUrl(null);
      return;
    }

    // audioUrl이 이미 있으면 사용 (하위 호환)
    if (audioUrl) {
      setUrl(audioUrl);
      return;
    }

    // mediaId를 URL로 변환
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
  }, [mediaId, audioUrl, onError]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 동적 width를 위한 animated style
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  // mediaId가 없거나 로딩 중이면 렌더링하지 않음
  if (!mediaId && !audioUrl) {
    return null;
  }

  return (
    <View style={styles.audioPlayerContainer}>
      <Pressable
        style={styles.playButton}
        onPress={handleTogglePlay}
        disabled={isLoading || !url}
        accessibilityLabel="재생/일시정지">
        <Icon
          key={isPlaying ? 'pause' : 'play'}
          name={isPlaying ? 'pause-fill' : 'play-fill'}
          size={20}
          color={Colors.white[50]}
        />
      </Pressable>
      <View style={styles.audioControls}>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, progressBarStyle]} />
        </View>
        <Text style={styles.audioTime}>{formatTime(currentTime)}</Text>
      </View>
    </View>
  );
};
