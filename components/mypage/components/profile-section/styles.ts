/**
 * components/mypage/components/profile-section/styles.ts
 * 프로필 섹션 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 *
 * Figma 노드 ID: 161:24077
 * 생성 시각: 2025-01-XX
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 메인 컨테이너 (Vertical container)
  container: {
    width: 'auto',
    height: 250.35,
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
    paddingRight: 4.99, // Figma: 오른쪽 여백
    paddingBottom: 4.99, // Figma: 아래 여백
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
    height: 26.39,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 3.99, // Figma: Text input과의 간격
  },

  buttonText: {
    ...Typography.header.h1,
    color: Colors.black[500],
  },

  // Text input (이메일)
  textInputContainer: {
    width: 139.48,
    height: 19.98,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  textInputText: {
    ...Typography.body.body6,
    color: Colors.darkGrey[400],
  },
});
