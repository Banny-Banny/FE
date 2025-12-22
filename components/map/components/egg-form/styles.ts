/**
 * components/map/components/egg-form/styles.ts
 * 이스터에그 작성 폼 스타일 정의
 *
 * 체크리스트:
 * - [x] StyleSheet.create() 사용
 * - [x] 색상 토큰만 사용 (하드코딩 최소화)
 * - [x] Figma 디자인 기반
 * - [x] 인라인 스타일 0건
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 컨테이너
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  // 헤더
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.header.h5,
    fontSize: 24,
    color: Colors.black[500],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body.body6,
    color: Colors.grey[500],
  },

  // 섹션
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body.body11,
    color: Colors.black[500],
    marginBottom: Spacing.sm,
  },

  // 입력 필드
  inputContainer: {
    backgroundColor: Colors.whiteGrey[100],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 48,
    justifyContent: 'center',
  },
  input: {
    ...Typography.body.body4,
    color: Colors.black[500],
    padding: 0,
  },

  // 텍스트 영역
  textAreaContainer: {
    backgroundColor: Colors.whiteGrey[100],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    minHeight: 120,
    position: 'relative',
  },
  textArea: {
    ...Typography.body.body4,
    color: Colors.black[500],
    padding: 0,
    flex: 1,
  },
  charCountContainer: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.md,
  },
  charCount: {
    ...Typography.body.body7,
    color: Colors.grey[500],
  },

  // 첨부파일 버튼 컨테이너 (3개 버튼)
  // 레이아웃 고정: 미리보기 컨테이너와 동일한 크기 유지
  attachmentButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 120, // 미리보기 컨테이너와 동일한 높이 (고정)
  },
  attachmentButton: {
    width: '31%', // 3개 버튼이므로 각각 약 33%에서 margin 고려하여 31%로 설정
    backgroundColor: Colors.white[100],
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: Spacing.md,
    height: 120, // 미리보기와 동일한 높이 (고정)
    position: 'relative',
    overflow: 'hidden', // 미리보기가 버튼 영역을 벗어나지 않도록
  },
  attachmentButtonLast: {
    marginRight: 0,
  },
  photoButton: {
    borderColor: Colors.red[200],
  },
  musicButton: {
    borderColor: Colors.blue[200],
  },
  videoButton: {
    borderColor: Colors.red[200],
  },
  attachmentButtonText: {
    ...Typography.body.body9,
    color: Colors.black[500],
    marginTop: Spacing.xs,
  },
  attachmentButtonDisabled: {
    borderColor: Colors.grey[300],
    backgroundColor: Colors.grey[100],
  },
  attachmentButtonTextDisabled: {
    color: Colors.grey[400],
  },

  // 실제 이미지/썸네일 (버튼 위에 오버레이)
  attachmentPreviewImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // 플레이스홀더 (썸네일 생성 중 또는 음악)
  attachmentPreviewImagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteGrey[200],
  },
  attachmentPreviewLabel: {
    position: 'absolute',
    bottom: Spacing.xs,
    left: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: Colors.darkGrey[800],
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs / 2, // 2px 대신 Spacing 토큰 사용
    zIndex: 1, // 삭제 버튼보다 아래에 표시
  },
  attachmentPreviewText: {
    ...Typography.body.body7,
    color: Colors.white[100],
  },
  deleteButton: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.black[500],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2, // 미리보기 위에 표시
  },

  // 숨기기 버튼
  hideButton: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hideButtonInactive: {
    backgroundColor: Colors.whiteGrey[300],
  },
  hideButtonInactiveText: {
    ...Typography.body.body11,
    color: Colors.grey[500],
  },
  hideButtonActive: {
    backgroundColor: Colors.black[500],
  },
  hideButtonText: {
    ...Typography.body.body11,
    color: Colors.white[100],
  },
});
