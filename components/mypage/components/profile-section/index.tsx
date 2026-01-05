/**
 * components/mypage/components/profile-section/index.tsx
 * 프로필 섹션 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 */

import { useModal } from '@/commons/components/modal/hooks/useModal';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useUserInfo } from '../../hooks/useUserInfo';
import { ProfileEdit } from '../profile-edit';
import { styles } from './styles';

export function ProfileSection() {
  const { data: userInfo, isLoading, error } = useUserInfo();
  const [imageError, setImageError] = useState(false);
  const { openModal, closeModal } = useModal();

  // userInfo가 변경되면 이미지 에러 상태 리셋
  useEffect(() => {
    setImageError(false);
  }, [userInfo?.profileImg]);

  // 로딩 중
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={styles.loadingIndicator.color} />
      </View>
    );
  }

  // 에러 발생
  if (error || !userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || '사용자 정보를 불러올 수 없습니다.'}</Text>
      </View>
    );
  }

  // 프로바이더 텍스트 변환 (phoneNumber에서 추출 또는 email 사용)
  const getProviderText = () => {
    // phoneNumber가 "kakao_"로 시작하면 카카오 로그인
    if (userInfo.phoneNumber?.startsWith('kakao_')) {
      return '카카오 로그인';
    }
    // email이 있으면 이메일 표시
    if (userInfo.email) {
      return userInfo.email;
    }
    return '로그인 정보 없음';
  };

  // 프로필 이미지 URL 유효성 검사
  const profileImageUrl = userInfo.profileImg;
  const hasValidProfileImage =
    profileImageUrl !== undefined &&
    profileImageUrl !== null &&
    typeof profileImageUrl === 'string' &&
    profileImageUrl.trim() !== '' &&
    profileImageUrl !== 'null' &&
    !imageError;

  // 디버깅용 로그 (개발 환경에서만)
  if (__DEV__ && userInfo) {
    console.log('[ProfileSection] profileImg 값:', userInfo.profileImg);
    console.log('[ProfileSection] profileImg 타입:', typeof userInfo.profileImg);
    console.log('[ProfileSection] hasValidProfileImage:', hasValidProfileImage);
  }

  return (
    <View style={styles.container}>
      {/* Switch container (프로필 이미지/스위치 영역) */}
      <View style={styles.switchContainer}>
        <View style={styles.switchInnerContainer}>
          <View style={styles.switch}>
            {hasValidProfileImage && profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                style={styles.profileImage}
                contentFit="cover"
                accessibilityLabel="프로필 이미지"
                onError={() => {
                  if (__DEV__) {
                    console.log('[ProfileSection] 이미지 로딩 실패:', profileImageUrl);
                  }
                  setImageError(true);
                }}
              />
            ) : (
              <Text style={styles.switchEmoji}>🐰</Text>
            )}
          </View>
        </View>
        {/* 작은 원형 버튼 (flexbox로 우측 하단 배치) */}
        <Pressable
          style={styles.smallButtonWrapper}
          onPress={() => {
            openModal({
              width: 340,
              closeOnBackdropPress: true,
              children: <ProfileEdit onClose={closeModal} />,
            });
          }}
          accessibilityRole="button"
          accessibilityLabel="프로필 편집">
          <View style={styles.smallButton}>
            <Image
              source={require('../../../../assets/icons/camera.png')}
              style={styles.smallButtonInner}
              contentFit="contain"
              accessibilityLabel="카메라 아이콘"
            />
          </View>
        </Pressable>
      </View>

      {/* Button (닉네임 텍스트) */}
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>{userInfo.nickname}</Text>
      </View>

      {/* Text input (이메일 또는 프로바이더) */}
      <View style={styles.textInputContainer}>
        <Text style={styles.textInputText}>{getProviderText()}</Text>
      </View>
    </View>
  );
}
