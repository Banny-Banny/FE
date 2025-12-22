/**
 * components/timecapsule-create/components/write-bottomsheet/styles.ts
 * UserBottomSheet 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 최소화)
 * - [✓] 인라인 스타일 금지
 * - [✓] Figma 디자인 1:1 대응
 */

import { Colors, FontFamily, FontSize, FontWeight, Spacing } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  // 헤더
  header: {
    marginBottom: Spacing.lg,
  },

  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black.darker,
    letterSpacing: 0.07,
  },

  subtitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black[500],
    marginTop: Spacing.sm,
    letterSpacing: -0.15,
  },

  // 섹션
  section: {
    marginBottom: Spacing.lg,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  sectionIcon: {
    width: 20,
    height: 20,
  },

  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black.darker,
    letterSpacing: -0.31,
  },

  // 텍스트 입력 영역
  textAreaContainer: {
    backgroundColor: Colors.white[100],
    borderWidth: 1,
    borderColor: Colors.white[200],
    borderRadius: 16,
    height: 120,
  },

  textArea: {
    flex: 1,
    padding: Spacing.md,
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    fontFamily: FontFamily.variable,
    color: Colors.black.darker,
    letterSpacing: -0.31,
  },

  // 추가 버튼
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 60,
    backgroundColor: Colors.white[100],
    borderWidth: 1,
    borderColor: Colors.white[200],
    borderRadius: 16,
  },

  addButtonIcon: {
    width: 20,
    height: 20,
  },

  addButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black[500],
    letterSpacing: -0.31,
    textAlign: 'center',
  },

  // 하단 버튼 영역 (공통 컴포넌트의 footer 스타일 사용)
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },

  cancelButton: {
    flex: 1,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white[100],
    borderWidth: 1,
    borderColor: Colors.white[200],
    borderRadius: 16,
  },

  cancelButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black.darker,
    letterSpacing: -0.44,
  },

  saveButton: {
    flex: 1,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black.darker,
    borderWidth: 1,
    borderColor: Colors.black.darker,
    borderRadius: 16,
  },

  saveButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.white[50],
    letterSpacing: -0.44,
  },

  hintText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.black[500],
    textAlign: 'center',
  },

  // 사진 미리보기 - 그리드 배치
  photoGridContainer: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  photoPreviewItem: {
    width: 107,
    height: 107,
    position: 'relative',
  },

  photoPreview: {
    width: 107,
    height: 103,
    backgroundColor: Colors.white[200],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.white[200],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  photoPreviewImage: {
    width: 32,
    height: 32,
  },

  photoPreviewLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: Colors.black.darker,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },

  photoPreviewText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.white[50],
  },

  // 삭제 버튼
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.black.darker,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white[50],
  },

  deleteButtonText: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.variable,
    color: Colors.white[50],
    lineHeight: 18,
  },

  // 미디어 파일 표시 (음악, 동영상)
  mediaFileContainer: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white[100],
    borderWidth: 1,
    borderColor: Colors.white[200],
    borderRadius: 16,
    padding: Spacing.md,
  },

  mediaFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },

  mediaFileIcon: {
    width: 24,
    height: 24,
  },

  mediaFileName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.black.darker,
    flex: 1,
  },

  mediaDeleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.black.darker,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
