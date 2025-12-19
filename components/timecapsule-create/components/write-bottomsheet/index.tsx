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

import React from 'react';
import { View, Text, TextInput, Pressable, Image, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { BottomSheet } from '@/commons/components/bottom-sheet';
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

export default function UserBottomSheet({
  isVisible,
  onClose,
  participant,
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
      // 테스트용: 더미 사진 5개 추가 (그리드 테스트)
      photos: ['dummy1.jpg', 'dummy2.jpg', 'dummy3.jpg', 'dummy4.jpg', 'dummy5.jpg'],
      music: null,
      video: null,
    },
  });

  // 사진 삭제 핸들러
  const handleDeletePhoto = (index: number) => {
    const currentPhotos = watch('photos');
    setValue('photos', currentPhotos.filter((_, i) => i !== index));
  };

  // 사진 추가 핸들러
  const handleAddPhoto = (photoUri: string) => {
    const currentPhotos = watch('photos');
    if (currentPhotos.length < 5) {
      setValue('photos', [...currentPhotos, photoUri]);
    }
  };

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
          <Pressable style={styles.addButton} onPress={() => {}}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/plus-icon.svg' }}
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>사진 추가</Text>
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
                            source={{ uri: 'http://localhost:3845/assets/image-placeholder.svg' }}
                            style={styles.photoPreviewImage}
                          />
                        </View>
                        <View style={styles.photoPreviewLabel}>
                          <Text style={styles.photoPreviewText} numberOfLines={1}>
                            {photo}
                          </Text>
                        </View>
                        {/* 삭제 버튼 */}
                        <Pressable
                          style={styles.deleteButton}
                          onPress={() => handleDeletePhoto(index)}
                        >
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
            <Text style={styles.sectionTitle}>음악 ({watch('music') ? 1 : 0}/1)</Text>
          </View>
          <Pressable style={styles.addButton} onPress={() => {}}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/plus-icon.svg' }}
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>음악 추가</Text>
          </Pressable>
        </View>

        {/* 동영상 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/video-icon.svg' }}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>동영상 ({watch('video') ? 1 : 0}/1)</Text>
          </View>
          <Pressable style={styles.addButton} onPress={() => {}}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/plus-icon.svg' }}
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>동영상 추가</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
};
