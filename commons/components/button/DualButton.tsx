/**
 * commons/components/button/DualButton.tsx
 * 듀얼 버튼 컴포넌트 (취소 + 확인)
 *
 * @description
 * - 2개의 Button 컴포넌트를 가로로 배치
 * - 왼쪽: secondary variant (취소)
 * - 오른쪽: primary variant (확인)
 * - 동일한 크기 (L/M/S)
 * - 버튼 간격: DUAL_BUTTON_GAP
 * - 용도: 바텀시트_버튼, 모달_버튼
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { DualButtonProps } from './types';

// 듀얼 버튼 간격 (Figma 기준: 12px)
const DUAL_BUTTON_GAP = 12;

export function DualButton({
  cancelLabel,
  confirmLabel,
  size = 'L',
  cancelDisabled = false,
  confirmDisabled = false,
  onCancelPress,
  onConfirmPress,
}: DualButtonProps) {
  return (
    <View style={styles.container}>
      {/* 취소 버튼 (왼쪽, secondary) */}
      <View style={styles.button}>
        <Button
          label={cancelLabel}
          variant="secondary"
          size={size}
          disabled={cancelDisabled}
          onPress={onCancelPress}
          fullWidth={true}
        />
      </View>

      {/* 확인 버튼 (오른쪽, primary) */}
      <View style={styles.button}>
        <Button
          label={confirmLabel}
          variant="primary"
          size={size}
          disabled={confirmDisabled}
          onPress={onConfirmPress}
          fullWidth={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: DUAL_BUTTON_GAP,
    width: '100%',
  },
  button: {
    flex: 1,
  },
});
