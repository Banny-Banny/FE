/**
 * components/customer-service/components/chat-message-list/styles.ts
 * 채팅 메시지 리스트 컨테이너 스타일 정의
 */

import { Colors, Spacing } from '@/commons/constants';
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
  // Loading Indicator
  // ============================================
  loadingContainer: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
});
