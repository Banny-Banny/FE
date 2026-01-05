/**
 * commons/components/dual-button/index.tsx
 * 듀얼 버튼 컴포넌트 (취소 + 확인)
 *
 * @description
 * - 2개의 Button 컴포넌트를 가로로 배치
 * - 왼쪽: 기본 outline variant (커스터마이징 가능)
 * - 오른쪽: 기본 primary variant (커스터마이징 가능)
 * - 동일한 크기 (L/M/S)
 * - 버튼 간격: DUAL_BUTTON_GAP
 * - 용도: 바텀시트_버튼, 모달_버튼
 */

import { Button, ButtonSize, ButtonVariant } from '@/commons/components/button';
import React from 'react';
import { DimensionValue, View } from 'react-native';
import { styles } from './styles';

/**
 * DualButton 컴포넌트 Props
 */
export interface DualButtonProps {
  /**
   * 취소 버튼 텍스트 (필수)
   */
  cancelLabel: string;

  /**
   * 확인 버튼 텍스트 (필수)
   */
  confirmLabel: string;

  /**
   * 버튼 크기 (선택, 기본값: 'L')
   */
  size?: ButtonSize;

  /**
   * 취소 버튼 variant (선택, 기본값: 'outline')
   */
  cancelVariant?: ButtonVariant;

  /**
   * 확인 버튼 variant (선택, 기본값: 'primary')
   */
  confirmVariant?: ButtonVariant;

  /**
   * 전체 너비 사용 여부 (선택, 기본값: true)
   * width가 지정되면 무시됨
   */
  fullWidth?: boolean;

  /**
   * 커스텀 너비 (선택)
   * 숫자(px) 또는 퍼센트 문자열 지정 가능
   * @example width={300} // 300px
   * @example width="80%" // 80%
   */
  width?: DimensionValue;

  /**
   * 확인 버튼 비활성화 상태 (선택, 기본값: false)
   * Note: 취소 버튼(왼쪽)은 항상 활성화 상태입니다.
   */
  confirmDisabled?: boolean;

  /**
   * 취소 버튼 클릭 핸들러 (필수)
   */
  onCancelPress: () => void;

  /**
   * 확인 버튼 클릭 핸들러 (필수)
   */
  onConfirmPress: () => void;
}

export function DualButton({
  cancelLabel,
  confirmLabel,
  size = 'L',
  cancelVariant = 'outline',
  confirmVariant = 'primary',
  fullWidth = true,
  width,
  confirmDisabled = false,
  onCancelPress,
  onConfirmPress,
}: DualButtonProps) {
  // width 우선순위: width prop > fullWidth
  const containerWidth = width !== undefined ? width : fullWidth ? '100%' : undefined;

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      {/* 취소 버튼 (왼쪽) - 항상 활성화 */}
      <View style={styles.button}>
        <Button
          label={cancelLabel}
          variant={cancelVariant}
          size={size}
          disabled={false}
          onPress={onCancelPress}
          fullWidth={true}
        />
      </View>

      {/* 확인 버튼 (오른쪽) */}
      {/* Note: disabled={true}일 때 Button 컴포넌트가 자동으로 variant를 'disabled'로 변경합니다 */}
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
