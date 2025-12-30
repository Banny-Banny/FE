/**
 * commons/components/button/DualButton.tsx
 * 듀얼 버튼 컴포넌트 (취소 + 확인)
 *
 * @description
 * - 2개의 Button 컴포넌트를 가로로 배치
 * - 왼쪽: 기본 secondary variant (커스터마이징 가능)
 * - 오른쪽: 기본 primary variant (커스터마이징 가능)
 * - 동일한 크기 (L/M/S)
 * - 버튼 간격: DUAL_BUTTON_GAP
 * - 용도: 바텀시트_버튼, 모달_버튼
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { DUAL_BUTTON_GAP } from './constants';
import { DualButtonProps } from './types';

export function DualButton({
  cancelLabel,
  confirmLabel,
  size = 'L',
  cancelVariant = 'secondary',
  confirmVariant = 'primary',
  fullWidth = true,
  width,
  cancelDisabled = false,
  confirmDisabled = false,
  onCancelPress,
  onConfirmPress,
}: DualButtonProps) {
  // width 우선순위: width prop > fullWidth
  const containerWidth = width !== undefined ? width : fullWidth ? '100%' : undefined;

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      {/* 취소 버튼 (왼쪽) */}
      <View style={styles.button}>
        <Button
          label={cancelLabel}
          variant={cancelVariant}
          size={size}
          disabled={cancelDisabled}
          onPress={onCancelPress}
          fullWidth={true}
        />
      </View>

      {/* 확인 버튼 (오른쪽) */}
      <View style={styles.button}>
        <Button
          label={confirmLabel}
          variant={confirmVariant}
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
  },
  button: {
    flex: 1,
  },
});
