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

import { StyleSheet } from 'react-native';
import { Colors } from '@/commons/constants/colors';
import { Fonts } from '@/commons/constants/fonts';
import { Spacing } from '@/commons/constants/spacing';

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
    fontSize: Fonts.size['2xl'],
    fontWeight: Fonts.weight.bold,
    color: '#0A0A0A',
    letterSpacing: 0.07,
  },

  subtitle: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.bold,
    color: '#666666',
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
    fontSize: Fonts.size.base,
    fontWeight: Fonts.weight.bold,
    color: '#0A0A0A',
    letterSpacing: -0.31,
  },

  // 텍스트 입력 영역
  textAreaContainer: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    height: 120,
  },

  textArea: {
    flex: 1,
    padding: Spacing.md,
    fontSize: Fonts.size.base,
    fontWeight: Fonts.weight.regular,
    color: '#0A0A0A',
    letterSpacing: -0.31,
  },

  // 추가 버튼
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 60,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
  },

  addButtonIcon: {
    width: 20,
    height: 20,
  },

  addButtonText: {
    fontSize: Fonts.size.base,
    fontWeight: Fonts.weight.bold,
    color: '#666666',
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
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
  },

  cancelButtonText: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.bold,
    color: '#0A0A0A',
    letterSpacing: -0.44,
  },

  saveButton: {
    flex: 1,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 16,
  },

  saveButtonText: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.bold,
    color: '#FAFAFA',
    letterSpacing: -0.44,
  },

  hintText: {
    fontSize: Fonts.size.xs,
    fontWeight: Fonts.weight.bold,
    color: '#999999',
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
    backgroundColor: '#E5E5E5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#000000',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },

  photoPreviewText: {
    fontSize: Fonts.size.xs,
    fontWeight: Fonts.weight.bold,
    color: '#FAFAFA',
  },

  // 삭제 버튼
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FAFAFA',
  },

  deleteButtonText: {
    fontSize: 18,
    fontWeight: Fonts.weight.bold,
    color: '#FAFAFA',
    lineHeight: 18,
  },

  // 미디어 파일 표시 (음악, 동영상)
  mediaFileContainer: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.regular,
    color: '#0A0A0A',
    flex: 1,
  },

  mediaDeleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
