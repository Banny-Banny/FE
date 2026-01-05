/**
 * AudioPlayer Component Styles
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 오디오 플레이어 컨테이너
  audioPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md, // 16px
    paddingHorizontal: 18, // Figma 정확한 값 (Spacing.md=16, Spacing.lg=24 사이)
    paddingVertical: 2,
    height: 83,
    backgroundColor: Colors.white[500],
    borderWidth: 2,
    borderColor: Colors.whiteGrey[300],
    borderRadius: BorderRadius.lg,
  },

  playButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.black[500],
    justifyContent: 'center',
    alignItems: 'center',
  },

  audioControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm, // 8px
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

  // 오디오 시간 "0:00"
  // Figma: fontSize 11, lineHeight 16.5, fontWeight SemiBold, letterSpacing -0.1
  // 가장 유사: body8 (fontSize 12, lineHeight 16, fontWeight semibold, letterSpacing 0)
  audioTime: {
    ...Typography.body.body8,
    color: Colors.grey[600],
  },
});

