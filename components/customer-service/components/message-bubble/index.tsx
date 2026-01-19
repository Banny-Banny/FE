/**
 * components/customer-service/components/message-bubble/index.tsx
 * 메시지 버블 컴포넌트 (네이버 톡톡 스타일)
 */

import { Colors } from '@/commons/constants';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-remix-icon';
import { MessageStatus } from '../message-status';
import { MessageTime } from '../message-time';
import { formatFileSize, getFileIconName, handleFileDownload } from '../shared/message-utils';
import { styles } from './styles';
import { MessageBubbleProps } from './types';

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * 메시지 버블 컴포넌트
 * 
 * @description
 * - 사용자 메시지: 오른쪽 정렬, 파란색 배경
 * - 관리자 메시지: 왼쪽 정렬, 회색 배경
 * - 네이버 톡톡 스타일 구현
 * - 애니메이션 포함
 * - 파일 첨부 지원 (이미지, 파일)
 */
export const MessageBubble = React.memo<MessageBubbleProps>(
  ({ message, showTime = true, showStatus = true, onRetry }) => {
    const isUserMessage = message.sender_type === 'USER';
    const hasAttachments = message.attachments && message.attachments.length > 0;
    const hasContent = message.content && message.content.trim().length > 0;
    const isFailed = message.status === 'failed';

    return (
      <AnimatedView
        entering={FadeInDown.duration(300).springify()}
        style={[styles.messageContainer, isUserMessage && styles.messageContainerUser]}>
        {/* 메시지 버블 */}
        <AnimatedView
          entering={FadeIn.duration(200)}
          style={[
            styles.messageBubble,
            isUserMessage ? styles.messageBubbleUser : styles.messageBubbleAdmin,
          ]}>
          {/* 텍스트 메시지 */}
          {hasContent && (
            <Text
              style={[
                styles.messageText,
                isUserMessage ? styles.messageTextUser : styles.messageTextAdmin,
              ]}>
              {message.content}
            </Text>
          )}

          {/* 파일 첨부 표시 */}
          {hasAttachments && (
            <View style={[styles.attachmentsContainer, hasContent && styles.attachmentsContainerWithContent]}>
              {message.attachments!.map((attachment) => {
                if (attachment.type === 'IMAGE') {
                  return (
                    <TouchableOpacity
                      key={attachment.id}
                      style={styles.imageAttachment}
                      activeOpacity={0.8}
                      onPress={() => {
                        // 이미지 확대 기능 (선택사항)
                        // 필요시 이미지 뷰어 모달 구현
                      }}>
                      <Image
                        source={{ uri: attachment.url }}
                        style={styles.imageAttachmentImage}
                        contentFit="cover"
                        transition={200}
                        cachePolicy="memory-disk" // 메모리 및 디스크 캐싱
                        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }} // 블러 플레이스홀더
                      />
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      key={attachment.id}
                      style={[
                        styles.fileAttachment,
                        isUserMessage && styles.fileAttachmentUser,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => handleFileDownload(attachment.url, attachment.name)}>
                      <View
                        style={[
                          styles.fileAttachmentIcon,
                          isUserMessage && styles.fileAttachmentIconUser,
                        ]}>
                        <Icon
                          name={getFileIconName(attachment.mimeType)}
                          size={20}
                          color={isUserMessage ? Colors.white[50] : Colors.blue[500]}
                        />
                      </View>
                      <View style={styles.fileAttachmentContent}>
                        <Text
                          style={[
                            styles.fileAttachmentName,
                            isUserMessage ? styles.fileAttachmentNameUser : styles.fileAttachmentNameAdmin,
                          ]}
                          numberOfLines={1}>
                          {attachment.name}
                        </Text>
                        {attachment.size && (
                          <Text
                            style={[
                              styles.fileAttachmentSize,
                              isUserMessage ? styles.fileAttachmentSizeUser : styles.fileAttachmentSizeAdmin,
                            ]}>
                            {formatFileSize(attachment.size)}
                          </Text>
                        )}
                      </View>
                      <Icon
                        name="download-line"
                        size={16}
                        color={isUserMessage ? Colors.white[50] : Colors.grey[500]}
                      />
                    </TouchableOpacity>
                  );
                }
              })}
            </View>
          )}
        </AnimatedView>

        {/* 시간 및 상태 표시 (사용자 메시지만) */}
        {isUserMessage && (
          <View style={styles.messageFooter}>
            {showTime && <MessageTime timestamp={message.created_at} />}
            {showStatus && message.status && (
              <MessageStatus
                status={message.status}
                isRead={message.is_read_by_admin}
                onRetry={isFailed && onRetry ? () => onRetry(message.id) : undefined}
              />
            )}
          </View>
        )}
        
        {/* 전송 실패 메시지 표시 */}
        {isUserMessage && isFailed && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => onRetry?.(message.id)}
            activeOpacity={0.7}>
            <Icon name="refresh-line" size={14} color={Colors.red[500]} />
            <Text style={styles.retryText}>다시 전송</Text>
          </TouchableOpacity>
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
