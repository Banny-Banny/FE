/**
 * components/customer-service/components/chat-message-list/styles.ts
 * 채팅 메시지 리스트 스타일 정의
 *
 * 네이버 톡톡 스타일의 채팅 UI
 */

import { Colors, Typography, Spacing, BorderRadius } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================
  // Message List Container
  // ============================================
  listContainer: {
    flex: 1,
    backgroundColor: Colors.white[50],
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },

  // ============================================
  // Message Container
  // ============================================
  messageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  messageContainerUser: {
    alignItems: 'flex-end',
  },

  // ============================================
  // Message Bubble
  // ============================================
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  messageBubbleUser: {
    backgroundColor: Colors.blue[500], // 사용자 메시지: 파란색 배경
    borderColor: Colors.blue[500],
  },
  messageBubbleAdmin: {
    backgroundColor: Colors.whiteGrey[100], // 관리자 메시지: 회색 배경
    borderColor: Colors.border.light,
  },

  // ============================================
  // Message Text
  // ============================================
  messageText: {
    ...Typography.body.body6,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  messageTextUser: {
    color: Colors.white[50], // 사용자 메시지: 흰색 텍스트
  },
  messageTextAdmin: {
    color: Colors.black[500], // 관리자 메시지: 검은색 텍스트
  },

  // ============================================
  // Message Footer (시간 및 상태)
  // ============================================
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs / 2,
    paddingRight: Spacing.xs,
  },
  messageFooterAdmin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs / 2,
    paddingLeft: Spacing.xs,
  },

  // ============================================
  // Message Time
  // ============================================
  messageTimeContainer: {
    // 시간 컨테이너는 추가 스타일 불필요
  },
  messageTimeText: {
    ...Typography.body.body9,
    fontSize: 11,
    lineHeight: 14,
    color: Colors.grey[600],
  },

  // ============================================
  // Message Status
  // ============================================
  messageStatusContainer: {
    // 상태 아이콘 컨테이너는 추가 스타일 불필요
  },

  // ============================================
  // Loading Indicator
  // ============================================
  loadingContainer: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },

  // ============================================
  // Attachments
  // ============================================
  attachmentsContainer: {
    gap: Spacing.sm,
  },
  attachmentsContainerWithContent: {
    marginTop: Spacing.sm,
  },
  imageAttachment: {
    width: Spacing['4xl'] * 3, // 192px (200px는 토큰에 없어 가장 가까운 값 사용)
    height: Spacing['4xl'] * 3, // 192px
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.whiteGrey[200],
  },
  imageAttachmentImage: {
    width: '100%',
    height: '100%',
  },
  fileAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.whiteGrey[200],
    gap: Spacing.sm,
    minWidth: Spacing['4xl'] * 3, // 192px (200px는 토큰에 없어 가장 가까운 값 사용)
    maxWidth: '100%',
  },
  fileAttachmentUser: {
    backgroundColor: Colors.blue[400],
  },
  fileAttachmentIcon: {
    width: Spacing.xl, // 32px
    height: Spacing.xl, // 32px
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileAttachmentIconUser: {
    backgroundColor: Colors.blue[300],
  },
  fileAttachmentContent: {
    flex: 1,
  },
  fileAttachmentName: {
    ...Typography.body.body6, // fontSize: 14
    fontWeight: '500',
    marginBottom: Spacing.xs / 2, // 2px (토큰에 없어 xs/2 사용)
  },
  fileAttachmentNameUser: {
    color: Colors.white[50],
  },
  fileAttachmentNameAdmin: {
    color: Colors.black[500],
  },
  fileAttachmentSize: {
    ...Typography.body.body9, // fontSize: 12
  },
  fileAttachmentSizeUser: {
    color: Colors.white[50],
    opacity: 0.8,
  },
  fileAttachmentSizeAdmin: {
    color: Colors.grey[600],
  },
});
