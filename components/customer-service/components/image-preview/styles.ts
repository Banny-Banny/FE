/**
 * components/customer-service/components/image-preview/styles.ts
 * 이미지 미리보기 컴포넌트 스타일 정의
 */

import { BorderRadius, Colors, Spacing } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  imagePreviewWrapper: {
    width: Spacing['4xl'] + Spacing['2xl'], // 104px
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
});
