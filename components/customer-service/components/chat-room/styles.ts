/**
 * components/customer-service/components/chat-room/styles.ts
 * 채팅방 스타일 정의
 */

import { Colors } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[50],
  },
  messageListContainer: {
    flex: 1,
  },
});
