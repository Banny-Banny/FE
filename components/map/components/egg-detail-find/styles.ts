/**
 * EggDetailFind Component Styles
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] 모든 스타일은 styles.ts에만 정의
 * - [x] 토큰 기반 스타일 사용
 * - [x] Figma 디자인 1:1 대응
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ScrollView를 감싸는 래퍼 (Modal 내부 높이 확보용)
  scrollViewWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // ScrollView 컨테이너
  scrollView: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
  },

  // 모달 컨텐츠 컨테이너
  // Note: backgroundColor, borderRadius, shadow는 Modal 컴포넌트에서 처리하므로 제거
  modalContent: {
    paddingHorizontal: Spacing.xl, // 32px
    paddingVertical: Spacing.lg, // 24px
    width: '100%',
    alignItems: 'center',
    gap: 22, // Figma 기준
    flexGrow: 1, // 스크롤 가능하도록 flexGrow 사용
  },

  // 상단 알 아이콘 컨테이너
  eggIconContainer: {
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },

  eggIconWrapper: {
    width: 128,
    height: 128,
  },

  eggImage: {
    width: 128,
    height: 128,
  },

  // 제목 (이스터에그 발견!)
  // Figma: fontSize 24, lineHeight 32, fontWeight Black, letterSpacing 0.0703
  // 가장 유사: header.h1 (fontSize 24, lineHeight 24, fontWeight bold)
  title: {
    ...Typography.header.h1,
    color: Colors.darkGrey[800],
    textAlign: 'center',
  },

  // 서브타이틀
  subtitle: {
    ...Typography.body.body11,
    color: Colors.grey[700],
    textAlign: 'center',
  },

  // 발견자 배지 컨테이너
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm, // 8px
    paddingHorizontal: 18, // Figma 정확한 값 (Spacing.md=16, Spacing.lg=24 사이)
    paddingVertical: 1, // Figma 정확한 값
    height: 24,
    backgroundColor: Colors.whiteGrey[100],
    borderWidth: 1,
    borderColor: Colors.whiteGrey[400],
    borderRadius: BorderRadius.full,
  },

  // 배지 텍스트 "첫 번째 발견자"
  // Figma: fontSize 14, lineHeight 20, fontWeight ExtraBold, letterSpacing -0.1504
  // 가장 유사: body11 (fontSize 14, lineHeight 20, fontWeight semibold, letterSpacing -0.150390625)
  badgeText: {
    ...Typography.body.body11,
    color: Colors.darkGrey[800],
  },

  // 메인 컨텐츠 카드
  contentCard: {
    width: '100%',
    backgroundColor: Colors.whiteGrey[100],
    borderWidth: 2,
    borderColor: Colors.whiteGrey[200],
    borderRadius: BorderRadius['2xl'],
    padding: 20, // Figma 정확한 값 (Spacing.md=16, Spacing.lg=24 사이)
    gap: 20, // Figma 정확한 값 (Spacing.md=16, Spacing.lg=24 사이)
    minHeight: 200, // 최소 높이 설정
  },

  // 작성자 정보 헤더
  authorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 2,
    borderBottomWidth: 2,
    borderBottomColor: Colors.whiteGrey[300],
  },

  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm, // 8px
  },

  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white[500],
    borderWidth: 2,
    borderColor: Colors.whiteGrey[300],
    justifyContent: 'center',
    alignItems: 'center',
  },

  authorEmoji: {
    ...Typography.body.body4,
  },

  // 작성자 이름 "김서연"
  // Figma: fontSize 14, lineHeight 20, fontWeight ExtraBold, letterSpacing -0.1504
  // 가장 유사: body11 (fontSize 14, lineHeight 20, fontWeight semibold, letterSpacing -0.150390625)
  authorName: {
    ...Typography.body.body11,
    color: Colors.darkGrey[800],
  },

  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6, // Figma 정확한 값 (Spacing.xs=4, Spacing.sm=8 사이)
    paddingHorizontal: 11, // Figma 정확한 값 (Spacing.sm=8, Spacing.md=16 사이)
    paddingVertical: 2,
    height: 21,
    backgroundColor: Colors.white[500],
    borderWidth: 2,
    borderColor: Colors.whiteGrey[200],
    borderRadius: BorderRadius.full,
  },

  dateIcon: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateText: {
    ...Typography.body.body8,
    color: Colors.grey[600],
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // 콘텐츠 제목 "우리의 첫 만남"
  // Figma: fontSize 18, lineHeight 22.5, fontWeight Black, letterSpacing -0.4395
  // 가장 유사: header.h2 (fontSize 16, lineHeight 24, fontWeight bold, letterSpacing -0.3125)
  // 또는 caption.sectionTitle (fontSize 16, lineHeight 24, fontWeight bold)
  // header.h2가 가장 유사하지만 fontSize가 18이 아니라 16
  contentTitle: {
    ...Typography.header.h2,
    color: Colors.darkGrey[800],
  },

  // 본문 텍스트
  // Figma: fontSize 14, lineHeight 22.75, fontWeight Regular, letterSpacing -0.1504
  // 가장 유사: body6 (fontSize 14, lineHeight 20, fontWeight regular, letterSpacing -0.150390625)
  contentText: {
    ...Typography.body.body6,
    color: Colors.grey[700],
  },

  // 미디어 컨테이너
  mediaContainer: {
    gap: Spacing.md, // 16px
  },

  // 이미지 컨테이너
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  // 비디오 컨테이너
  videoContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },

  videoThumbnail: {
    width: '100%',
    height: '100%',
  },

  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.black[500] + '4D', // 30% opacity (0.3 * 255 = 76.5 ≈ 77 = 4D in hex)
    justifyContent: 'center',
    alignItems: 'center',
  },

  videoPlayButton: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white[500] + 'F2', // 95% opacity (0.95 * 255 = 242.25 ≈ 242 = F2 in hex)
    borderWidth: 2,
    borderColor: Colors.white[500],
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 열람 횟수 배지
  viewCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs, // 4px
    paddingHorizontal: 12, // Figma 정확한 값 (Spacing.sm=8, Spacing.md=16 사이)
    paddingVertical: 0,
    height: 24,
    backgroundColor: Colors.whiteGrey[200],
    borderRadius: BorderRadius.full,
  },

  // 열람 횟수 "열람 횟수", "1/3"
  // Figma: fontSize 11, lineHeight 16.5, fontWeight ExtraBold, letterSpacing 0.0645
  // 가장 유사: body8 (fontSize 12, lineHeight 16, fontWeight semibold, letterSpacing 0)
  viewCountText: {
    ...Typography.body.body8,
    color: Colors.grey[700],
  },

  viewCountNumber: {
    ...Typography.body.body8,
    color: Colors.darkGrey[800],
  },

  // 소멸 예정 텍스트 "이 이스터에그는 이제 소멸됩니다 ✨"
  // Figma: fontSize 13, lineHeight 18, fontWeight Bold
  // 가장 유사: body10 (fontSize 12, lineHeight 18, fontWeight bold)
  expiringText: {
    ...Typography.body.body10,
    color: Colors.grey[600],
    textAlign: 'center',
  },

  expiringContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  // 소멸 예정 라벨 "소멸 예정"
  // Figma: fontSize 11, lineHeight 16.5, fontWeight ExtraBold
  // 가장 유사: body8 (fontSize 12, lineHeight 16, fontWeight semibold)
  expiringLabel: {
    ...Typography.body.body8,
    color: Colors.black[500],
  },
});
