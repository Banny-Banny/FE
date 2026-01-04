/**
 * AudioPlayer Component
 * 오디오 플레이어 개별 컴포넌트
 */

import React, { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Icon from 'react-native-remix-icon';

import { Colors } from '@/commons/constants';

import { styles } from './styles';
import type { AudioPlayerProps } from './types';

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audio,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
}) => {
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

  return (
    <View style={styles.audioPlayerContainer}>
      <Pressable
        style={styles.playButton}
        onPress={onTogglePlay}
        accessibilityLabel="재생/일시정지">
        <Icon
          name={isPlaying ? 'pause-fill' : 'play-fill'}
          size={20}
          color={Colors.white[50]}
        />
      </Pressable>
      <View style={styles.audioControls}>
        <Icon name="music-2-line" size={20} color={Colors.grey[600]} />
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, progressBarStyle]} />
        </View>
        <Text style={styles.audioTime}>{formatTime(currentTime)}</Text>
      </View>
    </View>
  );
};

