/**
 * components/customer-service/components/chat-room/styles.ts
 * 채팅방 스타일 정의
 */

import { Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[50],
  },
  messageListContainer: {
    flex: 1,
  },
  // EC-003: 여러 기기 동시 접속 안내 메시지
  deviceWarningContainer: {
    backgroundColor: Colors.yellow[50],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.yellow[200],
  },
  deviceWarningText: {
    ...Typography.body.body6,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.yellow[700],
    textAlign: 'center',
  },
});
