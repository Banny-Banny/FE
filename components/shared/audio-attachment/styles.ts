/**
 * components/shared/audio-attachment/styles.ts
 * 오디오 첨부 모달 스타일 정의
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] 색상 토큰만 사용 (하드코딩 금지)
 * - [x] Typography 토큰 사용
 * - [x] Spacing 토큰 사용
 * - [x] BorderRadius 토큰 사용
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.white[500],
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.header.h1,
    color: Colors.black[500],
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },

  // 탭 버튼
  tabContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  tabButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteGrey[100],
    borderRadius: BorderRadius.md,
  },
  tabButtonActive: {
    backgroundColor: Colors.black[500],
  },
  tabButtonText: {
    ...Typography.body.body11,
    color: Colors.grey[500],
  },
  tabButtonTextActive: {
    ...Typography.body.body11,
    color: Colors.white[500],
  },

  // 컨텐츠 영역
  content: {
    minHeight: 266,
    paddingVertical: Spacing.xl,
  },

  // 직접 녹음 탭
  recordContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  timerContainer: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    ...Typography.header.h5,
    color: Colors.black[500],
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.whiteGrey[100],
    borderWidth: 1.5,
    borderColor: Colors.whiteGrey[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: Colors.black[500],
    borderColor: Colors.black[500],
  },
  hintText: {
    ...Typography.body.body10,
    color: Colors.grey[500],
  },

  // 파일 업로드 탭
  uploadContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    width: '100%',
    minHeight: 184,
    backgroundColor: Colors.white[500],
    borderWidth: 1.5,
    borderColor: Colors.whiteGrey[500],
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  uploadButtonTitle: {
    ...Typography.caption.caption1,
    color: Colors.black[500],
  },
  uploadButtonSubtitle: {
    ...Typography.body.body8,
    color: Colors.grey[500],
  },

  // 미리보기 영역
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  previewTitle: {
    ...Typography.header.h3,
    color: Colors.black[500],
  },
  previewFileName: {
    ...Typography.body.body10,
    color: Colors.grey[500],
    maxWidth: '100%',
  },
  playbackContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  playButton: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    ...Typography.body.body10,
    color: Colors.grey[500],
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    marginTop: Spacing.md,
  },
  resetButton: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteGrey[100],
    borderRadius: BorderRadius.md,
  },
  resetButtonText: {
    ...Typography.body.body11,
    color: Colors.grey[500],
  },
  confirmButton: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black[500],
    borderRadius: BorderRadius.md,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.whiteGrey[100],
  },
  confirmButtonText: {
    ...Typography.body.body11,
    color: Colors.white[500],
  },
  confirmButtonTextDisabled: {
    color: Colors.grey[500],
  },
});
