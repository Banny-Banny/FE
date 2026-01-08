/**
 * ZoomControl Component
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] 비즈니스 로직은 hooks/useZoomControl에서 관리
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useZoomControl } from './hooks/useZoomControl';
import { styles } from './styles';
import type { ZoomControlProps } from './types';

export function ZoomControl({
  onZoomIn,
  onZoomOut,
  onReset,
  canZoomIn = true,
  canZoomOut = true,
}: ZoomControlProps) {
  // 비즈니스 로직은 Hook에서 가져옴
  const {
    handleZoomIn,
    handleZoomOut,
    handleReset,
    isZoomInDisabled,
    isZoomOutDisabled,
    hasResetButton,
  } = useZoomControl({
    onZoomIn,
    onZoomOut,
    onReset,
    canZoomIn,
    canZoomOut,
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, isZoomInDisabled && styles.buttonDisabled]}
        onPress={handleZoomIn}
        disabled={isZoomInDisabled}
        accessibilityRole="button"
        accessibilityLabel="확대"
        accessibilityHint="지도를 확대합니다">
        <Text style={[styles.buttonText, isZoomInDisabled && styles.buttonTextDisabled]}>+</Text>
      </Pressable>
      <View style={styles.divider} />
      <Pressable
        style={[styles.button, isZoomOutDisabled && styles.buttonDisabled]}
        onPress={handleZoomOut}
        disabled={isZoomOutDisabled}
        accessibilityRole="button"
        accessibilityLabel="축소"
        accessibilityHint="지도를 축소합니다">
        <Text style={[styles.buttonText, isZoomOutDisabled && styles.buttonTextDisabled]}>−</Text>
      </Pressable>
      {hasResetButton && (
        <>
          <View style={styles.divider} />
          <Pressable
            style={styles.button}
            onPress={handleReset}
            accessibilityRole="button"
            accessibilityLabel="줌 리셋"
            accessibilityHint="지도 줌을 기본값으로 리셋합니다">
            <Text style={styles.buttonText}>⌂</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

export default ZoomControl;
