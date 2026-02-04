/**
 * VideoPlayer Component
 * 비디오 플레이어 Container Component
 *
 * 비즈니스 로직은 hooks/useVideoPlayer에서 처리하고,
 * 이 컴포넌트는 UI 렌더링만 담당합니다.
 */

import { Image } from 'expo-image';
import { VideoView } from 'expo-video';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Icon from 'react-native-remix-icon';

import { Colors } from '@/commons/constants';

import { useVideoPlayer } from './hooks/useVideoPlayer';
import { styles } from './styles';
import type { VideoPlayerProps } from './types';

// 진행바 컴포넌트 (드래그 가능)
interface ProgressBarProps {
  progress: number;
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, duration, onSeek }) => {
  const containerWidth = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const dragProgress = useSharedValue(progress);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // duration이 0이거나 유효하지 않으면 제스처 무시
      if (duration <= 0 || !isFinite(duration)) {
        return;
      }
      isDragging.value = true;
    })
    .onUpdate((e) => {
      // duration이 0이거나 유효하지 않으면 제스처 무시
      if (duration <= 0 || !isFinite(duration) || containerWidth.value <= 0) {
        return;
      }
      const newProgress = Math.max(0, Math.min(1, e.x / containerWidth.value));
      dragProgress.value = newProgress;
    })
    .onEnd((e) => {
      // duration이 0이거나 유효하지 않으면 제스처 무시
      if (duration <= 0 || !isFinite(duration) || containerWidth.value <= 0) {
        isDragging.value = false;
        return;
      }
      try {
        const newProgress = Math.max(0, Math.min(1, e.x / containerWidth.value));
        const seekTime = newProgress * duration;
        // seekTime이 유효한지 확인
        if (isFinite(seekTime) && seekTime >= 0 && typeof onSeek === 'function') {
          onSeek(seekTime);
          dragProgress.value = newProgress;
        }
      } catch (error) {
        // 에러 로깅을 안전하게 처리
        if (__DEV__) {
          const errorMessage = error instanceof Error ? error.message : String(error);
        }
      } finally {
        isDragging.value = false;
      }
    });

  const progressBarStyle = useAnimatedStyle(() => {
    // duration이 0이거나 유효하지 않으면 진행바를 0으로 설정
    if (duration <= 0 || !isFinite(duration) || containerWidth.value <= 0) {
      return { width: 0 };
    }
    const currentProgress = isDragging.value ? dragProgress.value : progress;
    const width = currentProgress * containerWidth.value;
    return {
      width: Math.max(0, Math.min(containerWidth.value, width || 0)),
    };
  });

  // progress가 변경될 때 dragProgress도 업데이트 (드래그 중이 아닐 때만)
  React.useEffect(() => {
    if (!isDragging.value && isFinite(progress)) {
      dragProgress.value = Math.max(0, Math.min(1, progress));
    }
  }, [progress]);

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={styles.progressBarContainer}
        onLayout={(e) => {
          containerWidth.value = e.nativeEvent.layout.width;
        }}>
        <Animated.View style={[styles.progressBar, progressBarStyle]} />
      </View>
    </GestureDetector>
  );
};

export const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  const {
    isLoading,
    isPlaying,
    currentTime,
    duration,
    progress,
    hasVideo,
    thumbnailUri,
    showControls,
    error,
    handleTogglePlay,
    handleToggleControls,
    handleSeek,
    player,
  } = useVideoPlayer(props);

  // 시간 포맷팅 함수 (순수 함수)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // mediaId가 없거나 로딩 중이면 렌더링하지 않음
  if (!hasVideo) {
    return null;
  }

  // 에러 발생 시 에러 UI 표시
  if (error) {
    return (
      <View style={[styles.videoPlayerContainer, props.containerStyle]}>
        <View style={styles.videoErrorContainer}>
          <View style={styles.videoErrorIconContainer}>
            <Icon name="error-warning-line" size={24} color={Colors.grey[500]} />
          </View>
          <Text style={styles.videoErrorText}>비디오 파일을 재생할 수 없습니다</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.videoPlayerContainer, props.containerStyle]}>
      <View style={styles.videoWrapper}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleTogglePlay}
          disabled={isLoading}
          accessibilityLabel="비디오 재생/일시정지">
          <VideoView
            player={player}
            style={styles.video}
            contentFit="contain"
            nativeControls={false}
            allowsFullscreen={false}
          />

          {/* 썸네일 오버레이 (재생 전에만 표시) */}
          {!isPlaying && thumbnailUri && (
            <View style={styles.thumbnailOverlay} pointerEvents="none">
              <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} contentFit="cover" />
            </View>
          )}

          {/* 플레이/일시정지 버튼 (재생 중이 아닐 때만 표시) */}
          {!isPlaying && (
            <View style={styles.controlsOverlay} pointerEvents="box-none">
              <Pressable
                style={styles.controlButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleTogglePlay();
                }}
                disabled={isLoading}
                accessibilityLabel="재생">
                <Icon name="play-fill" size={28} color={Colors.white[50]} />
              </Pressable>
            </View>
          )}
        </Pressable>
      </View>

      {/* 진행바 및 시간 표시 */}
      <View style={styles.videoControls}>
        <ProgressBar
          progress={progress}
          duration={duration}
          currentTime={currentTime}
          onSeek={handleSeek}
        />
        <Text style={styles.videoTime}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};
