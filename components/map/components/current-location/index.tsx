/**
 * CurrentLocation Component
 * Version: 1.0.0
 * Updated: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] nativewind 토큰 참조만 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 */

import { Colors } from '@/commons/constants';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { useCurrentLocationAddress } from './hooks';
import { styles } from './styles';

export interface CurrentLocationProps {
  /**
   * 현재 위치의 위도
   */
  lat: number;
  /**
   * 현재 위치의 경도
   */
  lng: number;
}

/**
 * 현재 위치를 표시하는 컴포넌트
 * Figma 디자인에 따라 반투명 배경과 위치 아이콘, 주소 텍스트를 표시합니다.
 * 카카오 로컬 API를 사용하여 위도/경도를 주소로 변환합니다.
 */
export default function CurrentLocation({ lat, lng }: CurrentLocationProps) {
  const { address, isLoading } = useCurrentLocationAddress({ lat, lng });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="map-pin-fill" size={12} color={Colors.red[500]} />
      </View>
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.white[50]} style={styles.loadingIndicator} />
      ) : (
        <Text style={styles.addressText}>{address || '위치 정보 없음'}</Text>
      )}
    </View>
  );
}
