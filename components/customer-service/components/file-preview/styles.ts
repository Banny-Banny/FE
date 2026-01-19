/**
 * components/customer-service/components/file-preview/styles.ts
 * 파일 미리보기 컴포넌트 스타일 정의
 */

import { Colors, Spacing, BorderRadius, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Container
  // ============================================
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  // ============================================
  // Image Preview
  // ============================================
  imagePreviewWrapper: {
    width: Spacing['4xl'] + Spacing['2xl'], // 104px (100px는 토큰에 없어 가장 가까운 값 사용)
    height: Spacing['4xl'] + Spacing['2xl'], // 104px
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageRemoveButtonContainer: {
    marginTop: Spacing.xs, // top: 4px 대체
    marginRight: Spacing.xs, // right: 4px 대체
    marginLeft: -(Spacing.lg + Spacing.xs), // 오른쪽 정렬을 위해 음수 마진 사용
  },
  imageRemoveButton: {
    width: Spacing.lg, // 24px
    height: Spacing.lg, // 24px
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.black[500],
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageRemoveButtonText: {
    color: Colors.white[50],
    fontSize: 14,
    fontWeight: 'bold',
  },

  // ============================================
  // File Preview
  // ============================================
  filePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteGrey[100],
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    minWidth: Spacing['4xl'] * 3, // 192px (200px는 토큰에 없어 가장 가까운 값 사용)
    maxWidth: '100%',
  },
  filePreviewIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.blue[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  filePreviewContent: {
    flex: 1,
  },
  filePreviewName: {
    ...Typography.body.body6, // fontSize: 14
    color: Colors.black[500],
    marginBottom: Spacing.xs / 2, // 2px (토큰에 없어 xs/2 사용)
  },
  filePreviewSize: {
    ...Typography.body.body9, // fontSize: 12
    color: Colors.grey[500],
  },
  fileRemoveButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
});
