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

import {
  BorderRadius,
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Spacing,
} from '@/commons/constants';
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
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black[500],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.variable,
    color: Colors.grey[500],
  },

  // 섹션
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.variable,
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
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.variable,
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
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.variable,
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
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.variable,
    color: Colors.grey[500],
  },

  // 첨부파일 버튼 컨테이너 (3개 버튼)
  attachmentButtonsContainer: {
    flexDirection: 'row',
  },
  attachmentButton: {
    flex: 1,
    backgroundColor: Colors.white[100],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: Spacing.md,
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
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.variable,
    color: Colors.black[500],
    marginTop: Spacing.xs,
  },

  // 첨부파일 미리보기 컨테이너
  attachmentPreviewContainer: {
    flexDirection: 'row',
  },
  attachmentPreview: {
    flex: 1,
    position: 'relative',
  },
  attachmentPreviewMargin: {
    marginRight: Spacing.md,
  },
  attachmentPreviewIcon: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  attachmentPreviewIconPhoto: {
    backgroundColor: Colors.red[50],
  },
  attachmentPreviewIconMusic: {
    backgroundColor: Colors.blue[50],
  },
  attachmentPreviewIconVideo: {
    backgroundColor: Colors.red[50],
  },
  attachmentPreviewLabel: {
    backgroundColor: Colors.darkGrey[800],
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs / 2, // 2px 대신 Spacing 토큰 사용
  },
  attachmentPreviewText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.variable,
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
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.variable,
    color: Colors.grey[500],
  },
  hideButtonActive: {
    backgroundColor: Colors.black[500],
  },
  hideButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.variable,
    color: Colors.white[100],
  },
});
