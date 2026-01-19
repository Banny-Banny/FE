/**
 * components/customer-service/components/chat-message-list/message-bubble.tsx
 * 메시지 버블 컴포넌트 (네이버 톡톡 스타일)
 */

import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { MessageBubbleProps } from './types';
import { MessageTime } from './message-time';
import { MessageStatus } from './message-status';
import { styles } from './styles';
import { Typography } from '@/commons/constants';

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * 메시지 버블 컴포넌트
 * 
 * @description
 * - 사용자 메시지: 오른쪽 정렬, 파란색 배경
 * - 관리자 메시지: 왼쪽 정렬, 회색 배경
 * - 네이버 톡톡 스타일 구현
 * - 애니메이션 포함
 */
export const MessageBubble = React.memo<MessageBubbleProps>(
  ({ message, showTime = true, showStatus = true }) => {
    const isUserMessage = message.sender_type === 'USER';

    return (
      <AnimatedView
        entering={FadeInDown.duration(300).springify()}
        style={[styles.messageContainer, isUserMessage && styles.messageContainerUser]}>
        <AnimatedView
          entering={FadeIn.duration(200)}
          style={[
            styles.messageBubble,
            isUserMessage ? styles.messageBubbleUser : styles.messageBubbleAdmin,
          ]}>
          <Text
            style={[
              styles.messageText,
              isUserMessage ? styles.messageTextUser : styles.messageTextAdmin,
            ]}>
            {message.content}
          </Text>
        </AnimatedView>

        {/* 시간 및 상태 표시 (사용자 메시지만) */}
        {isUserMessage && (
          <View style={styles.messageFooter}>
            {showTime && <MessageTime timestamp={message.created_at} />}
            {showStatus && message.status && (
              <MessageStatus status={message.status} isRead={message.is_read_by_admin} />
            )}
          </View>
        )}

        {/* 관리자 메시지 시간 표시 */}
        {!isUserMessage && showTime && (
          <View style={styles.messageFooterAdmin}>
            <MessageTime timestamp={message.created_at} />
          </View>
        )}
      </AnimatedView>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';
