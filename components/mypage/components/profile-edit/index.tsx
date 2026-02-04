/**
 * components/mypage/components/profile-edit/index.tsx
 * 프로필 편집 모달 컴포넌트
 *
 * 프롬프트: prompt.101.ui.txt
 * Figma 노드 ID: 1013-2463
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] 공통 컴포넌트 사용 (DualButton)
 * - [✓] 기존 기능 로직 유지 (useState, useUserInfo, handleSave, handleCancel)
 * - [✓] 오직 UI/스타일만 수정
 *
 * 공통 컴포넌트 재검토 (recheck.201.optional.ui.component):
 * - [✓] DualButton 컴포넌트 사용: 취소/저장 버튼에 사용
 * - [✓] "사진 변경" 버튼: 특수 스타일(84x36, 회색 배경)이 필요하여 독립 구현
 *   - Button 컴포넌트는 최소 48px 높이(size="S")만 지원하여 36px 높이 구현 불가
 *   - Button 컴포넌트에 회색 배경 variant가 없음
 *   - 프로필 편집 전용 UI이므로 독립적으로 구현하되, 향후 공통화 가능하도록 구조 유지
 */

import { DualButton } from '@/commons/components/dual-button';
import { Colors } from '@/commons/constants';
import { isValidImageUrl } from '@/utils';
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
  const profileImageUrl = userInfo?.profileImageUrl;
  const hasValidProfileImage = isValidImageUrl(profileImageUrl);

  const handleSave = () => {
    // TODO: API 호출로 프로필 수정
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
