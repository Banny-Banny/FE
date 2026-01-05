/**
 * components/timecapsule-create/components/payment-complete-modal/styles.ts
 * 결제 완료 모달 스타일
 */

import { StyleSheet } from 'react-native';
import { Colors } from '@/commons/constants/color';
import { Typography } from '@/commons/constants/typography';

export const styles = StyleSheet.create({
  /**
   * 컨테이너 (전체)
   * - padding: 24px
   */
  container: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 32,
  },

  /**
   * 아이콘 + 텍스트 섹션
   * - 중앙 정렬
   */
  contentSection: {
    alignItems: 'center',
    gap: 12,
  },

  /**
   * 아이콘 컨테이너
   * - 80px x 80px
   * - border-radius: 28px
   */
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: Colors.grey[50],
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * 제목
   * - 20px Bold
   * - line-height: 22px
   * - letter-spacing: -0.849
   */
  title: {
    fontFamily: Typography.caption.caption2.fontFamily,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.849,
    color: Colors.black[500],
    textAlign: 'center' as const,
  },
});
