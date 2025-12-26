/**
 * components/map/components/egg-form/index.tsx
 * 이스터에그 작성 폼 컴포넌트
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] BottomSheet 공통 컴포넌트 사용
 * - [x] react-native-remix-icon 사용
 * - [x] react-hook-form 사용
 * - [x] 색상 토큰만 사용 (하드코딩 금지)
 * - [x] 인라인 스타일 0건
 * - [x] styles.ts에서만 스타일 선언
 * - [x] 파일 업로드 제한 로직 구현
 * - [x] 버튼 활성화 조건 (제목과 내용 모두 입력 필요)
 * - [x] 제출 중 상태 표시 및 버튼 비활성화
 */

import { BottomSheet } from '@/commons/components/bottom-sheet';
import { Colors } from '@/commons/constants';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { MAX_MESSAGE_LENGTH } from './constants';
import { useEggForm } from './hooks/useEggForm';
import { styles } from './styles';
import { EggFormProps } from './types';

export const EggForm: React.FC<EggFormProps> = ({ isVisible, onClose }) => {
  // 폼 관리 통합 Hook
  const {
    control,
    handleSubmit,
    isFormValid,
    isSubmitting,
    handleDeleteAttachment,
    handleAddAttachment,
    photoAttachment,
    musicAttachment,
    videoAttachment,
  } = useEggForm({ onClose });

  // 하단 고정 버튼 영역
  const renderFooter = () => (
    <Pressable
      style={[
        styles.hideButton,
        isFormValid && !isSubmitting ? styles.hideButtonActive : styles.hideButtonInactive,
      ]}
      onPress={() => {
        console.log('🔘 숨기기 버튼 클릭됨');
        console.log('📊 버튼 상태:', {
          isFormValid,
          isSubmitting,
          disabled: !isFormValid || isSubmitting,
        });
        handleSubmit();
      }}
      disabled={!isFormValid || isSubmitting}>
      <Text
        style={[
          styles.hideButtonText,
          (!isFormValid || isSubmitting) && styles.hideButtonInactiveText,
        ]}>
        {isSubmitting ? '처리 중...' : '숨기기'}
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
            <Controller
              control={control}
              name="title"
              rules={{
                required: false, // 버튼 활성화 조건으로만 사용
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="제목을 입력하세요"
                  placeholderTextColor={Colors.grey[500]}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>

        {/* 메시지 입력 필드 */}
        <View style={styles.section}>
          <Text style={styles.label}>메시지</Text>
          <View style={styles.textAreaContainer}>
            <Controller
              control={control}
              name="content"
              rules={{
                required: false, // 버튼 활성화 조건으로만 사용
                maxLength: MAX_MESSAGE_LENGTH,
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={styles.textArea}
                    placeholder="어떤 이야기를 남기고 싶나요?"
                    placeholderTextColor={Colors.grey[500]}
                    multiline
                    value={value}
                    onChangeText={onChange}
                    maxLength={MAX_MESSAGE_LENGTH}
                    textAlignVertical="top"
                  />
                  <View style={styles.charCountContainer}>
                    <Text style={styles.charCount}>
                      {value.length}/{MAX_MESSAGE_LENGTH}
                    </Text>
                  </View>
                </>
              )}
            />
          </View>
        </View>

        {/* 첨부파일 섹션 */}
        <View style={styles.section}>
          <Text style={styles.label}>첨부파일</Text>
          <View style={styles.attachmentButtonsContainer}>
            {/* 사진 버튼 */}
            <Pressable
              style={[styles.attachmentButton, styles.photoButton]}
              onPress={() => handleAddAttachment('IMAGE')}>
              {photoAttachment ? (
                <>
                  {/* 이미지 미리보기 */}
                  {photoAttachment.uri && (
                    <Image
                      source={{ uri: photoAttachment.uri }}
                      style={styles.attachmentPreviewImage}
                      resizeMode="cover"
                    />
                  )}
                  {/* 삭제 버튼 */}
                  <Pressable
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteAttachment(photoAttachment.id);
                    }}>
                    <Icon name="delete-bin-line" size={16} color={Colors.white[100]} />
                  </Pressable>
                </>
              ) : (
                <>
                  <Icon name="image-line" size={24} color={Colors.red[500]} />
                  <Text style={styles.attachmentButtonText}>사진</Text>
                </>
              )}
            </Pressable>

            {/* 음악 버튼 */}
            <Pressable
              style={[styles.attachmentButton, styles.musicButton]}
              onPress={() => handleAddAttachment('MUSIC')}>
              {musicAttachment ? (
                <>
                  {/* 음악 아이콘 */}
                  <View style={styles.attachmentPreviewImagePlaceholder}>
                    <Icon name="music-line" size={24} color={Colors.blue[500]} />
                  </View>
                  {/* 음악 파일명 텍스트 */}
                  <View style={styles.attachmentPreviewLabel}>
                    <Text style={styles.attachmentPreviewText} numberOfLines={1}>
                      {musicAttachment.name}
                    </Text>
                  </View>
                  {/* 삭제 버튼 */}
                  <Pressable
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteAttachment(musicAttachment.id);
                    }}>
                    <Icon name="delete-bin-line" size={16} color={Colors.white[100]} />
                  </Pressable>
                </>
              ) : (
                <>
                  <Icon name="music-line" size={24} color={Colors.blue[500]} />
                  <Text style={styles.attachmentButtonText}>음악</Text>
                </>
              )}
            </Pressable>

            {/* 동영상 버튼 */}
            <Pressable
              style={[styles.attachmentButton, styles.videoButton, styles.attachmentButtonLast]}
              onPress={() => handleAddAttachment('VIDEO')}>
              {videoAttachment ? (
                <>
                  {/* 동영상 썸네일 미리보기 */}
                  {videoAttachment.thumbnailUri ? (
                    <Image
                      source={{ uri: videoAttachment.thumbnailUri }}
                      style={styles.attachmentPreviewImage}
                      resizeMode="cover"
                    />
                  ) : videoAttachment.uri ? (
                    <View style={styles.attachmentPreviewImagePlaceholder}>
                      <Icon name="video-line" size={24} color={Colors.red[200]} />
                    </View>
                  ) : (
                    <View style={styles.attachmentPreviewImagePlaceholder}>
                      <Icon name="video-line" size={24} color={Colors.red[200]} />
                    </View>
                  )}
                  {/* 삭제 버튼 */}
                  <Pressable
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteAttachment(videoAttachment.id);
                    }}>
                    <Icon name="delete-bin-line" size={16} color={Colors.white[100]} />
                  </Pressable>
                </>
              ) : (
                <>
                  <Icon name="video-line" size={24} color={Colors.red[200]} />
                  <Text style={styles.attachmentButtonText}>동영상</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};
