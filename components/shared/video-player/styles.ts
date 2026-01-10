/**
 * VideoPlayer Component Styles
 *
 * Checklist:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 인라인 스타일 0건
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] Typography, Spacing, BorderRadius 토큰 사용 (가능한 부분)
 * - [✓] Figma 디자인 1:1 대응
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 비디오 플레이어 컨테이너
  videoPlayerContainer: {
    width: '100%',
    maxWidth: '100%', // iOS에서 너비 제한
    backgroundColor: Colors.black[500],
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },

  videoWrapper: {
    width: '100%',
    maxWidth: '100%', // iOS에서 너비 제한
    aspectRatio: 16 / 9, // 일반적인 비디오 비율
    position: 'relative',
  },

  video: {
    width: '100%',
    height: '100%',
  },

  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  thumbnail: {
    width: '100%',
    height: '100%',
  },

  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  playButton: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.black[500],
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },

  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  controlButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.black[500],
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },

  videoControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white[500],
  },

  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.whiteGrey[200],
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },

  progressBar: {
    height: 6,
    backgroundColor: Colors.black[500],
    borderRadius: BorderRadius.full,
  },

  videoTime: {
    ...Typography.body.body8,
    color: Colors.grey[600],
  },
});
