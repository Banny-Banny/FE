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
import { useModal } from '@/commons/components/modal/hooks/useModal';
import { Colors } from '@/commons/constants';
import { AudioAttachment } from '@/components/shared/audio-attachment';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, Platform, Pressable, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { useMediaPicker, useSubmitContent } from './hooks';
import { styles } from './styles';
import type { UserBottomSheetProps, UserContentFormData } from './types';

export default function UserBottomSheet({
  isVisible,
  onClose,
  participant,
  capsuleId,
  inviteCode,
  onSave,
  roomSettings,
  isReadOnly = false,
}: UserBottomSheetProps) {
  // 모달 제어 Hook
  const { openModal, closeModal } = useModal();

  // ⭐ 로컬 저장 상태 (연타 방지용)
  const [isSaving, setIsSaving] = React.useState(false);

  // ⭐ API 로딩 상태
  const [isLoadingContent, setIsLoadingContent] = React.useState(false);

  // ⭐ AudioAttachment 모달 상태
  const [isAudioAttachmentVisible, setIsAudioAttachmentVisible] = React.useState(false);

  // ⭐ 콘텐츠 제출 완료 여부 (서버 status 기반)
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  // ⭐ 이미 한 번 콘텐츠를 불러왔는지 여부 (캡슐 ID별로 추적)
  const hasLoadedRef = React.useRef<string | null>(null);

  // react-hook-form 설정
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
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

  // ⭐ 바텀시트가 열릴 때 서버에서 최신 콘텐츠 불러오기 (한 번만)
  React.useEffect(() => {
    async function loadContent() {
      if (!isVisible || !capsuleId) {
        return;
      }

      // ⭐ 이미 이 캡슐의 콘텐츠를 불러왔다면 건너뛰기 (404 방지)
      if (hasLoadedRef.current === capsuleId) {
        console.log('ℹ️ [UserBottomSheet] 이미 불러온 콘텐츠 - API 호출 건너뜀');
        return;
      }

      setIsLoadingContent(true);

      try {
        console.log('🔄 [UserBottomSheet] 서버에서 최신 콘텐츠 불러오기 시작...');
        const { fetchMyContent } = await import('./api/content');
        const myContent = await fetchMyContent(capsuleId);

        if (myContent && myContent.data) {
          console.log('✅ [UserBottomSheet] 서버에서 콘텐츠 불러오기 성공');
          const textContent =
            typeof myContent.data.text_message === 'string'
              ? myContent.data.text_message
              : JSON.stringify(myContent.data.text_message);

          reset({
            textContent,
            photos: myContent.data.images?.map((img) => img.url) || [],
            music: myContent.data.music?.url || null,
            video: myContent.data.video?.url || null,
          });

          // ⭐ 서버 status가 COMPLETED이면 이미 제출 완료 상태로 설정
          if (myContent.data.status === 'COMPLETED') {
            console.log('ℹ️ [UserBottomSheet] 이미 제출 완료된 콘텐츠입니다.');
            setHasSubmitted(true);
          } else {
            setHasSubmitted(false);
          }

          // ⭐ 불러오기 완료 표시
          hasLoadedRef.current = capsuleId;
        }
      } catch (err: any) {
        // 404는 정상 (아직 작성 안 함)
        const { NotFoundError } = await import('./api/content');
        const errorResponse = err?.response || err?.config?.response;
        const statusCode = errorResponse?.status || err?.statusCode || err?.status;
        const isNotFoundError =
          statusCode === 404 ||
          err instanceof NotFoundError ||
          err?.name === 'NotFoundError' ||
          err?.message?.includes('아직 작성하지 않았습니다');

        if (isNotFoundError) {
          console.log('ℹ️ [UserBottomSheet] 아직 작성하지 않음 (404) - 빈 폼 표시');
          setHasSubmitted(false); // ⭐ 아직 제출 안 함
          // participant.content 폴백 사용 안 함 - 서버가 소스 오브 트루스
          console.log('📝 [UserBottomSheet] 새로운 콘텐츠 작성 (서버에 데이터 없음)');
          reset({
            textContent: '',
            photos: [],
            music: null,
            video: null,
          });

          // ⭐ 404도 불러오기 시도 완료로 표시 (다음에 다시 시도 안 함)
          hasLoadedRef.current = capsuleId;
        } else {
          console.error('❌ [UserBottomSheet] 콘텐츠 불러오기 실패:', err);
          // 에러 발생 시에도 빈 폼으로 초기화 (서버를 신뢰)
          console.log('⚠️ [UserBottomSheet] 에러 발생, 빈 폼으로 초기화');
          setHasSubmitted(false);
          reset({
            textContent: '',
            photos: [],
            music: null,
            video: null,
          });
          // ⭐ 에러 발생 시에는 다음에 다시 시도할 수 있도록 hasLoadedRef 업데이트 안 함
        }
      } finally {
        setIsLoadingContent(false);
      }
    }

    loadContent();
  }, [isVisible, capsuleId, participant, reset]);

  // 현재 폼 상태 감시
  const currentPhotos = watch('photos');
  const currentVideo = watch('video');
  const currentMusic = watch('music');

  // ⭐ 기본값 설정 (roomSettings가 null이면 기본값 사용)
  const maxImagesPerPerson = roomSettings?.max_images_per_person ?? 3;
  const hasMusic = roomSettings?.has_music ?? false;
  const hasVideo = roomSettings?.has_video ?? false;

  // useMediaPicker Hook 사용 (오디오 제외)
  const { pickImage, pickVideo, isPickingImage, isPickingVideo, error } = useMediaPicker(
    // 이미지 선택 완료 콜백
    (uris: string[]) => {
      setValue('photos', [...currentPhotos, ...uris], { shouldDirty: true });
    },
    // 비디오 선택 완료 콜백
    (uri: string) => {
      setValue('video', uri, { shouldDirty: true });
    },
    // 오디오 선택 완료 콜백 (사용하지 않음 - AudioAttachment로 대체)
    () => {},
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

  // 음성 추가 핸들러 - AudioAttachment 모달 열기
  const handleAddMusic = () => {
    // 이미 음성이 있으면 교체 확인
    if (currentMusic) {
      openModal({
        width: 344,
        height: 'auto',
        closeOnBackdropPress: true,
        children: (
          <View style={{ padding: 24, alignItems: 'center' }}>
            {/* 아이콘 */}
            <View style={{ marginBottom: 16 }}>
              <Icon name="question-line" size={64} color={Colors.blue[500]} />
            </View>

            {/* 타이틀 */}
            <Text
              style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
              음성 교체
            </Text>

            {/* 설명 */}
            <Text
              style={{
                fontSize: 14,
                color: Colors.grey[600],
                marginBottom: 24,
                textAlign: 'center',
              }}>
              이미 음성이 있습니다. 교체하시겠습니까?
            </Text>

            {/* 버튼 */}
            <DualButton
              cancelLabel="취소"
              confirmLabel="교체"
              size="S"
              cancelVariant="outline"
              confirmVariant="primary"
              fullWidth={true}
              onCancelPress={closeModal}
              onConfirmPress={() => {
                closeModal();
                setIsAudioAttachmentVisible(true);
              }}
            />
          </View>
        ),
      });
      return;
    }

    setIsAudioAttachmentVisible(true);
  };

  // AudioAttachment에서 음성 선택 완료 콜백
  const handleAudioSelected = (uri: string, name: string) => {
    setValue('music', uri, { shouldDirty: true });
    setIsAudioAttachmentVisible(false);
  };

  // 에러 발생 시 알림 표시
  React.useEffect(() => {
    if (error) {
      openModal({
        width: 344,
        height: 'auto',
        closeOnBackdropPress: true,
        children: (
          <View style={{ padding: 24, alignItems: 'center' }}>
            {/* 에러 아이콘 */}
            <View style={{ marginBottom: 16 }}>
              <Icon name="error-warning-fill" size={64} color={Colors.red[500]} />
            </View>

            {/* 타이틀 */}
            <Text
              style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
              오류
            </Text>

            {/* 에러 메시지 */}
            <Text
              style={{
                fontSize: 14,
                color: Colors.grey[600],
                marginBottom: 24,
                textAlign: 'center',
              }}>
              {error}
            </Text>

            {/* 확인 버튼 */}
            <Button label="확인" variant="primary" size="S" fullWidth={true} onPress={closeModal} />
          </View>
        ),
      });
    }
  }, [error, openModal, closeModal]);

  // ⭐ 바텀시트가 닫혔다가 다시 열릴 때 저장 상태 초기화
  React.useEffect(() => {
    if (!isVisible) {
      setIsSaving(false);
    }
  }, [isVisible]);

  // 폼 제출 핸들러
  const onFormSubmit = async (data: UserContentFormData) => {
    // ⭐ 이미 제출 완료된 경우 저장 방지
    if (hasSubmitted || isReadOnly) {
      console.log('⚠️ [UserBottomSheet] 이미 제출 완료된 콘텐츠입니다. 저장 불가.');
      openModal({
        width: 344,
        height: 'auto',
        closeOnBackdropPress: true,
        children: (
          <View style={{ padding: 24, alignItems: 'center' }}>
            {/* 경고 아이콘 */}
            <View style={{ marginBottom: 16 }}>
              <Icon name="error-warning-fill" size={64} color={Colors.red[500]} />
            </View>

            {/* 타이틀 */}
            <Text
              style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
              저장 불가
            </Text>

            {/* 설명 */}
            <Text
              style={{
                fontSize: 14,
                color: Colors.grey[600],
                marginBottom: 24,
                textAlign: 'center',
              }}>
              이미 제출 완료된 콘텐츠는 수정할 수 없습니다.
            </Text>

            {/* 확인 버튼 */}
            <Button label="확인" variant="primary" size="S" fullWidth={true} onPress={closeModal} />
          </View>
        ),
      });
      return;
    }

    // ⭐ 연타 방지: 이미 저장 중이면 즉시 무시
    if (isSaving || isSubmitting) {
      console.log('⚠️ [UserBottomSheet] 이미 저장 중입니다. 무시됨.');
      return;
    }

    // ⭐ 즉시 저장 상태를 true로 설정 (연타 차단)
    setIsSaving(true);

    try {
      // ⭐ text_message 필수 검증
      if (!data.textContent || data.textContent.trim().length === 0) {
        openModal({
          width: 344,
          height: 'auto',
          closeOnBackdropPress: true,
          children: (
            <View style={{ padding: 24, alignItems: 'center' }}>
              {/* 경고 아이콘 */}
              <View style={{ marginBottom: 16 }}>
                <Icon name="error-warning-fill" size={64} color={Colors.red[500]} />
              </View>

              {/* 타이틀 */}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                검증 실패
              </Text>

              {/* 설명 */}
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.grey[600],
                  marginBottom: 24,
                  textAlign: 'center',
                }}>
                텍스트 메시지는 필수입니다.
              </Text>

              {/* 확인 버튼 */}
              <Button
                label="확인"
                variant="primary"
                size="S"
                fullWidth={true}
                onPress={closeModal}
              />
            </View>
          ),
        });
        setIsSaving(false);
        return;
      }

      // 제출 전 검증
      const validation = validateContent(data);
      if (!validation.isValid) {
        openModal({
          width: 344,
          height: 'auto',
          closeOnBackdropPress: true,
          children: (
            <View style={{ padding: 24, alignItems: 'center' }}>
              {/* 경고 아이콘 */}
              <View style={{ marginBottom: 16 }}>
                <Icon name="error-warning-fill" size={64} color={Colors.red[500]} />
              </View>

              {/* 타이틀 */}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                검증 실패
              </Text>

              {/* 설명 */}
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.grey[600],
                  marginBottom: 24,
                  textAlign: 'center',
                }}>
                {validation.message}
              </Text>

              {/* 확인 버튼 */}
              <Button
                label="확인"
                variant="primary"
                size="S"
                fullWidth={true}
                onPress={closeModal}
              />
            </View>
          ),
        });
        setIsSaving(false);
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
        // ⭐ capsuleId 및 inviteCode 전달
        console.log('💾 [UserBottomSheet] useSubmitContent Hook 호출');
        console.log('  🆔 capsuleId:', capsuleId);
        console.log('  🔑 inviteCode:', inviteCode || '(없음)');
        console.log('  📝 제출 데이터 요약:');
        console.log('    - 텍스트:', data.textContent.trim().substring(0, 30) + '...');
        console.log('    - 이미지:', data.photos.length, '개');
        console.log('    - 음성:', data.music ? '있음' : '없음');
        console.log('    - 비디오:', data.video ? '있음' : '없음');
        await submitContent({ ...data, inviteCode }, capsuleId);
      }

      // 제출 성공 시 모달 표시 후 바텀시트 닫기
      console.log('🎉 [UserBottomSheet] 저장 성공!');
      // ⭐ 저장 성공 시 제출 완료 상태로 설정 (영구적으로 재수정 불가)
      setHasSubmitted(true);
      // ⭐ 저장 성공 시 다음에 다시 열 때 최신 데이터를 불러올 수 있도록 초기화
      hasLoadedRef.current = null;
      openModal({
        width: 344,
        height: 'auto',
        closeOnBackdropPress: true,
        children: (
          <View style={{ padding: 24, alignItems: 'center' }}>
            {/* 아이콘 */}
            <View style={{ marginBottom: 16 }}>
              <Icon name="checkbox-circle-fill" size={64} color={Colors.green[500]} />
            </View>

            {/* 타이틀 */}
            <Text
              style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
              저장 완료
            </Text>

            {/* 설명 */}
            <Text
              style={{
                fontSize: 14,
                color: Colors.grey[600],
                marginBottom: 24,
                textAlign: 'center',
              }}>
              타임캡슐 내용이 저장되었습니다!
            </Text>

            {/* 확인 버튼 */}
            <Button
              label="확인"
              variant="primary"
              size="S"
              fullWidth={true}
              onPress={() => {
                closeModal();
                setIsSaving(false); // ⭐ 모달 닫을 때 저장 상태 해제
                onClose();
              }}
            />
          </View>
        ),
      });
    } catch (err) {
      // 에러 처리
      console.error('❌ [UserBottomSheet] 제출 중 오류 발생');
      console.error('  에러 타입:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('  에러 메시지:', err instanceof Error ? err.message : String(err));
      if (err instanceof Error && err.stack) {
        console.error('  스택 트레이스:', err.stack);
      }

      // ⭐ 에러 발생 시 저장 상태 해제
      setIsSaving(false);

      // 에러 모달 표시
      openModal({
        width: 344,
        height: 'auto',
        closeOnBackdropPress: true,
        children: (
          <View style={{ padding: 24, alignItems: 'center' }}>
            {/* 에러 아이콘 */}
            <View style={{ marginBottom: 16 }}>
              <Icon name="error-warning-fill" size={64} color={Colors.red[500]} />
            </View>

            {/* 타이틀 */}
            <Text
              style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
              저장 실패
            </Text>

            {/* 에러 메시지 */}
            <Text
              style={{
                fontSize: 14,
                color: Colors.grey[600],
                marginBottom: 24,
                textAlign: 'center',
              }}>
              {err instanceof Error ? err.message : '저장에 실패했습니다.'}
            </Text>

            {/* 확인 버튼 */}
            <Button label="확인" variant="primary" size="S" fullWidth={true} onPress={closeModal} />
          </View>
        ),
      });
    }
  };

  // react-hook-form의 handleSubmit 함수 저장
  const handleFormSubmit = handleSubmit(onFormSubmit);

  // 저장 버튼 핸들러 (플랫폼별 분기: 웹=Modal, 앱=Alert)
  const handleSave = () => {
    console.log('🟢 [handleSave] 저장 버튼 클릭됨!');
    console.log('  - Platform:', Platform.OS);

    // ⭐ 이미 제출 완료된 경우 또는 읽기 전용 모드인 경우 저장 불가
    if (hasSubmitted || isReadOnly) {
      if (Platform.OS === 'web') {
        openModal({
          width: 344,
          height: 'auto',
          closeOnBackdropPress: true,
          children: (
            <View style={{ padding: 24, alignItems: 'center' }}>
              <View style={{ marginBottom: 16 }}>
                <Icon name="error-warning-fill" size={64} color={Colors.red[500]} />
              </View>
              <Text
                style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
                저장 불가
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.grey[600],
                  marginBottom: 24,
                  textAlign: 'center',
                }}>
                이미 제출 완료된 콘텐츠는 수정할 수 없습니다.
              </Text>
              <Button
                label="확인"
                variant="primary"
                size="S"
                fullWidth={true}
                onPress={closeModal}
              />
            </View>
          ),
        });
      } else {
        Alert.alert('저장 불가', '이미 제출 완료된 콘텐츠는 수정할 수 없습니다.', [
          { text: '확인', style: 'default' },
        ]);
      }
      return;
    }

    // ⭐ 플랫폼별 저장 확인 다이얼로그
    if (Platform.OS === 'web') {
      // 웹: 커스텀 Modal 사용
      openModal({
        width: 344,
        height: 'auto',
        closeOnBackdropPress: true,
        children: (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <View style={{ marginBottom: 16 }}>
              <Icon name="save-line" size={64} color={Colors.blue[500]} />
            </View>
            <Text
              style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
              저장하시겠어요?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.grey[600],
                marginBottom: 24,
                textAlign: 'center',
              }}>
              한번 저장한 내용은 수정할 수 없어요
            </Text>
            <DualButton
              cancelLabel="취소"
              confirmLabel="저장하기"
              size="S"
              cancelVariant="outline"
              confirmVariant="primary"
              fullWidth={true}
              onCancelPress={closeModal}
              onConfirmPress={async () => {
                closeModal();
                await new Promise((resolve) => setTimeout(resolve, 100));
                await handleFormSubmit();
              }}
            />
          </View>
        ),
      });
    } else {
      // 앱: React Native Alert 사용
      Alert.alert(
        '저장하시겠어요?',
        '한번 저장한 내용은 수정할 수 없어요',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '저장하기',
            style: 'default',
            onPress: async () => {
              await handleFormSubmit();
            },
          },
        ],
        { cancelable: true },
      );
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    if (isDirty) {
      openModal({
        width: 344,
        height: 'auto',
        closeOnBackdropPress: true,
        children: (
          <View style={{ padding: 24, alignItems: 'center' }}>
            {/* 아이콘 */}
            <View style={{ marginBottom: 16 }}>
              <Icon name="question-line" size={64} color={Colors.blue[500]} />
            </View>

            {/* 타이틀 */}
            <Text
              style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
              작성 취소
            </Text>

            {/* 설명 */}
            <Text
              style={{
                fontSize: 14,
                color: Colors.grey[600],
                marginBottom: 24,
                textAlign: 'center',
              }}>
              작성 중인 내용이 있습니다. 취소하시겠습니까?
            </Text>

            {/* 버튼 */}
            <DualButton
              cancelLabel="계속 작성"
              confirmLabel="취소"
              size="S"
              cancelVariant="outline"
              confirmVariant="primary"
              fullWidth={true}
              onCancelPress={closeModal}
              onConfirmPress={() => {
                closeModal();
                onClose();
              }}
            />
          </View>
        ),
      });
    } else {
      onClose();
    }
  };

  // 하단 고정 버튼 영역 (공통 컴포넌트의 footer 스타일 사용)
  const renderFooter = () => (
    <>
      {!isReadOnly && !hasSubmitted ? (
        <>
          <DualButton
            cancelLabel="취소"
            confirmLabel={
              isSaving || isSubmitting
                ? uploadProgress || '저장 중...' // ⭐ 업로드 진행 상태 표시
                : '저장'
            }
            size="M"
            cancelVariant="outline"
            confirmVariant="primary"
            confirmDisabled={isSaving || isSubmitting || hasSubmitted} // ⭐ 제출 완료 시에도 비활성화
            onCancelPress={() => {
              console.log('🔴 [DualButton] 취소 버튼 클릭됨');
              handleCancel();
            }}
            onConfirmPress={() => {
              console.log('🟢 [DualButton] 저장 버튼 클릭 시도');
              console.log('  - disabled 상태:', isSaving || isSubmitting || hasSubmitted);
              handleSave();
            }}
          />
          <Text style={styles.hintText}>한번 저장한 내용은 수정할 수 없어요</Text>
        </>
      ) : (
        <View style={{ paddingVertical: 16 }}>
          <Button label="닫기" variant="primary" size="L" fullWidth={true} onPress={onClose} />
          {hasSubmitted && !isReadOnly && (
            <Text style={[styles.hintText, { marginTop: 8, textAlign: 'center' }]}>
              이미 제출 완료된 콘텐츠입니다
            </Text>
          )}
        </View>
      )}
    </>
  );

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} footer={renderFooter()}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>MY CONTENTS</Text>
          <Text style={styles.subtitle}>
            {hasSubmitted || isReadOnly
              ? '제출 완료된 콘텐츠입니다 (수정 불가)'
              : '나만의 타임캡슐 내용을 작성해요'}
          </Text>
        </View>

        {/* 텍스트 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="file-text-line" size={20} color={Colors.black[500]} />
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
                  style={[
                    styles.textArea,
                    (isReadOnly || hasSubmitted) && {
                      backgroundColor: Colors.grey[50],
                      color: Colors.black[500],
                      borderRadius: 16, // ⭐ 컨테이너와 동일한 borderRadius 적용
                    },
                  ]}
                  placeholder="당신의 이야기를 남겨주세요..."
                  placeholderTextColor={Colors.grey[400]}
                  multiline
                  value={value}
                  onChangeText={onChange}
                  textAlignVertical="top"
                  editable={!isReadOnly && !hasSubmitted}
                />
              )}
            />
          </View>
        </View>

        {/* 사진 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="image-line" size={20} color={Colors.black[500]} />
            <Text style={styles.sectionTitle}>
              사진 ({watch('photos').length}/{maxImagesPerPerson})
            </Text>
          </View>
          {/* ⭐ 읽기 전용 모드가 아닐 때만 사진 추가 버튼 표시 */}
          {!isReadOnly && !hasSubmitted && (
            <Button
              label={isPickingImage ? '선택 중...' : '사진 추가'}
              variant="outline"
              size="M"
              icon="ri-add-line"
              disabled={isPickingImage || currentPhotos.length >= maxImagesPerPerson}
              onPress={handleAddPhoto}
            />
          )}

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
                        {!isReadOnly && !hasSubmitted && (
                          <Pressable
                            style={styles.deleteButton}
                            onPress={() => handleDeletePhoto(index)}>
                            <Icon name="close-line" size={20} color={Colors.black[500]} />
                          </Pressable>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          />
        </View>

        {/* 음성 섹션 - hasMusic이 true일 때만 표시 */}
        {hasMusic && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="music-line" size={20} color={Colors.black[500]} />
              <Text style={styles.sectionTitle}>음성 ({currentMusic ? 1 : 0}/1)</Text>
            </View>
            {/* ⭐ 읽기 전용 모드가 아닐 때만 음성 추가/교체 버튼 표시 */}
            {!isReadOnly && !hasSubmitted && (
              <Button
                label={currentMusic ? '음성 교체' : '음성 추가'}
                variant="outline"
                size="M"
                icon="ri-add-line"
                disabled={isAudioAttachmentVisible}
                onPress={handleAddMusic}
              />
            )}

            {/* 선택된 음성 표시 */}
            {currentMusic && (
              <View style={styles.mediaFileContainer}>
                <View style={styles.mediaFileInfo}>
                  <Icon name="music-fill" size={24} color={Colors.black[500]} />
                  <Text style={styles.mediaFileName} numberOfLines={1}>
                    {currentMusic.split('/').pop() || '음성 파일'}
                  </Text>
                </View>
                {!isReadOnly && !hasSubmitted && (
                  <Pressable
                    style={styles.mediaDeleteButton}
                    onPress={() => setValue('music', null, { shouldDirty: true })}>
                    <Icon name="close-line" size={20} color={Colors.black[500]} />
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}

        {/* 동영상 섹션 - hasVideo가 true일 때만 표시 */}
        {hasVideo && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="video-line" size={20} color={Colors.black[500]} />
              <Text style={styles.sectionTitle}>동영상 ({currentVideo ? 1 : 0}/1)</Text>
            </View>
            {/* ⭐ 읽기 전용 모드가 아닐 때만 동영상 추가/교체 버튼 표시 */}
            {!isReadOnly && !hasSubmitted && (
              <Button
                label={isPickingVideo ? '선택 중...' : currentVideo ? '동영상 교체' : '동영상 추가'}
                variant="outline"
                size="M"
                icon="ri-add-line"
                disabled={isPickingVideo}
                onPress={handleAddVideo}
              />
            )}

            {/* 선택된 동영상 표시 */}
            {currentVideo && (
              <View style={styles.mediaFileContainer}>
                <View style={styles.mediaFileInfo}>
                  <Icon name="video-fill" size={24} color={Colors.black[500]} />
                  <Text style={styles.mediaFileName} numberOfLines={1}>
                    {currentVideo.split('/').pop() || '동영상 파일'}
                  </Text>
                </View>
                {!isReadOnly && !hasSubmitted && (
                  <Pressable
                    style={styles.mediaDeleteButton}
                    onPress={() => setValue('video', null, { shouldDirty: true })}>
                    <Icon name="close-line" size={20} color={Colors.black[500]} />
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}
      </View>

      {/* AudioAttachment 모달 */}
      <AudioAttachment
        visible={isAudioAttachmentVisible}
        onClose={() => setIsAudioAttachmentVisible(false)}
        onSelectAudio={handleAudioSelected}
      />
    </BottomSheet>
  );
}
