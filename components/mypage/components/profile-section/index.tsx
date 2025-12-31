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

import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

export function ProfileSection() {
  return (
    <View style={styles.container}>
      {/* Switch container (프로필 이미지/스위치 영역) */}
      <View style={styles.switchContainer}>
        <View style={styles.switchInnerContainer}>
          <View style={styles.switch}>
            <Text style={styles.switchEmoji}>🐰</Text>
          </View>
        </View>
        {/* 작은 원형 버튼 (flexbox로 우측 하단 배치) */}
        <View style={styles.smallButtonWrapper}>
          <View style={styles.smallButton}>
            <Image
              source={require('../../../../assets/icons/camera.png')}
              style={styles.smallButtonInner}
              contentFit="contain"
              accessibilityLabel="카메라 아이콘"
            />
          </View>
        </View>
      </View>

      {/* Button (토끼유저 텍스트) */}
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>토끼유저</Text>
      </View>

      {/* Text input (이메일) */}
      <View style={styles.textInputContainer}>
        <Text style={styles.textInputText}>rabbit@example.com</Text>
      </View>
    </View>
  );
}
