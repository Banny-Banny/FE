/**
 * AudioPlayer Component
 * 오디오 플레이어 Container Component
 *
 * 비즈니스 로직은 hooks/useAudioPlayer에서 처리하고,
 * 이 컴포넌트는 UI 렌더링만 담당합니다.
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Icon from 'react-native-remix-icon';

import { Colors } from '@/commons/constants';

import { useAudioPlayer } from './hooks/useAudioPlayer';
import { styles } from './styles';
import type { AudioPlayerProps } from './types';

export const AudioPlayer: React.FC<AudioPlayerProps> = (props) => {
  // 비즈니스 로직은 hook에서 처리
  const { isLoading, isPlaying, currentTime, progressValue, hasAudio, handleTogglePlay } =
    useAudioPlayer(props);

  // 동적 width를 위한 animated style
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  // 시간 포맷팅 함수 (순수 함수)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // mediaId가 없거나 로딩 중이면 렌더링하지 않음
  if (!hasAudio) {
    return null;
  }

  return (
    <View style={styles.audioPlayerContainer}>
      <Pressable
        style={styles.playButton}
        onPress={handleTogglePlay}
        disabled={isLoading}
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
