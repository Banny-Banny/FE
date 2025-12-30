/**
 * commons/components/button/types.ts
 * Button 컴포넌트 타입 정의
 */

import { DimensionValue } from 'react-native';

/**
 * 버튼 Variant 타입
 * - primary: 검은색 배경 (활성화 상태)
 * - secondary: 회색 배경 (비활성화 상태)
 * - outline: 흰색 배경 + 검은색 테두리 + 아이콘 (공유 등)
 * - danger: 빨간색 배경 (로그아웃, 삭제 등)
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

/**
 * 버튼 크기 타입
 * - L: Large (64px)
 * - M: Medium (56px)
 * - S: Small (48px)
 */
export type ButtonSize = 'L' | 'M' | 'S';

/**
 * 아이콘 위치 타입
 * - left: 아이콘 + 텍스트 (아이콘이 텍스트 왼쪽)
 * - only: 아이콘만 표시 (텍스트 숨김)
 */
export type IconPosition = 'left' | 'only';

/**
 * Button 컴포넌트 Props
 */
export interface ButtonProps {
  /**
   * 버튼 텍스트 (필수)
   */
  label: string;

  /**
   * 버튼 variant (선택, 기본값: 'primary')
   */
  variant?: ButtonVariant;

  /**
   * 버튼 크기 (선택, 기본값: 'L')
   */
  size?: ButtonSize;

  /**
   * 아이콘 이름 (선택)
   * react-native-remix-icon 아이콘 이름
   * @example 'ri-inbox-line', 'ri-share-line'
   */
  icon?: string;

  /**
   * 아이콘 위치 (선택, 기본값: 'left')
   * - left: 아이콘 + 텍스트
   * - only: 아이콘만
   */
  iconPosition?: IconPosition;

  /**
   * 전체 너비 사용 여부 (선택, 기본값: true)
   * width가 지정되면 무시됨
   */
  fullWidth?: boolean;

  /**
   * 커스텀 너비 (선택)
   * 숫자(px) 또는 퍼센트 문자열 지정 가능
   * @example width={200} // 200px
   * @example width="50%" // 50%
   */
  width?: DimensionValue;

  /**
   * 비활성화 상태 (선택, 기본값: false)
   */
  disabled?: boolean;

  /**
   * 버튼 클릭 핸들러 (필수)
   */
  onPress: () => void;
}

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
   * 취소 버튼 variant (선택, 기본값: 'secondary')
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
   * 취소 버튼 비활성화 상태 (선택, 기본값: false)
   */
  cancelDisabled?: boolean;

  /**
   * 확인 버튼 비활성화 상태 (선택, 기본값: false)
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
