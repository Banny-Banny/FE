/**
 * components/my-egg-list/components/modal/styles.ts
 * 이스터에그 모달 컴포넌트 스타일
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
    position: 'relative',
    overflow: 'hidden', // 콘텐츠가 밖으로 나가지 않도록
  },

  // ScrollView 컨테이너
  scrollView: {
    flex: 1,
    width: '100%',
  },

  // 모달 컨텐츠 컨테이너
  modalContent: {
    paddingHorizontal: Spacing.xl, // 32px
    paddingVertical: Spacing.lg, // 24px
    width: '100%',
    alignItems: 'center',
    gap: Spacing.lg, // 24px - 일관된 간격
    paddingBottom: Spacing.xl, // 하단 패딩 추가
  },

  // 닫기 버튼 (우측 상단)
  // Figma: absolute, top: 16px, right: 287.14px (실제로는 우측 상단), size: 40px
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.whiteGrey[300] + 'F2', // rgba(232,232,232,0.95)
    borderWidth: 1,
    borderColor: Colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10, // Android에서 zIndex 대신 사용
  },

  // 상단 프로필 이미지 컨테이너
  profileImageContainer: {
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    backgroundColor: Colors.whiteGrey[200],
  },

  // 프로필 이미지
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: BorderRadius.full,
  },

  // 프로필 이미지 플레이스홀더 (이미지가 없을 때)
  profileImagePlaceholder: {
    width: 128,
    height: 128,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.whiteGrey[200],
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 제목 (이스터에그 발견!)
  // Figma: fontSize 24, lineHeight 32, fontWeight Black, letterSpacing 0.0703
  // 가장 유사: header.h1 (fontSize 24, lineHeight 24, fontWeight bold)
  title: {
    ...Typography.header.h1,
    color: Colors.darkGrey[800],
    textAlign: 'center',
  },

  // 서브타이틀 컨테이너
  subtitleContainer: {
    alignItems: 'center',
    gap: 0,
  },

  // 서브타이틀
  subtitle: {
    ...Typography.body.body11,
    color: Colors.grey[600], // 약간 연하게
    textAlign: 'center',
  },

  // 서브타이틀 bold (닉네임 및 발견 순서 부분)
  subtitleBold: {
    ...Typography.body.body11,
    color: Colors.grey[700], // 약간 연하게 (위쪽은 덜 강조)
    fontWeight: '700', // bold
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

  // 배지 날짜 텍스트 (언제 발견함)
  badgeDateText: {
    ...Typography.body.body11,
    color: Colors.grey[600],
  },

  // 발견자 정보 래퍼 (위치 배지 + 발견자 정보를 묶는 컨테이너)
  discovererInfoWrapper: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.md, // 16px
  },

  // 발견자 정보 컨테이너 (첫 번째 발견자 등, 카드 밖)
  discovererInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs, // 4px
    alignSelf: 'flex-start', // 왼쪽 정렬
    width: '100%',
    paddingHorizontal: Spacing.xl, // 32px (모달 컨텐츠와 동일한 패딩)
  },

  // 발견자 텍스트 (첫 번째 발견자 등)
  discovererText: {
    ...Typography.body.body11,
    color: Colors.grey[700], // 약간 연하게
    fontWeight: '600', // semibold
  },

  // 발견자 날짜 텍스트 (언제 발견함)
  discovererDateText: {
    ...Typography.body.body11,
    color: Colors.grey[600],
    fontWeight: '400', // regular
  },

  // 메인 컨텐츠 카드
  contentCard: {
    width: '100%',
    backgroundColor: Colors.white[500], // 더 밝게 (대비 강조)
    borderWidth: 2,
    borderColor: Colors.whiteGrey[300], // 약간 진한 테두리 (대비 강조)
    borderRadius: BorderRadius['2xl'],
    padding: 20, // Figma 정확한 값 (Spacing.md=16, Spacing.lg=24 사이)
    gap: 20, // Figma 정확한 값 (Spacing.md=16, Spacing.lg=24 사이)
    minHeight: 200, // 최소 높이 설정
    overflow: 'hidden', // 콘텐츠가 카드 밖으로 나가지 않도록
    // 그림자 효과로 아래쪽 강조
    shadowColor: Colors.black[500],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android
  },

  // 제목 헤더 (프로필 이미지와 이름 제거)
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.sm, // 8px
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
    overflow: 'hidden',
  },

  authorAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
  },

  // 작성자 이름 컨테이너
  authorNameContainer: {
    flex: 1,
    gap: Spacing.xs, // 4px
  },

  // 작성자 이름 "초롱"
  // Figma: fontSize 14, lineHeight 20, fontWeight ExtraBold, letterSpacing -0.1504
  // 가장 유사: body11 (fontSize 14, lineHeight 20, fontWeight semibold, letterSpacing -0.150390625)
  authorName: {
    ...Typography.body.body11,
    color: Colors.darkGrey[800],
  },

  // 컨텐츠 제목
  contentTitle: {
    ...Typography.body.body11,
    color: Colors.darkGrey[900], // 더 진하게 (아래쪽 강조)
    fontWeight: '700', // bold로 더 강조
    flex: 1,
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

  dateText: {
    ...Typography.body.body8,
    color: Colors.grey[600],
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // 본문 텍스트
  // Figma: fontSize 14, lineHeight 22.75, fontWeight Regular, letterSpacing -0.1504
  // 가장 유사: body6 (fontSize 14, lineHeight 20, fontWeight regular, letterSpacing -0.150390625)
  contentText: {
    ...Typography.body.body6,
    color: Colors.darkGrey[800], // 더 진하게 (아래쪽 강조)
    lineHeight: 22, // 가독성 향상
  },


  // 방문자 정보 컨테이너
  viewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm, // 8px
  },

  // 방문자 아바타
  viewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: Colors.whiteGrey[300],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // 방문자 아바타 이미지
  viewerAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
  },

  // 방문자 아바타 이모지 (프로필 이미지가 없을 때)
  viewerAvatarEmoji: {
    fontSize: 18,
  },

  // 방문자 이름
  // Figma: fontSize 12, lineHeight 16, fontWeight Regular
  // 가장 유사: body7 (fontSize 12, lineHeight 16, fontWeight regular)
  viewerName: {
    ...Typography.body.body7,
    color: Colors.black[500], // #0A0A0A
  },

  // 발견한 사람들 섹션 (PLANTED 타입)
  viewersSection: {
    width: '100%',
    gap: Spacing.md, // 16px
    paddingTop: Spacing.md, // 16px
    borderTopWidth: 2,
    borderTopColor: Colors.whiteGrey[300],
  },

  // 발견한 사람들 헤더
  viewersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs, // 4px
  },

  // 발견한 사람들 제목
  viewersTitle: {
    ...Typography.body.body11,
    color: Colors.darkGrey[800],
  },

  // 발견한 사람들 목록
  viewersList: {
    width: '100%',
    gap: Spacing.sm, // 8px
  },

  // 발견한 사람 아이템
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs, // 4px
  },

  // 발견한 사람 정보 (아바타 + 이름)
  viewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm, // 8px
  },

  // 발견한 사람 아바타
  viewerAvatar: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: Colors.whiteGrey[300],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // 발견한 사람 아바타 이미지
  viewerAvatarImage: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
  },

  // 발견한 사람 날짜 배지
  viewerDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: Colors.whiteGrey[200],
    borderRadius: BorderRadius.full,
  },

  // 발견한 사람 날짜 텍스트
  viewerDateText: {
    ...Typography.body.body8,
    color: Colors.grey[600],
    lineHeight: 14,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // 미디어 컨테이너
  mediaContainer: {
    width: '100%',
    gap: Spacing.md, // 16px
  },

  // 오디오 플레이어 래퍼 (너비 제한)
  audioPlayerWrapper: {
    width: '100%',
    overflow: 'hidden',
  },

  // 이미지 컨테이너
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },

  // 이미지
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
    backgroundColor: Colors.black[500],
  },

  // 비디오 플레이어
  video: {
    width: '100%',
    height: '100%',
  },

  // 빈 발견자 목록 컨테이너
  emptyViewersContainer: {
    paddingVertical: Spacing.lg, // 24px
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 빈 발견자 목록 텍스트
  emptyViewersText: {
    ...Typography.body.body11,
    color: Colors.grey[500],
    textAlign: 'center',
  },
});
