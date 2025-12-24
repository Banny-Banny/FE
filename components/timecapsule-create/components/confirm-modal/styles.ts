/**
 * components/timecapsule-create/components/confirm-modal/styles.ts
 * ConfirmModal 컴포넌트 스타일 정의
 *
 * @description
 * - 피그마 디자인 기준으로 스타일 정의
 * - Colors, Typography, MODAL_DESIGN constants 사용
 */

import { StyleSheet } from 'react-native';
import { Colors } from '@/commons/constants/color';
import { Typography } from '@/commons/constants/typography';
import { MODAL_DESIGN } from './constants';

export const styles = StyleSheet.create({
  /**
   * 모달 컨테이너
   * - 피그마: 상하 패딩 33px/24px, 좌우 패딩 26px
   */
  container: {
    paddingTop: MODAL_DESIGN.padding.vertical,
    paddingBottom: MODAL_DESIGN.padding.bottom,
    paddingHorizontal: MODAL_DESIGN.padding.horizontal,
    alignItems: 'center',
  },

  /**
   * 아이콘 컨테이너
   * - 피그마: 80x80 크기, 배경 #f5f5f5, border-radius 28px
   */
  iconContainer: {
    width: MODAL_DESIGN.iconContainerSize,
    height: MODAL_DESIGN.iconContainerSize,
    borderRadius: MODAL_DESIGN.iconBackgroundRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: MODAL_DESIGN.spacing.iconToTitle,
  },

  /**
   * 텍스트 영역
   * - 중앙 정렬
   */
  textContainer: {
    alignItems: 'center',
    marginBottom: MODAL_DESIGN.spacing.descriptionToContent,
  },

  /**
   * 제목 텍스트
   * - 피그마: Pretendard Bold, 20px, #1a1a1a
   * - Typography.header.h2 매칭 (16px) 대신 직접 정의 필요
   */
  title: {
    fontFamily: Typography.caption.caption2.fontFamily,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.8492,
    color: Colors.black[500], // 피그마: #1a1a1a
    textAlign: 'center' as const,
    marginBottom: MODAL_DESIGN.spacing.titleToDescription,
  },

  /**
   * 부제목 텍스트 (SUBMIT_COMPLETE에서 사용)
   * - 제목과 동일한 스타일
   */
  subtitle: {
    fontFamily: Typography.caption.caption2.fontFamily,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.8492,
    color: Colors.black[500],
    textAlign: 'center' as const,
  },

  /**
   * 설명 텍스트
   * - 피그마: Pretendard Bold, 16px, #666
   */
  description: {
    ...Typography.body.body4, // 16px Regular
    fontWeight: '700' as const, // Bold로 변경
    color: Colors.grey[800], // 피그마: #666 (grey[800]와 유사)
    textAlign: 'center' as const,
    marginTop: 4,
  },

  /**
   * 정보 카드 컨테이너 (SUBMIT_COMPLETE에서 사용)
   * - 피그마: 168px 높이, #f5f5f5 배경, border #e5e5e5
   */
  infoCardContainer: {
    width: '100%',
    height: MODAL_DESIGN.infoCard.height,
    backgroundColor: MODAL_DESIGN.infoCard.backgroundColor,
    borderRadius: MODAL_DESIGN.infoCard.borderRadius,
    borderWidth: MODAL_DESIGN.infoCard.borderWidth,
    borderColor: MODAL_DESIGN.infoCard.borderColor,
    padding: 17,
    marginBottom: MODAL_DESIGN.spacing.contentToButton,
  },

  /**
   * 정보 카드 내부 - 캡슐 이름
   */
  capsuleNameContainer: {
    borderBottomWidth: 0.613,
    borderBottomColor: Colors.whiteGrey[400], // 피그마: #e0e0e0
    paddingBottom: 12,
    marginBottom: 12,
  },

  capsuleName: {
    ...Typography.header.h1, // 24px Bold
    fontSize: 18,
    lineHeight: 36,
    letterSpacing: 0.3955,
    color: Colors.black[500],
    textAlign: 'center' as const,
  },

  /**
   * 정보 카드 내부 - 개봉일/참여자 정보 행
   */
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },

  infoItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  infoLabel: {
    ...Typography.body.body7, // 12px Regular
    color: Colors.grey[600], // 피그마: #999
    marginLeft: 8,
  },

  infoValue: {
    ...Typography.header.h3, // 14px Bold
    color: Colors.black[500],
  },

  /**
   * D-Day 배지
   */
  dDayBadge: {
    backgroundColor: Colors.whiteGrey[500], // 피그마: #e5e5e5
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },

  dDayText: {
    ...Typography.header.h3, // 14px Bold
    color: Colors.black[500],
  },

  /**
   * 구분선 (SUBMIT_COMPLETE에서 사용)
   */
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.whiteGrey[500], // 피그마: #e5e5e5
    marginBottom: 12,
  },

  /**
   * 버튼 컨테이너
   */
  buttonContainer: {
    width: '100%',
  },

  /**
   * 버튼 2개일 때 가로 배치
   */
  buttonRow: {
    flexDirection: 'row' as const,
    gap: MODAL_DESIGN.spacing.buttonGap,
  },

  /**
   * 버튼 기본 스타일
   * - 피그마: 높이 60px, border-radius 20px
   */
  button: {
    height: MODAL_DESIGN.button.height,
    borderRadius: MODAL_DESIGN.button.borderRadius,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  /**
   * Primary 버튼 (확인, 제출)
   * - 피그마: 배경 #0a0a0a (검정)
   */
  buttonPrimary: {
    backgroundColor: Colors.black[500], // 피그마: #0a0a0a
  },

  /**
   * Secondary 버튼 (취소)
   * - 피그마: 배경 #fafafa, border #e5e7eb
   */
  buttonSecondary: {
    backgroundColor: Colors.white[500], // 피그마: #fafafa
    borderWidth: 2,
    borderColor: Colors.whiteGrey[300], // 피그마: #e5e7eb
  },

  /**
   * 버튼 2개일 때 각 버튼 너비 (flex: 1)
   */
  buttonHalf: {
    flex: 1,
  },

  /**
   * 버튼 텍스트 기본
   * - 피그마: Pretendard Bold, 16px
   */
  buttonText: {
    ...Typography.caption.caption2, // 16px Bold
    fontWeight: '700' as const,
  },

  /**
   * Primary 버튼 텍스트 색상
   */
  buttonTextPrimary: {
    color: Colors.white[500], // 피그마: #fafafa
  },

  /**
   * Secondary 버튼 텍스트 색상
   */
  buttonTextSecondary: {
    color: Colors.black[500], // 피그마: #0a0a0a
  },
});
