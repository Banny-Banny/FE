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
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { useMediaPicker } from './hooks';
import { styles } from './styles';

// Participant 타입 정의
interface Participant {
  id: string;
  name: string;
  emoji: string;
  status: 'completed' | 'pending' | 'waiting';
  isHost?: boolean;
  isMe?: boolean;
}

// Props 인터페이스 정의
interface UserBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  participant: Participant;
}

// 폼 데이터 타입 정의
interface UserContentFormData {
  textContent: string;
  photos: string[];
  music: string | null;
  video: string | null;
}

export default function UserBottomSheet({ isVisible, onClose, participant }: UserBottomSheetProps) {
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
    );

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
  const onFormSubmit = (data: UserContentFormData) => {
    // TODO: 저장 로직 구현 (API 호출 등)
    console.log('저장할 데이터:', data);
    onClose();
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
      <View style={styles.buttonContainer}>
        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </Pressable>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>저장</Text>
        </Pressable>
      </View>
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
                  placeholderTextColor="rgba(10, 10, 10, 0.5)"
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
            <Text style={styles.sectionTitle}>사진 ({watch('photos').length}/5)</Text>
          </View>
          <Pressable
            style={styles.addButton}
            onPress={handleAddPhoto}
            disabled={isPickingImage || currentPhotos.length >= 5}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/plus-icon.svg' }}
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>{isPickingImage ? '선택 중...' : '사진 추가'}</Text>
          </Pressable>

          {/* 추가된 사진 미리보기 - 그리드 배치 (3 + 2) */}
          <Controller
            control={control}
            name="photos"
            rules={{
              validate: (value) => value.length <= 5 || '최대 5개까지 추가 가능합니다',
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

        {/* 음악 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/music-icon.svg' }}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>음악 ({currentMusic ? 1 : 0}/1)</Text>
          </View>
          <Pressable style={styles.addButton} onPress={handleAddMusic} disabled={isPickingAudio}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/plus-icon.svg' }}
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>
              {isPickingAudio ? '선택 중...' : currentMusic ? '음악 교체' : '음악 추가'}
            </Text>
          </Pressable>

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

        {/* 동영상 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/video-icon.svg' }}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>동영상 ({currentVideo ? 1 : 0}/1)</Text>
          </View>
          <Pressable style={styles.addButton} onPress={handleAddVideo} disabled={isPickingVideo}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/plus-icon.svg' }}
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>
              {isPickingVideo ? '선택 중...' : currentVideo ? '동영상 교체' : '동영상 추가'}
            </Text>
          </Pressable>

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
      </View>
    </BottomSheet>
  );
}
