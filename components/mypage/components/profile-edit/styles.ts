/**
 * components/mypage/components/profile-edit/styles.ts
 * 프로필 편집 모달 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 *
 * Figma 노드 ID: 161:24223
 * 생성 시각: 2025-01-XX
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    width: 340,
    paddingVertical: 24,
    paddingHorizontal: 24,
    flexDirection: 'column',
    gap: 24,
    alignItems: 'flex-start',
    backgroundColor: Colors.white[500],
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.black[100],
  },

  // 제목 컨테이너
  titleContainer: {
    height: 22,
    width: 290,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText: {
    ...Typography.header.h2,
    color: Colors.black[500],
    textAlign: 'center',
  },

  // 프로필 이미지 영역
  profileImageContainer: {
    height: 148,
    width: 290,
    flexDirection: 'column',
    gap: 12,
    alignItems: 'center',
  },

  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 9999,
    backgroundColor: Colors.whiteGrey[500],
    borderWidth: 2,
    borderColor: Colors.grey[300],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 9999,
  },

  profileEmoji: {
    fontSize: 48,
    lineHeight: 48,
    color: Colors.black[500],
  },

  changePhotoButton: {
    width: 84,
    height: 36,
    borderRadius: 28,
    backgroundColor: Colors.grey[700], // #7e7e7e
    justifyContent: 'center',
    alignItems: 'center',
  },

  changePhotoText: {
    ...Typography.body.body6,
    color: Colors.white[500],
    textAlign: 'center',
  },

  // 닉네임 입력 영역
  nicknameContainer: {
    height: 78,
    width: 290,
    flexDirection: 'column',
    gap: 8,
    alignItems: 'flex-start',
  },

  labelText: {
    ...Typography.body.body6,
    color: Colors.black[500],
    height: 20,
  },

  inputWrapper: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: Colors.black[100], // rgba(10,10,10,0.12)에 해당하는 토큰
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },

  input: {
    ...Typography.body.body4,
    color: Colors.black[500],
    padding: 0,
  },
});
