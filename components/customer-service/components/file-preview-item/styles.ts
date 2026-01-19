/**
 * components/customer-service/components/file-preview-item/styles.ts
 * 파일 미리보기 아이템 컴포넌트 스타일 정의
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  filePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteGrey[100],
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    minWidth: Spacing['4xl'] * 3, // 192px
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
    marginBottom: Spacing.xs / 2, // 2px
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
