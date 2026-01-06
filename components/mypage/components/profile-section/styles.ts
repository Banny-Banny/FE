/**
 * components/mypage/components/profile-section/styles.ts
 * 프로필 섹션 스타일 정의
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 메인 컨테이너 (Vertical container)
  container: {
    width: 'auto',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Switch container (프로필 이미지/스위치 영역)
  switchContainer: {
    width: 120,
    height: 120,
    marginBottom: 16, // Button과의 간격 (Figma: 6344.09 - 6208.10 - 120 = 15.99 ≈ 16)
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  // Switch container 내부 (배경 원형)
  switchInnerContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: Colors.whiteGrey[500],
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Switch (이모지가 들어있는 원형)
  switch: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 이모지 텍스트
  switchEmoji: {
    ...Typography.body.body4,
    fontSize: 60,
    lineHeight: 60,
    color: Colors.black[500],
  },

  // 작은 원형 버튼 wrapper (flexbox로 우측 하단 배치)
  smallButtonWrapper: {
    width: 120,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 5, // Figma: 오른쪽 여백
    paddingBottom: 5, // Figma: 아래 여백
  },

  // 작은 원형 버튼
  smallButton: {
    width: 36,
    height: 36,
    backgroundColor: Colors.black[500],
    borderWidth: 1,
    borderColor: Colors.white[500],
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 작은 버튼 내부 (빈 View)
  smallButtonInner: {
    width: 20,
    height: 20,
  },

  // Button (토끼유저 텍스트)
  buttonContainer: {
    width: 'auto',
    height: 26,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 4, // Figma: Text input과의 간격
  },

  buttonText: {
    ...Typography.header.h1,
    color: Colors.black[500],
  },

  // Text input (이메일)
  textInputContainer: {
    width: 'auto',
    maxWidth: '90%', // 화면 너비의 90%를 넘지 않도록
    height: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  textInputText: {
    ...Typography.body.body6,
    color: Colors.darkGrey[400],
  },

  // 프로필 이미지 스타일
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 9999,
  },

  // 로딩 인디케이터
  loadingIndicator: {
    color: Colors.black[500],
  },

  // 에러 메시지
  errorText: {
    ...Typography.body.body4,
    color: Colors.red[500],
    textAlign: 'center',
    padding: 16,
  },
});
