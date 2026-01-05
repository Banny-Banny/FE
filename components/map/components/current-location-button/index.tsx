/**
 * CurrentLocationButton Component
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Sub-Component] 현재 위치로 지도 이동 버튼
 * - 지도 왼쪽 하단에 위치
 * - 원형 버튼에 타겟 아이콘 표시
 * - 클릭 시 현재 위치로 지도 이동
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 */

import { Colors } from '@/commons/constants';
import React from 'react';
import { Platform, Pressable } from 'react-native';
import Icon from 'react-native-remix-icon';

import { sendMoveCameraMessage } from '../map-view/webview/sendMessage';
import { styles } from './styles';
import type { CurrentLocationButtonProps } from './types';

/**
 * 현재 위치로 지도를 이동시키는 버튼 컴포넌트
 *
 * @example
 * ```tsx
 * <CurrentLocationButton
 *   webViewRef={webViewRef}
 *   location={{ lat: 37.5665, lng: 126.978 }}
 *   isLoading={false}
 * />
 * ```
 */
export function CurrentLocationButton({
  webViewRef,
  location,
  isLoading = false,
  onMoveToLocation,
}: CurrentLocationButtonProps) {
  const handlePress = () => {
    if (!location || isLoading) return;

    if (Platform.OS === 'web') {
      // 웹 환경: onMoveToLocation 콜백 사용
      onMoveToLocation?.(location);
    } else {
      // Native 환경: WebView 메시지 전송
      sendMoveCameraMessage(webViewRef!, location);
    }
  };

  const isDisabled = !location || isLoading;

  return (
    <Pressable
      style={[styles.container, styles.button, isDisabled && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel="현재 위치로 이동"
      accessibilityHint="지도를 현재 위치로 이동시킵니다">
      <Icon name="focus-3-line" size={24} color={Colors.black[900]} />
    </Pressable>
  );
}
