/**
 * components/mypage/components/profile-edit/styles.ts
 * 프로필 편집 모달 스타일 정의
 *
 * 프롬프트: prompt.101.ui.txt
 * Figma 노드 ID: 1013-2463
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 * - [✓] Spacing 토큰 활용 (가능한 경우)
 * - [✓] BorderRadius 토큰 활용 (가능한 경우)
 * - [✓] 소수점 값 반올림 (모든 수치 정수)
 * - [✓] flexbox만 사용 (position-absolute 금지)
 * - [✓] 애니메이션 추가 없음
 *
 * 공통 컴포넌트 재검토 (recheck.201.optional.ui.component):
 * - [✓] DualButton 컴포넌트 사용: 취소/저장 버튼에 사용
 * - [✓] "사진 변경" 버튼: 특수 스타일(84x36, 회색 배경)이 필요하여 독립 구현
 *   - Button 컴포넌트는 최소 48px 높이(size="S")만 지원하여 36px 높이 구현 불가
 *   - Button 컴포넌트에 회색 배경 variant가 없음
 *   - 프로필 편집 전용 UI이므로 독립적으로 구현하되, 향후 공통화 가능하도록 구조 유지
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 메인 컨테이너 (Modal 공통 컴포넌트가 컨테이너 스타일을 제공하므로 내부 컨텐츠만 스타일링)
  container: {
    paddingVertical: Spacing.lg, // 24px
    paddingHorizontal: Spacing.lg, // 24px
    flexDirection: 'column',
    gap: Spacing.lg, // 24px
    alignItems: 'flex-start',
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
    gap: 12, // Spacing 토큰에 없음 (Figma 디자인 요구사항)
    alignItems: 'center',
  },

  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full, // 9999
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
    borderRadius: BorderRadius.full, // 9999
  },

  profileEmoji: {
    fontSize: 48,
    lineHeight: 48,
    color: Colors.black[500],
  },

  changePhotoButton: {
    width: 84,
    height: 36,
    borderRadius: 28, // BorderRadius 토큰에 없음 (Figma 디자인 요구사항)
    backgroundColor: Colors.grey[700],
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
    gap: Spacing.sm, // 8px
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
    borderColor: Colors.border.light, // rgba(10,10,10,0.08)
    borderRadius: 28, // BorderRadius 토큰에 없음 (Figma 디자인 요구사항)
    paddingHorizontal: Spacing.md, // 16px
    paddingVertical: 12, // Spacing 토큰에 없음 (Figma 디자인 요구사항)
    justifyContent: 'center',
  },

  input: {
    ...Typography.body.body4,
    color: Colors.black[500],
    padding: 0,
  },
});
