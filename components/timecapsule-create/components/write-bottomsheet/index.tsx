/**
 * components/timecapsule-create/components/write-bottomsheet/index.tsx
 * UserBottomSheet 컴포넌트 - MY CONTENTS 작성 화면
 *
 * 체크리스트:
 * - [✓] Props 인터페이스 정의 (isVisible, onClose, participant)
 * - [✓] Participant 타입 정의
 * - [✓] BottomSheet 공통 컴포넌트 사용
 * - [✓] react-hook-form으로 폼 관리
 * - [ ] Figma 디자인과 동일하게 구현
 * - [ ] 색상/타이포그래피 토큰만 사용
 * - [ ] 인라인 스타일 금지
 */

import { BottomSheet } from '@/commons/components/bottom-sheet';
import { Button } from '@/commons/components/button';
import { DualButton } from '@/commons/components/dual-button';
import { Colors } from '@/commons/constants';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { useMediaPicker, useSubmitContent } from './hooks';
import { styles } from './styles';
import type { UserBottomSheetProps, UserContentFormData } from './types';

export default function UserBottomSheet({
  isVisible,
  onClose,
  participant,
  capsuleId,
  onSave,
  roomSettings,
}: UserBottomSheetProps) {
  // react-hook-form 설정
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<UserContentFormData>({
    mode: 'onChange',
    defaultValues: {
      textContent: '',
      photos: [],
      music: null,
      video: null,
    },
  });

  // 현재 폼 상태 감시
  const currentPhotos = watch('photos');
  const currentVideo = watch('video');
  const currentMusic = watch('music');

  // ⭐ 기본값 설정 (roomSettings가 null이면 기본값 사용)
  const maxImagesPerPerson = roomSettings?.max_images_per_person ?? 3;
  const hasMusic = roomSettings?.has_music ?? false;
  const hasVideo = roomSettings?.has_video ?? false;

  // useMediaPicker Hook 사용
  const { pickImage, pickVideo, pickAudio, isPickingImage, isPickingVideo, isPickingAudio, error } =
    useMediaPicker(
      // 이미지 선택 완료 콜백
      (uris: string[]) => {
        setValue('photos', [...currentPhotos, ...uris], { shouldDirty: true });
      },
      // 비디오 선택 완료 콜백
      (uri: string) => {
        setValue('video', uri, { shouldDirty: true });
      },
      // 오디오 선택 완료 콜백
      (uri: string) => {
        setValue('music', uri, { shouldDirty: true });
      },
      currentPhotos.length,
      !!currentVideo,
      !!currentMusic,
      maxImagesPerPerson, // ⭐ 추가
    );

  // useSubmitContent Hook 사용
  const {
    submitContent,
    isSubmitting,
    error: submitError,
    validateContent,
    uploadProgress, // ⭐ 추가
  } = useSubmitContent();

  // 사진 삭제 핸들러
  const handleDeletePhoto = (index: number) => {
    const currentPhotos = watch('photos');
    setValue(
      'photos',
      currentPhotos.filter((_, i) => i !== index),
    );
  };

  // 사진 추가 핸들러
  const handleAddPhoto = () => {
    pickImage();
  };

  // 동영상 추가 핸들러
  const handleAddVideo = () => {
    pickVideo();
  };

  // 음악 추가 핸들러
  const handleAddMusic = () => {
    pickAudio();
  };

  // 에러 발생 시 알림 표시
  React.useEffect(() => {
    if (error) {
      Alert.alert('오류', error);
    }
  }, [error]);

  // 폼 제출 핸들러
  const onFormSubmit = async (data: UserContentFormData) => {
    try {
      // ⭐ text_message 필수 검증
      if (!data.textContent || data.textContent.trim().length === 0) {
        Alert.alert('검증 실패', '텍스트 메시지는 필수입니다.');
        return;
      }

      // 제출 전 검증
      const validation = validateContent(data);
      if (!validation.isValid) {
        Alert.alert('검증 실패', validation.message);
        return;
      }

      // 부모 컴포넌트의 onSave가 있으면 호출 (우선순위 높음)
      if (onSave) {
        console.log('💾 [UserBottomSheet] 부모 컴포넌트 저장 호출');
        await onSave({
          text: data.textContent,
          images: data.photos,
          voiceRecording: data.music, // music을 voiceRecording으로 매핑
          video: data.video,
        });
      } else {
        // ⭐ capsuleId 전달
        console.log('💾 [UserBottomSheet] useSubmitContent Hook 호출');
        console.log('  🆔 capsuleId:', capsuleId);
        console.log('  📝 제출 데이터 요약:');
        console.log('    - 텍스트:', data.textContent.trim().substring(0, 30) + '...');
        console.log('    - 이미지:', data.photos.length, '개');
        console.log('    - 음악:', data.music ? '있음' : '없음');
        console.log('    - 비디오:', data.video ? '있음' : '없음');
        await submitContent(data, capsuleId);
      }

      // 제출 성공 시 성공 메시지 표시 후 바텀시트 닫기
      console.log('🎉 [UserBottomSheet] 저장 성공!');
      Alert.alert('저장 완료', '타임캡슐 내용이 저장되었습니다!\n나중에도 수정할 수 있어요', [
        {
          text: '확인',
          onPress: () => {
            onClose();
          },
        },
      ]);
    } catch (err) {
      // 에러 처리
      console.error('❌ [UserBottomSheet] 제출 중 오류 발생');
      console.error('  에러 타입:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('  에러 메시지:', err instanceof Error ? err.message : String(err));
      if (err instanceof Error && err.stack) {
        console.error('  스택 트레이스:', err.stack);
      }
      Alert.alert('저장 실패', err instanceof Error ? err.message : '저장에 실패했습니다.');
    }
  };

  // 저장 버튼 핸들러
  const handleSave = handleSubmit(onFormSubmit);

  // 취소 버튼 핸들러
  const handleCancel = () => {
    if (isDirty) {
      Alert.alert('작성 취소', '작성 중인 내용이 있습니다. 취소하시겠습니까?', [
        { text: '계속 작성', style: 'cancel' },
        { text: '취소', onPress: onClose },
      ]);
    } else {
      onClose();
    }
  };

  // 하단 고정 버튼 영역 (공통 컴포넌트의 footer 스타일 사용)
  const renderFooter = () => (
    <>
      <DualButton
        cancelLabel="취소"
        confirmLabel={
          isSubmitting
            ? (uploadProgress || '저장 중...') // ⭐ 업로드 진행 상태 표시
            : '저장'
        }
        size="M"
        cancelVariant="outline"
        confirmVariant="primary"
        confirmDisabled={isSubmitting}
        onCancelPress={handleCancel}
        onConfirmPress={handleSave}
      />
      <Text style={styles.hintText}>나중에도 수정할 수 있어요</Text>
    </>
  );

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} footer={renderFooter()}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>MY CONTENTS</Text>
          <Text style={styles.subtitle}>나만의 타임캡슐 내용을 작성해요</Text>
        </View>

        {/* 텍스트 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/text-icon.svg' }}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>텍스트</Text>
          </View>
          <View style={styles.textAreaContainer}>
            <Controller
              control={control}
              name="textContent"
              rules={{
                maxLength: { value: 500, message: '최대 500자까지 입력 가능합니다' },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.textArea}
                  placeholder="당신의 이야기를 남겨주세요..."
                  placeholderTextColor={Colors.grey[400]}
                  multiline
                  value={value}
                  onChangeText={onChange}
                  textAlignVertical="top"
                />
              )}
            />
          </View>
        </View>

        {/* 사진 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/image-icon.svg' }}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>
              사진 ({watch('photos').length}/{maxImagesPerPerson})
            </Text>
          </View>
          <Button
            label={isPickingImage ? '선택 중...' : '사진 추가'}
            variant="outline"
            size="M"
            icon="ri-add-line"
            disabled={isPickingImage || currentPhotos.length >= maxImagesPerPerson}
            onPress={handleAddPhoto}
          />

          {/* 추가된 사진 미리보기 - 그리드 배치 (3 + 2) */}
          <Controller
            control={control}
            name="photos"
            rules={{
              validate: (value) =>
                value.length <= maxImagesPerPerson ||
                `최대 ${maxImagesPerPerson}개까지 추가 가능합니다`,
            }}
            render={({ field: { value } }) => (
              <>
                {value.length > 0 && (
                  <View style={styles.photoGridContainer}>
                    {value.map((photo, index) => (
                      <View key={index} style={styles.photoPreviewItem}>
                        <View style={styles.photoPreview}>
                          <Image
                            source={{ uri: photo }}
                            style={[styles.photoPreviewImage, { width: '100%', height: '100%' }]}
                            resizeMode="cover"
                          />
                        </View>
                        <View style={styles.photoPreviewLabel}>
                          <Text style={styles.photoPreviewText} numberOfLines={1}>
                            사진 {index + 1}
                          </Text>
                        </View>
                        {/* 삭제 버튼 */}
                        <Pressable
                          style={styles.deleteButton}
                          onPress={() => handleDeletePhoto(index)}>
                          <Text style={styles.deleteButtonText}>×</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          />
        </View>

        {/* 음악 섹션 - hasMusic이 true일 때만 표시 */}
        {hasMusic && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image
                source={{ uri: 'http://localhost:3845/assets/music-icon.svg' }}
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>음악 ({currentMusic ? 1 : 0}/1)</Text>
            </View>
            <Button
              label={isPickingAudio ? '선택 중...' : currentMusic ? '음악 교체' : '음악 추가'}
              variant="outline"
              size="M"
              icon="ri-add-line"
              disabled={isPickingAudio}
              onPress={handleAddMusic}
            />

            {/* 선택된 음악 표시 */}
            {currentMusic && (
              <View style={styles.mediaFileContainer}>
                <View style={styles.mediaFileInfo}>
                  <Image
                    source={{ uri: 'http://localhost:3845/assets/music-icon.svg' }}
                    style={styles.mediaFileIcon}
                  />
                  <Text style={styles.mediaFileName} numberOfLines={1}>
                    {currentMusic.split('/').pop() || '음악 파일'}
                  </Text>
                </View>
                <Pressable
                  style={styles.mediaDeleteButton}
                  onPress={() => setValue('music', null, { shouldDirty: true })}>
                  <Text style={styles.deleteButtonText}>×</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* 동영상 섹션 - hasVideo가 true일 때만 표시 */}
        {hasVideo && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image
                source={{ uri: 'http://localhost:3845/assets/video-icon.svg' }}
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>동영상 ({currentVideo ? 1 : 0}/1)</Text>
            </View>
            <Button
              label={isPickingVideo ? '선택 중...' : currentVideo ? '동영상 교체' : '동영상 추가'}
              variant="outline"
              size="M"
              icon="ri-add-line"
              disabled={isPickingVideo}
              onPress={handleAddVideo}
            />

            {/* 선택된 동영상 표시 */}
            {currentVideo && (
              <View style={styles.mediaFileContainer}>
                <View style={styles.mediaFileInfo}>
                  <Image
                    source={{ uri: 'http://localhost:3845/assets/video-icon.svg' }}
                    style={styles.mediaFileIcon}
                  />
                  <Text style={styles.mediaFileName} numberOfLines={1}>
                    {currentVideo.split('/').pop() || '동영상 파일'}
                  </Text>
                </View>
                <Pressable
                  style={styles.mediaDeleteButton}
                  onPress={() => setValue('video', null, { shouldDirty: true })}>
                  <Text style={styles.deleteButtonText}>×</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    </BottomSheet>
  );
}
