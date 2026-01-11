/**
 * UnlockedCapsuleDetail 컴포넌트 스타일
 * 피그마 디자인 1:1 매칭 (node-id=1078:3466)
 *
 * @description
 * - 모든 색상은 commons/constants/color.ts의 Colors 사용
 * - 모든 타이포그래피는 commons/constants/typography.ts의 Typography 사용
 * - 모든 간격은 commons/constants/spacing.ts의 Spacing 사용
 * - 모든 border radius는 commons/constants/borderRadius.ts의 BorderRadius 사용
 */

import { StyleSheet } from 'react-native';
import { Colors } from '@/commons/constants/color';
import { Typography } from '@/commons/constants/typography';
import { BorderRadius } from '@/commons/constants/borderRadius';

/**
 * 피그마 디자인 값 (정확한 픽셀 값)
 */
const FIGMA_VALUES = {
  // 모달 컨테이너
  modalWidth: 345.347,
  modalHeight: 724.375,
  modalLeft: 23.99,
  modalTop: 63.92,
  modalBorderRadius: 24,

  // 헤더 섹션
  headerHeight: 164.826,
  headerPaddingTop: 23.993,
  headerPaddingHorizontal: 15.99,
  headerPaddingBottom: 1.111,
  headerGap: 15.99,

  // 제목
  titleFontSize: 18,
  titleLineHeight: 19.8,
  titleLetterSpacing: -0.7995,

  // 사용자 아바타
  userAvatarSize: 55.99,
  userAvatarBorderWidth: 1.111,
  userAvatarGap: 15.99,
  userAvatarNameGap: 7.986,
  userAvatarNameFontSize: 12,
  userAvatarNameLineHeight: 16,
  userAvatarEmojiSize: 24,

  // 컨텐츠 섹션
  contentPaddingTop: 15.99,
  contentPaddingHorizontal: 15.99,
  contentGap: 23.993,

  // 텍스트 메시지
  textMessageGap: 11.997,
  textMessagePadding: 17.101,
  textMessageBorderRadius: 16,
  textMessageFontSize: 14,
  textMessageLineHeight: 22.75,
  textMessageLetterSpacing: -0.1504,

  // 이미지
  imageHeight: 311.146,
  imageBorderRadius: 16,
  imageIndicatorWidth: 41.406,
  imageIndicatorHeight: 23.976,
  imageIndicatorPaddingHorizontal: 12,
  imageIndicatorPaddingVertical: 5.1,
  imageIndicatorTop: 12,
  imageIndicatorRight: 12,
  imageIndicatorFontSize: 12,
  imageIndicatorLineHeight: 16,
  paginationGap: 7.986,
  paginationDotSize: 7.986,
  paginationDotActiveWidth: 23.993,

  // 비디오
  videoHeight: 175.017,
  videoBorderRadius: 16,
  playButtonSize: 63.993,
  playButtonIconSize: 23.993,

  // 닫기 버튼
  closeButtonSize: 40,
  closeButtonTop: 15.99,
  closeButtonRight: 287.14,
  closeButtonIconSize: 20,
} as const;

export const styles = StyleSheet.create({
  // 모달 컨테이너
  // 공통 Modal 컴포넌트가 오버레이와 컨테이너를 관리하므로
  // 여기서는 내부 컨텐츠 스타일만 정의
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.white[500], // #FAFAFA
    borderRadius: FIGMA_VALUES.modalBorderRadius,
    borderWidth: 1,
    borderColor: Colors.border.light, // rgba(10, 10, 10, 0.08)
    overflow: 'hidden',
  },

  // 닫기 버튼
  closeButton: {
    position: 'absolute',
    top: FIGMA_VALUES.closeButtonTop,
    right: 15.99, // 모달 컨테이너 오른쪽에서 15.99px 떨어진 위치
    width: FIGMA_VALUES.closeButtonSize,
    height: FIGMA_VALUES.closeButtonSize,
    backgroundColor: Colors.whiteGrey[400], // #E9E9E9 → #E8E8E8에 가장 가까움
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: Colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1.111,
    zIndex: 10,
  },


  // 헤더 섹션
  headerSection: {
    width: '100%',
    height: FIGMA_VALUES.headerHeight,
    paddingTop: FIGMA_VALUES.headerPaddingTop,
    paddingHorizontal: FIGMA_VALUES.headerPaddingHorizontal,
    paddingBottom: FIGMA_VALUES.headerPaddingBottom,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    gap: FIGMA_VALUES.headerGap,
  },

  // 제목 컨테이너
  titleContainer: {
    width: '100%',
    height: 19.792,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    ...Typography.header.h3,
    fontSize: FIGMA_VALUES.titleFontSize,
    lineHeight: FIGMA_VALUES.titleLineHeight,
    letterSpacing: FIGMA_VALUES.titleLetterSpacing,
    color: Colors.black[500], // #0A0A0A
    textAlign: 'center',
    fontWeight: '800', // ExtraBold
  },

  // 사용자 아바타 섹션
  userAvatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: FIGMA_VALUES.userAvatarGap,
    height: 87.951,
  },

  userAvatarWrapper: {
    width: 60,
    height: 79.965,
  },

  userAvatarContainer: {
    width: '100%',
    height: '100%',
    gap: FIGMA_VALUES.userAvatarNameGap,
    alignItems: 'center',
  },

  // 선택된 사용자 아바타 테두리
  userAvatarBorderSelected: {
    width: FIGMA_VALUES.userAvatarSize,
    height: FIGMA_VALUES.userAvatarSize,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white[500],
    borderWidth: FIGMA_VALUES.userAvatarBorderWidth,
    borderColor: Colors.black[500], // #0A0A0A
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 1.111,
    paddingRight: 1.128,
    paddingVertical: 1.111,
  },

  // 일반 사용자 아바타 테두리
  userAvatarBorder: {
    width: FIGMA_VALUES.userAvatarSize,
    height: FIGMA_VALUES.userAvatarSize,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white[500],
    borderWidth: FIGMA_VALUES.userAvatarBorderWidth,
    borderColor: Colors.border.light, // rgba(10, 10, 10, 0.08)
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 1.111,
    paddingRight: 1.128,
    paddingVertical: 1.111,
  },

  userAvatarInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  userAvatarEmoji: {
    fontSize: FIGMA_VALUES.userAvatarEmojiSize,
    lineHeight: 31.979,
    textAlign: 'center',
  },

  // 선택된 사용자 이름
  userAvatarNameSelected: {
    ...Typography.body.body3,
    fontSize: FIGMA_VALUES.userAvatarNameFontSize,
    lineHeight: FIGMA_VALUES.userAvatarNameLineHeight,
    color: Colors.black[500], // #0A0A0A
    textAlign: 'center',
    fontWeight: '700', // Bold
  },

  // 일반 사용자 이름
  userAvatarName: {
    ...Typography.body.body9,
    fontSize: FIGMA_VALUES.userAvatarNameFontSize,
    lineHeight: FIGMA_VALUES.userAvatarNameLineHeight,
    color: Colors.grey[600], // #888 → #A2A2A2에 가장 가까움
    textAlign: 'center',
  },

  // 컨텐츠 섹션
  contentSection: {
    flex: 1,
    paddingTop: FIGMA_VALUES.contentPaddingTop,
    paddingHorizontal: FIGMA_VALUES.contentPaddingHorizontal,
  },

  // 컨텐츠 스크롤 컨테이너
  contentScrollContainer: {
    paddingBottom: FIGMA_VALUES.contentPaddingTop,
  },

  // 텍스트 메시지 컨테이너 (메시지 1개만)
  textMessagesContainer: {
    marginBottom: FIGMA_VALUES.contentGap,
  },

  textMessageCard: {
    backgroundColor: Colors.white[500], // #FAFAFA
    borderRadius: FIGMA_VALUES.textMessageBorderRadius,
    borderWidth: 1,
    borderColor: Colors.border.light,
    padding: FIGMA_VALUES.textMessagePadding,
    paddingBottom: 1.111,
  },

  textMessageText: {
    ...Typography.body.body6,
    fontSize: FIGMA_VALUES.textMessageFontSize,
    lineHeight: FIGMA_VALUES.textMessageLineHeight,
    letterSpacing: FIGMA_VALUES.textMessageLetterSpacing,
    color: Colors.black[500], // #0A0A0A
  },

  // 이미지 섹션
  imageSection: {
    marginBottom: FIGMA_VALUES.contentGap,
  },

  imageContainer: {
    width: '100%',
    height: FIGMA_VALUES.imageHeight,
    borderRadius: FIGMA_VALUES.imageBorderRadius,
    backgroundColor: Colors.whiteGrey[500],
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: 'hidden',
    marginBottom: FIGMA_VALUES.textMessageGap,
    position: 'relative',
  },

  imageScrollView: {
    width: '100%',
    height: '100%',
  },

  imageItem: {
    width: 313.367, // 모달 너비(345.347) - 좌우 패딩(15.99 * 2)
    height: '100%',
  },

  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.whiteGrey[500],
  },

  imageIndicator: {
    position: 'absolute',
    top: FIGMA_VALUES.imageIndicatorTop,
    right: FIGMA_VALUES.imageIndicatorRight,
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    borderRadius: BorderRadius.xl,
    paddingHorizontal: FIGMA_VALUES.imageIndicatorPaddingHorizontal,
    paddingVertical: FIGMA_VALUES.imageIndicatorPaddingVertical,
    minWidth: FIGMA_VALUES.imageIndicatorWidth,
    height: FIGMA_VALUES.imageIndicatorHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageIndicatorText: {
    ...Typography.body.body8,
    fontSize: FIGMA_VALUES.imageIndicatorFontSize,
    lineHeight: FIGMA_VALUES.imageIndicatorLineHeight,
    color: Colors.white[500], // #FAFAFA
    fontWeight: '600', // SemiBold
  },

  // 페이지네이션 인디케이터
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: FIGMA_VALUES.paginationGap,
    height: FIGMA_VALUES.paginationDotSize,
  },

  paginationDotActive: {
    width: FIGMA_VALUES.paginationDotActiveWidth,
    height: FIGMA_VALUES.paginationDotSize,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.black[500], // #0A0A0A
  },

  paginationDotInactive: {
    width: FIGMA_VALUES.paginationDotSize,
    height: FIGMA_VALUES.paginationDotSize,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.whiteGrey[600], // #E0E0E0 → #CFCFCF에 가장 가까움
  },

  // 비디오 섹션
  videoSection: {
    marginBottom: FIGMA_VALUES.contentGap,
  },

  videoContainer: {
    width: '100%',
    height: FIGMA_VALUES.videoHeight,
    borderRadius: FIGMA_VALUES.videoBorderRadius,
    backgroundColor: Colors.whiteGrey[500],
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: 'hidden',
  },

  videoThumbnail: {
    width: '100%',
    height: 172.795,
    backgroundColor: Colors.whiteGrey[500],
  },

  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playButton: {
    width: FIGMA_VALUES.playButtonSize,
    height: FIGMA_VALUES.playButtonSize,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3.993,
    paddingRight: 0,
  },

  playButtonIcon: {
    width: FIGMA_VALUES.playButtonIconSize,
    height: FIGMA_VALUES.playButtonIconSize,
  },

  // 오디오 섹션
  audioSection: {
    marginBottom: FIGMA_VALUES.contentGap,
  },

  audioCard: {
    backgroundColor: Colors.white[500],
    borderRadius: FIGMA_VALUES.textMessageBorderRadius,
    borderWidth: 1,
    borderColor: Colors.border.light,
    padding: FIGMA_VALUES.textMessagePadding,
    paddingBottom: 1.111,
  },

  audioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },

  audioIconContainer: {
    width: 20,
    height: 20,
    marginRight: 11.997,
  },

  audioIcon: {
    width: '100%',
    height: '100%',
  },

  audioTitleContainer: {
    flex: 1,
    marginRight: 11.997,
  },

  audioTitle: {
    ...Typography.body.body6,
    fontSize: FIGMA_VALUES.textMessageFontSize,
    lineHeight: 20,
    letterSpacing: FIGMA_VALUES.textMessageLetterSpacing,
    color: Colors.black[500],
  },

  audioPlayButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.black[500],
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 1.996,
  },

  audioPlayIcon: {
    width: 15.99,
    height: 15.99,
  },
});

