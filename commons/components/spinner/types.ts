/**
 * Spinner Types
 * Version: 1.0.0
 * Created: 2025-01-11
 */

export interface SpinnerProps {
  /**
   * 스피너 크기
   * @default 'large'
   */
  size?: 'small' | 'large';

  /**
   * 스피너 색상
   * @default '#007AFF'
   */
  color?: string;

  /**
   * 전체 화면 모드
   * @default false
   */
  fullScreen?: boolean;
}
