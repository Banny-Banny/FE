/**
 * components/customer-service/components/chat-message-list/index.tsx
 * 채팅 메시지 리스트 컨테이너 컴포넌트
 */

import React, { useRef, useEffect } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { ChatMessageListProps } from './types';
import { MessageBubble } from './message-bubble';
import { styles } from './styles';
import { Colors, Spacing } from '@/commons/constants';

/**
 * 채팅 메시지 리스트 컴포넌트
 * 
 * @description
 * - FlatList를 사용한 가상화된 메시지 리스트
 * - 자동 스크롤 기능 포함
 * - 네이버 톡톡 스타일 구현
 */
export const ChatMessageList = React.forwardRef<FlatList, ChatMessageListProps>(
  ({ messages, onLoadMore, isLoading = false }, ref) => {
    const flatListRef = useRef<FlatList>(null);
    const actualRef = (ref as React.RefObject<FlatList>) || flatListRef;

    // 새 메시지 도착 시 자동 스크롤
    useEffect(() => {
      if (messages.length > 0) {
        setTimeout(() => {
          actualRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }, [messages.length, actualRef]);

  const renderMessage = ({ item, index }: { item: typeof messages[0]; index: number }) => {
    // 이전 메시지와 시간 차이 확인 (같은 날이면 시간 표시 생략 가능)
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showTime =
      !prevMessage ||
      new Date(item.created_at).getTime() - new Date(prevMessage.created_at).getTime() >
        5 * 60 * 1000; // 5분 이상 차이면 시간 표시

    return <MessageBubble message={item} showTime={showTime} showStatus={true} />;
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.grey[500]} />
      </View>
    );
  };

  return (
    <View style={styles.listContainer}>
      <FlatList
        ref={actualRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        inverted={false} // 일반 순서 (오래된 것부터)
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
  }
);

ChatMessageList.displayName = 'ChatMessageList';
