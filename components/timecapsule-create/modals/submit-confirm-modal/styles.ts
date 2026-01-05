/**
 * components/timecapsule-create/components/submit-confirm-modal/styles.ts
 * 타임캡슐 묻기 확인 모달 스타일
 * - 피그마: 459:1421
 */

import { StyleSheet } from 'react-native';
import { Colors } from '@/commons/constants/color';
import { Typography } from '@/commons/constants/typography';

export const styles = StyleSheet.create({
  /**
   * 컨테이너
   */
  container: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  /**
   * 아이콘 컨테이너
   * - 112px 원형
   */
  iconContainer: {
    width: 112,
    height: 112,
    borderRadius: 9999,
    backgroundColor: Colors.grey[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  /**
   * 텍스트 영역
   */
  textContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },

  /**
   * 제목
   * - 24px Bold, #0a0a0a
   */
  title: {
    fontFamily: Typography.caption.caption2.fontFamily,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: 0.0703125,
    color: Colors.black[500],
    textAlign: 'center' as const,
  },

  /**
   * 설명
   * - 16px Bold, #666
   */
  description: {
    ...Typography.body.body4, // 16px Regular
    fontWeight: '700' as const,
    color: Colors.grey[800],
    textAlign: 'center' as const,
    marginTop: 18,
  },

  /**
   * 구분선
   */
  divider: {
    width: '100%',
    height: 1.838,
    backgroundColor: Colors.whiteGrey[500],
    marginBottom: 18,
  },

  /**
   * 개봉일 정보 카드
   * - 피그마: 95.96px 높이, #f5f5f5 배경, 중앙 정렬
   */
  infoCardContainer: {
    width: '100%',
    height: 96,
    backgroundColor: Colors.grey[50],
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    marginBottom: 18,
  },

  /**
   * 정보 카드 라벨
   * - 12px Bold, #999
   */
  infoLabel: {
    ...Typography.body.body7, // 12px Regular
    fontWeight: '700' as const,
    color: Colors.grey[600],
    textAlign: 'center' as const,
  },

  /**
   * 정보 카드 값
   * - 22px Bold, #4b4b4b
   */
  infoValue: {
    fontFamily: Typography.caption.caption2.fontFamily,
    fontSize: 22,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: 0.0703125,
    color: Colors.grey[900],
    textAlign: 'center' as const,
  },

  /**
   * 버튼 컨테이너
   */
  buttonContainer: {
    width: '100%',
  },
});
