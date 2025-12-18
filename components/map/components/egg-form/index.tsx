/**
 * components/map/components/egg-form/index.tsx
 * 이스터에그 작성 폼 컴포넌트
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] BottomSheet 공통 컴포넌트 사용
 * - [x] react-native-remix-icon 사용
 * - [x] 색상 토큰만 사용 (하드코딩 금지)
 * - [x] 인라인 스타일 0건
 * - [x] styles.ts에서만 스타일 선언
 */

import { BottomSheet } from '@/commons/components/bottom-sheet';
import { Colors } from '@/commons/constants';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from './styles';

// Props 인터페이스 정의
export interface EggFormProps {
  isVisible: boolean;
  onClose: () => void;
}

// 첨부파일 타입 정의
interface AttachmentFile {
  id: string;
  type: 'photo' | 'music' | 'video';
  name: string;
}

export const EggForm: React.FC<EggFormProps> = ({ isVisible, onClose }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

  const MAX_MESSAGE_LENGTH = 500;
  const messageLength = message.length;

  // 첨부파일 삭제 핸들러
  const handleDeleteAttachment = (id: string) => {
    setAttachments(attachments.filter((file) => file.id !== id));
  };

  // 첨부파일 추가 핸들러 (임시 - 실제로는 파일 선택 로직 필요)
  const handleAddAttachment = (type: 'photo' | 'music' | 'video') => {
    // TODO: 실제 파일 선택 로직 구현
    const newFile: AttachmentFile = {
      id: Date.now().toString(),
      type,
      name: `${type}_${Date.now()}.${type === 'photo' ? 'jpg' : type === 'music' ? 'mp3' : 'mp4'}`,
    };
    setAttachments([...attachments, newFile]);
  };

  // 숨기기 버튼 핸들러
  const handleHide = () => {
    // TODO: 저장 로직 구현
    onClose();
  };

  // 하단 고정 버튼 영역
  const isFormFilled = messageLength > 0 || title.length > 0 || attachments.length > 0;
  const renderFooter = () => (
    <Pressable
      style={[
        styles.hideButton,
        isFormFilled ? styles.hideButtonActive : styles.hideButtonInactive,
      ]}
      onPress={handleHide}>
      <Text style={[styles.hideButtonText, !isFormFilled && styles.hideButtonInactiveText]}>
        숨기기
      </Text>
    </Pressable>
  );

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} footer={renderFooter()}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>이스터에그 작성</Text>
          <Text style={styles.subtitle}>소중한 추억을 숨겨보세요</Text>
        </View>

        {/* 제목 입력 필드 */}
        <View style={styles.section}>
          <Text style={styles.label}>제목</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="제목을 입력하세요"
              placeholderTextColor={Colors.grey[500]}
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        {/* 메시지 입력 필드 */}
        <View style={styles.section}>
          <Text style={styles.label}>메시지</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="어떤 이야기를 남기고 싶나요?"
              placeholderTextColor={Colors.grey[500]}
              multiline
              value={message}
              onChangeText={setMessage}
              maxLength={MAX_MESSAGE_LENGTH}
              textAlignVertical="top"
            />
            <View style={styles.charCountContainer}>
              <Text style={styles.charCount}>
                {messageLength}/{MAX_MESSAGE_LENGTH}
              </Text>
            </View>
          </View>
        </View>

        {/* 첨부파일 섹션 */}
        <View style={styles.section}>
          <Text style={styles.label}>첨부파일</Text>
          {attachments.length === 0 ? (
            // 첨부파일이 없을 때: 추가 버튼 3개
            <View style={styles.attachmentButtonsContainer}>
              <Pressable
                style={[styles.attachmentButton, styles.photoButton]}
                onPress={() => handleAddAttachment('photo')}>
                <Icon name="ri-image-line" size={24} color={Colors.red[500]} />
                <Text style={styles.attachmentButtonText}>사진</Text>
              </Pressable>
              <Pressable
                style={[styles.attachmentButton, styles.musicButton]}
                onPress={() => handleAddAttachment('music')}>
                <Icon name="ri-music-line" size={24} color={Colors.blue[500]} />
                <Text style={styles.attachmentButtonText}>음악</Text>
              </Pressable>
              <Pressable
                style={[styles.attachmentButton, styles.videoButton, styles.attachmentButtonLast]}
                onPress={() => handleAddAttachment('video')}>
                <Icon name="ri-video-line" size={24} color={Colors.red[200]} />
                <Text style={styles.attachmentButtonText}>동영상</Text>
              </Pressable>
            </View>
          ) : (
            // 첨부파일이 있을 때: 미리보기 표시
            <View style={styles.attachmentPreviewContainer}>
              {attachments.map((file, index) => (
                <View
                  key={file.id}
                  style={[
                    styles.attachmentPreview,
                    index < attachments.length - 1 && styles.attachmentPreviewMargin,
                  ]}>
                  <View
                    style={[
                      styles.attachmentPreviewIcon,
                      file.type === 'photo' && styles.attachmentPreviewIconPhoto,
                      file.type === 'music' && styles.attachmentPreviewIconMusic,
                      file.type === 'video' && styles.attachmentPreviewIconVideo,
                    ]}>
                    {file.type === 'photo' && (
                      <Icon name="ri-image-line" size={24} color={Colors.red[500]} />
                    )}
                    {file.type === 'music' && (
                      <Icon name="ri-music-line" size={24} color={Colors.blue[500]} />
                    )}
                    {file.type === 'video' && (
                      <Icon name="ri-video-line" size={24} color={Colors.red[200]} />
                    )}
                  </View>
                  <View style={styles.attachmentPreviewLabel}>
                    <Text style={styles.attachmentPreviewText} numberOfLines={1}>
                      {file.name}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleDeleteAttachment(file.id)}>
                    <Icon name="ri-delete-bin-line" size={16} color={Colors.white[100]} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </BottomSheet>
  );
};
