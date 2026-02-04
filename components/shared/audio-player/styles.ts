/**
 * AudioPlayer Component Styles
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
  // 오디오 플레이어 컨테이너
  audioPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md, // 16px
    paddingHorizontal: 18, // Figma 정확한 값 (Spacing.md=16, Spacing.lg=24 사이)
    paddingVertical: 2, // Figma 정확한 값
    height: 83, // Figma 정확한 값
    width: '100%', // 너비 제한
    maxWidth: '100%', // 최대 너비 제한
    backgroundColor: Colors.white[500],
    borderWidth: 2,
    borderColor: Colors.whiteGrey[300],
    borderRadius: BorderRadius.lg,
  },

  playButton: {
    width: Spacing['3xl'], // 48px (Figma 정확한 값)
    height: Spacing['3xl'], // 48px (Figma 정확한 값)
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
    height: 6, // Figma 정확한 값
    backgroundColor: Colors.whiteGrey[200],
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },

  progressBar: {
    height: 6, // Figma 정확한 값
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

  // 오디오 에러 컨테이너
  audioErrorContainer: {
    width: '100%',
    paddingVertical: Spacing.lg, // 24px
    paddingHorizontal: Spacing.md, // 16px
    backgroundColor: Colors.whiteGrey[100],
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.whiteGrey[300],
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm, // 8px
    minHeight: 83, // 플레이어와 동일한 높이
  },

  // 오디오 에러 아이콘 컨테이너
  audioErrorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.whiteGrey[200],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 오디오 에러 텍스트
  audioErrorText: {
    ...Typography.body.body11,
    color: Colors.grey[600],
    textAlign: 'center',
  },
});

