/**
 * components/timecapsule-create/components/submit-complete-modal/styles.ts
 * 타임캡슐 완료 모달 스타일
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
   * - 24px Bold
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
   * 부제목
   * - 제목과 동일한 스타일
   */
  subtitle: {
    fontFamily: Typography.caption.caption2.fontFamily,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: 0.0703125,
    color: Colors.black[500],
    textAlign: 'center' as const,
    marginTop: 18,
  },

  /**
   * 정보 카드 컨테이너
   * - 168px 높이, #f5f5f5 배경, border #e5e5e5
   */
  infoCardContainer: {
    width: '100%',
    height: 168,
    backgroundColor: Colors.grey[50],
    borderRadius: 20,
    borderWidth: 1.838,
    borderColor: Colors.whiteGrey[500],
    padding: 17,
    marginBottom: 18,
  },

  /**
   * 정보 카드 내부 - 캡슐 이름
   */
  capsuleNameContainer: {
    borderBottomWidth: 0.613,
    borderBottomColor: Colors.whiteGrey[400],
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
    color: Colors.grey[600],
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
    backgroundColor: Colors.whiteGrey[500],
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },

  dDayText: {
    ...Typography.header.h3, // 14px Bold
    color: Colors.black[500],
  },

  /**
   * 구분선
   */
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.whiteGrey[500],
    marginBottom: 12,
  },

  /**
   * 버튼 컨테이너
   */
  buttonContainer: {
    width: '100%',
  },

  /**
   * D-Day와 날짜를 포함하는 컨테이너
   */
  dateValueContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
});
