/**
 * components/mypage/components/profile-edit/index.tsx
 * 프로필 편집 모달 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 */

import { DualButton } from '@/commons/components/dual-button';
import { Colors, Typography } from '@/commons/constants';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useUserInfo } from '../../hooks/useUserInfo';
import { styles } from './styles';

interface ProfileEditProps {
  onClose: () => void;
}

export function ProfileEdit({ onClose }: ProfileEditProps) {
  const { data: userInfo } = useUserInfo();
  const [nickname, setNickname] = useState(userInfo?.nickname || '');

  // 프로필 이미지 URL 유효성 검사
  const profileImageUrl = userInfo?.profileImg;
  const hasValidProfileImage =
    profileImageUrl !== undefined &&
    profileImageUrl !== null &&
    typeof profileImageUrl === 'string' &&
    profileImageUrl.trim() !== '' &&
    profileImageUrl !== 'null';

  const handleSave = () => {
    // TODO: API 호출로 프로필 수정
    console.log('프로필 저장:', { nickname });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <View style={styles.container}>
      {/* 제목 */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>프로필 수정</Text>
      </View>

      {/* 프로필 이미지 영역 */}
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImageWrapper}>
          {hasValidProfileImage && profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              style={styles.profileImage}
              contentFit="cover"
              accessibilityLabel="프로필 이미지"
            />
          ) : (
            <Text style={styles.profileEmoji}>🐰</Text>
          )}
        </View>
        <Pressable style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>사진 변경</Text>
        </Pressable>
      </View>

      {/* 닉네임 입력 영역 */}
      <View style={styles.nicknameContainer}>
        <Text style={styles.labelText}>닉네임</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력하세요"
            placeholderTextColor={Colors.darkGrey[400]}
          />
        </View>
      </View>

      {/* 취소/저장 버튼 */}
      <DualButton
        cancelLabel="취소"
        confirmLabel="저장"
        size="S"
        onCancelPress={handleCancel}
        onConfirmPress={handleSave}
      />
    </View>
  );
}

