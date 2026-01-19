/**
 * components/customer-service/components/chat-input/styles.ts
 * 채팅 입력창 스타일 정의
 *
 * 네이버 톡톡 스타일의 입력창 UI
 */

import { Colors, Typography, Spacing, BorderRadius } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Input Container
  // ============================================
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.white[50],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },

  // ============================================
  // Text Input
  // ============================================
  textInputContainer: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: Colors.whiteGrey[100],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    justifyContent: 'center',
  },
  textInput: {
    ...Typography.body.body6,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.black[500],
    padding: 0, // TextInput 기본 padding 제거
    textAlignVertical: 'center',
  },

  // ============================================
  // Attachment Button
  // ============================================
  attachmentButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.whiteGrey[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ============================================
  // Send Button
  // ============================================
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.grey[300],
  },
});
