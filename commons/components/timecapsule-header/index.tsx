/**
 * commons/components/timecapsule-header/index.tsx
 * TimeCapsuleHeader 컴포넌트 - 타임캡슐 헤더 공통 컴포넌트
 *
 * @description
 * - step-info, step-room 컴포넌트의 헤더를 통합한 공통 컴포넌트
 * - 순수 UI 컴포넌트로 구현 (비즈니스 로직 없음)
 * - 모든 이벤트 핸들러는 props로 받아서 사용
 *
 * @example
 * ```typescript
 * // 기본 헤더
 * <TimeCapsuleHeader
 *   title="타임캡슐 만들기"
 *   onBack={() => navigation.back()}
 * />
 *
 * // 확장 헤더
 * <TimeCapsuleHeader
 *   title="캡슐 대기실"
 *   onBack={() => navigation.back()}
 *   rightIcons={[
 *     { icon: 'more-2-fill', onPress: handleMore },
 *     { icon: 'close-line', onPress: handleClose },
 *   ]}
 * />
 * ```
 */

import { Colors, Typography } from '@/commons/constants';
import { Image } from 'expo-image';
import React from 'react';
import { ImageSourcePropType, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from './styles';

// ============================================
// 타입 정의
// ============================================

/** 오른쪽 아이콘 버튼 타입 */
export interface RightIcon {
  /** react-native-remix-icon 아이콘 이름 (icon 또는 imageSource 중 하나 필수) */
  icon?: string;
  /** 이미지 소스 (icon 또는 imageSource 중 하나 필수) */
  imageSource?: ImageSourcePropType | string;
  /** 아이콘 크기 (기본값: 24) */
  size?: number;
  /** 아이콘 색상 (기본값: Colors.black[500], imageSource 사용 시 무시) */
  color?: string;
  /** 버튼 클릭 핸들러 */
  onPress: () => void;
  /** 접근성 라벨 */
  accessibilityLabel?: string;
}

/** TimeCapsuleHeader Props 타입 */
export interface TimeCapsuleHeaderProps {
  /** 헤더 제목 (필수) */
  title: string;
  /** 뒤로가기 핸들러 (선택, 있으면 뒤로가기 버튼 표시) */
  onBack?: () => void;
  /** 오른쪽 아이콘 버튼들 (선택) */
  rightIcons?: RightIcon[];
  /** 하단 보더 표시 여부 (기본값: true) */
  showBorder?: boolean;
  /** 배경색 (기본값: Colors.white[500]) */
  backgroundColor?: string;
  /** 제목 정렬 (기본값: 'center') */
  titleAlign?: 'left' | 'center';
}

// ============================================
// 컴포넌트
// ============================================

export function TimeCapsuleHeader({
  title,
  onBack,
  rightIcons,
  showBorder = true,
  backgroundColor = Colors.white[500],
  titleAlign = 'center',
}: TimeCapsuleHeaderProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.headerContainer,
          titleAlign === 'left' && !onBack && styles.headerContainerLeft,
        ]}>
        {/* 왼쪽: 뒤로가기 버튼 */}
        {onBack && (
          <Pressable
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="뒤로가기">
            <Icon name="arrow-left-line" size={24} color={Colors.black[500]} />
          </Pressable>
        )}

        {/* 제목 */}
        <View
          style={[
            styles.headerCenter,
            titleAlign === 'left' ? styles.headerCenterLeft : styles.headerCenterCenter,
          ]}>
          <Text
            style={[
              styles.title,
              titleAlign === 'left' && styles.titleLeft,
            ]}>
            {title}
          </Text>
        </View>

        {/* 오른쪽: 아이콘 버튼들 */}
        {rightIcons && rightIcons.length > 0 ? (
          <View style={styles.headerRight}>
            {rightIcons.map((rightIcon, index) => {
              const iconSize = rightIcon.size || 24;
              const iconColor = rightIcon.color || Colors.black[500];
              const accessibilityLabel =
                rightIcon.accessibilityLabel || `${rightIcon.icon || '아이콘'} 버튼`;

              return (
                <Pressable
                  key={index}
                  style={[styles.iconButton, { width: iconSize, height: iconSize }]}
                  onPress={rightIcon.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={accessibilityLabel}>
                  {rightIcon.imageSource ? (
                    <Image
                      source={
                        typeof rightIcon.imageSource === 'string'
                          ? rightIcon.imageSource
                          : rightIcon.imageSource
                      }
                      style={{ width: iconSize, height: iconSize }}
                      contentFit="contain"
                    />
                  ) : rightIcon.icon ? (
                    <Icon name={rightIcon.icon} size={iconSize} color={iconColor} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.headerRightPlaceholder} />
        )}
      </View>

      {/* 하단 보더 */}
      {showBorder && <View style={styles.border} />}
    </View>
  );
}

