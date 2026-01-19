/**
 * components/customer-service/components/chat-message-list/message-bubble.tsx
 * 메시지 버블 컴포넌트 (네이버 톡톡 스타일)
 */

import React from 'react';
import { Text, View, TouchableOpacity, Linking, Alert } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Icon from 'react-native-remix-icon';
import { MessageBubbleProps } from './types';
import { MessageTime } from './message-time';
import { MessageStatus } from './message-status';
import { styles } from './styles';
import { Typography, Colors, Spacing } from '@/commons/constants';

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * 파일 크기 포맷팅 함수
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * 파일 아이콘 이름 가져오기
 */
function getFileIconName(mimeType?: string): string {
  if (!mimeType) return 'file-line';

  if (mimeType.startsWith('image/')) {
    return 'image-line';
  } else if (mimeType.startsWith('video/')) {
    return 'video-line';
  } else if (mimeType.startsWith('audio/')) {
    return 'music-line';
  } else if (mimeType.includes('pdf')) {
    return 'file-pdf-line';
  } else if (mimeType.includes('word') || mimeType.includes('document')) {
    return 'file-word-line';
  } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
    return 'file-excel-line';
  } else if (mimeType.includes('zip') || mimeType.includes('archive')) {
    return 'file-zip-line';
  }

  return 'file-line';
}

/**
 * 파일 다운로드 처리 (선택사항)
 */
async function handleFileDownload(url: string, fileName: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('오류', '파일을 열 수 없습니다.');
    }
  } catch (error) {
    Alert.alert('오류', '파일 다운로드에 실패했습니다.');
  }
}

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
  ({ message, showTime = true, showStatus = true }) => {
    const isUserMessage = message.sender_type === 'USER';
    const hasAttachments = message.attachments && message.attachments.length > 0;
    const hasContent = message.content && message.content.trim().length > 0;

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
