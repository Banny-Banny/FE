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
    height: '100%',
    position: 'relative',
  },

  // ScrollView 컨테이너
  scrollView: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
  },

  // ScrollView 컨텐츠
  scrollContent: {
    flexGrow: 1,
    width: '100%',
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

  // 컨텐츠 래퍼
  contentWrapper: {
    width: '100%',
    minHeight: 517, // Figma: 517px
  },

  // 상단 섹션 (아이콘, 제목, 위치)
  // Figma: paddingTop 68.455px → 68px, paddingBottom 15.99px → 16px, paddingHorizontal 0, gap 27.552px → 28px
  topSection: {
    width: '100%',
    paddingTop: 68, // 반올림: 68.455 → 68
    paddingBottom: 16, // 반올림: 15.99 → 16
    paddingHorizontal: 0,
    alignItems: 'center',
    gap: 28, // 반올림: 27.552 → 28
  },

  // 하단 섹션 (메시지 카드, 작성자 카드)
  // Figma: paddingHorizontal 24px, gap 15.99px → 16px
  bottomSection: {
    width: '100%',
    paddingHorizontal: Spacing.lg, // 24px
    gap: 16, // 반올림: 15.99 → 16
    paddingBottom: 16,
  },

  // 상단 아이콘 컨테이너
  iconContainer: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconWrapper: {
    width: 52,
    height: 52,
  },

  iconImage: {
    width: 52,
    height: 52,
  },

  // 제목 "오늘의 행운"
  // Figma: fontSize 24, lineHeight 26.4 → 26, fontWeight ExtraBold, letterSpacing -0.4097 → 0
  // 가장 유사: header.h1 (fontSize 24, lineHeight 24, fontWeight bold, letterSpacing -0.3125)
  title: {
    ...Typography.header.h1,
    fontSize: 24,
    lineHeight: 26, // 반올림: 26.4 → 26
    fontWeight: '800', // ExtraBold
    letterSpacing: 0, // 반올림: -0.4097 → 0
    color: Colors.black[500], // #0A0A0A
    textAlign: 'center',
  },

  // 위치 정보 컨테이너
  // Figma: gap 7.986px → 8px, height 15.99px → 16px
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 반올림: 7.986 → 8
    height: 16, // 반올림: 15.99 → 16
  },

  // 위치 텍스트
  // Figma: fontSize 12, lineHeight 16, fontWeight Regular
  // 가장 유사: body7 (fontSize 12, lineHeight 16, fontWeight regular)
  locationText: {
    ...Typography.body.body7,
    color: Colors.grey[700], // #888
  },

  // 메시지 카드
  messageCard: {
    width: '100%',
    backgroundColor: Colors.white[500], // #FAFAFA
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.lg, // 16px
    paddingTop: 21, // 반올림: 21.111 → 21
    paddingBottom: 1, // 반올림: 1.111 → 1
    paddingHorizontal: 21, // 반올림: 21.111 → 21
    gap: 12, // 반올림: 11.997 → 12
    minHeight: 135, // 반올림: 134.948 → 135
  },

  // 메시지 헤더
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // 반올림: 11.997 → 12
    height: 32, // 반올림: 31.979 → 32
  },

  // 메시지 이모지
  // Figma: fontSize 24, lineHeight 32, fontWeight Regular, letterSpacing 0.0703 → 0
  messageEmoji: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0, // 반올림: 0.0703 → 0
  },

  // 메시지 라벨 "메시지"
  // Figma: fontSize 16, lineHeight 24, fontWeight SemiBold, letterSpacing -0.3125
  // 가장 유사: header.h4 (fontSize 16, lineHeight 24, fontWeight semibold, letterSpacing -0.3125)
  messageLabel: {
    ...Typography.header.h4,
    color: Colors.black[500], // #0A0A0A
  },

  // 메시지 텍스트
  // Figma: fontSize 15, lineHeight 24.375 → 24, fontWeight Regular, letterSpacing -0.2344 → 0
  // 가장 유사: body6 (fontSize 14, lineHeight 20, fontWeight regular, letterSpacing -0.150390625)
  // 하지만 fontSize가 15이므로 커스텀 적용
  messageText: {
    fontFamily: Typography.body.body6.fontFamily,
    fontSize: 15,
    lineHeight: 24, // 반올림: 24.375 → 24
    fontWeight: Typography.body.body6.fontWeight,
    letterSpacing: 0, // 반올림: -0.2344 → 0
    color: Colors.black[500], // #0A0A0A
  },

  // 작성자 정보 카드
  authorCard: {
    width: '100%',
    backgroundColor: Colors.whiteGrey[200], // #F5F5F5
    borderWidth: 1,
    borderColor: Colors.border.lighter, // rgba(10,10,10,0.05)
    borderRadius: BorderRadius.lg, // 16px
    paddingTop: 17, // 반올림: 17.101 → 17
    paddingBottom: 1, // 반올림: 1.111 → 1
    paddingHorizontal: 17, // 반올림: 17.101 → 17
    gap: 8, // 반올림: 7.986 → 8
    minHeight: 82, // 반올림: 82.153 → 82
  },

  // 작성자 헤더
  authorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 반올림: 7.986 → 8
    height: 20, // 반올림: 19.983 → 20
  },

  // 작성자 라벨 "김민수님이 숨긴 알"
  // Figma: fontSize 14, lineHeight 20, fontWeight SemiBold, letterSpacing -0.1504
  // 가장 유사: body11 (fontSize 14, lineHeight 20, fontWeight semibold, letterSpacing -0.150390625)
  authorLabel: {
    ...Typography.body.body11,
    color: Colors.black[500], // #0A0A0A
  },

  // 날짜 텍스트
  // Figma: fontSize 12, lineHeight 16, fontWeight Regular
  // 가장 유사: body7 (fontSize 12, lineHeight 16, fontWeight regular)
  dateText: {
    ...Typography.body.body7,
    color: Colors.grey[700], // #888
  },

  // 방문자 정보 카드 (내가 심은 알일 때만 표시)
  viewerCard: {
    width: '100%',
    backgroundColor: Colors.whiteGrey[200], // #F5F5F5
    borderWidth: 1,
    borderColor: Colors.border.lighter, // rgba(10,10,10,0.05)
    borderRadius: BorderRadius.lg, // 16px
    paddingTop: 17, // 반올림: 17.101 → 17
    paddingBottom: 1, // 반올림: 1.111 → 1
    paddingHorizontal: 17, // 반올림: 17.101 → 17
    gap: 8, // 반올림: 7.986 → 8
    minHeight: 82, // 반올림: 82.153 → 82
  },

  // 방문자 헤더
  viewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 반올림: 7.986 → 8
    height: 20, // 반올림: 19.983 → 20
  },

  // 방문자 라벨 "발견한 사람 (3명)"
  // Figma: fontSize 14, lineHeight 20, fontWeight SemiBold, letterSpacing -0.1504
  // 가장 유사: body11 (fontSize 14, lineHeight 20, fontWeight semibold, letterSpacing -0.150390625)
  viewerLabel: {
    ...Typography.body.body11,
    color: Colors.black[500], // #0A0A0A
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

  // 미디어 컨테이너
  mediaContainer: {
    width: '100%',
    gap: Spacing.md, // 16px
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
});
