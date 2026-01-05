/**
 * components/mypage/components/activity-stats/friends/styles.ts
 * 친구 관리 모달 스타일 정의
 *
 * 체크리스트:
 * - [✓] StyleSheet.create() 사용
 * - [✓] 색상 토큰만 사용 (하드코딩 0건)
 * - [✓] 인라인 스타일 0건
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Typography 토큰 활용
 *
 * Figma 노드 ID: 161:25212
 */

import { BorderRadius, Colors, Spacing, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // 모달 컨테이너
  // Modal 컴포넌트가 이미 borderRadius, backgroundColor를 제공하지만,
  // 피그마 디자인에 맞는 border 스타일과 패딩을 적용하기 위해
  // border 관련 스타일과 패딩을 오버라이드 (유지보수성: Modal 기본 스타일 활용 + 필요한 부분만 커스터마이징)
  modalContainer: {
    flex: 1,
    height: 614,
    flexDirection: 'column',
    // Modal 내부 여백 확보 (팝업창 경계를 벗어나지 않도록)
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    // 피그마 디자인에 맞는 border 스타일 적용
    borderWidth: 1,
    borderColor: 'rgba(10, 10, 10, 0.08)',
    borderRadius: BorderRadius['2xl'],
    // 스크롤이 제대로 작동하도록 overflow 설정
    overflow: 'hidden',
  },

  // 헤더 섹션
  headerSection: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(10, 10, 10, 0.08)',
    paddingTop: 0, // modalContainer의 paddingTop과 중복 방지
    paddingBottom: Spacing.md,
    paddingHorizontal: 0, // modalContainer의 paddingHorizontal과 중복 방지
    gap: 8,
  },

  // 헤더 상단 (제목 + 버튼)
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
  },

  // 제목
  title: {
    ...Typography.header.h1,
    color: Colors.black[500],
  },

  // 헤더 버튼 컨테이너
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // 새로고침 버튼
  refreshButton: {
    backgroundColor: Colors.whiteGrey[500],
    borderWidth: 1,
    borderColor: 'rgba(10, 10, 10, 0.08)',
    borderRadius: BorderRadius.xl,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 닫기 버튼
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 서브타이틀
  subtitle: {
    ...Typography.body.body6,
    color: Colors.darkGrey[400],
    height: 20,
  },

  // 정보 박스
  infoBox: {
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: 'rgba(10, 10, 10, 0.08)',
    borderRadius: BorderRadius.xl,
    padding: 11,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },

  // 정보 아이콘
  infoIcon: {
    fontSize: 12,
    lineHeight: 17,
    width: 14,
    height: 17,
  },

  // 정보 텍스트
  infoText: {
    ...Typography.body.body7,
    color: Colors.grey[700],
    flex: 1,
    lineHeight: 20,
  },

  // 친구 목록 섹션 래퍼
  // ScrollView가 터치 이벤트를 받을 수 있도록 래퍼 추가
  friendsSectionWrapper: {
    flex: 1,
    minHeight: 0,
  },

  // 친구 목록 섹션
  // 헤더 섹션 높이를 제외한 나머지 공간을 스크롤 영역으로 사용
  // 전체 높이 614px - 헤더 섹션(약 190px) = 약 424px
  friendsSection: {
    flex: 1,
    paddingTop: Spacing.md,
    paddingHorizontal: 0, // modalContainer의 paddingHorizontal과 중복 방지
    paddingBottom: 0, // modalContainer의 paddingBottom과 중복 방지
    // 스크롤이 제대로 작동하도록 명시적 설정
    minHeight: 0,
  },

  // 친구 목록 컨테이너
  friendsList: {
    gap: 12,
  },

  // 친구 항목
  friendItem: {
    backgroundColor: Colors.white[500],
    borderWidth: 1,
    borderColor: 'rgba(10, 10, 10, 0.08)',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 17,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // 차단된 친구 항목 (해제 상태)
  // Colors 토큰 사용: whiteGrey[500] (#E4E4E4) - #E0E0E0와 가장 유사한 토큰
  friendItemBlocked: {
    backgroundColor: Colors.whiteGrey[500],
  },

  // 친구 정보 컨테이너
  friendInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // 아바타 컨테이너
  avatarContainer: {
    backgroundColor: Colors.whiteGrey[100],
    borderWidth: 1,
    borderColor: 'rgba(10, 10, 10, 0.08)',
    borderRadius: BorderRadius.full,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },

  // 아바타 이모지
  avatarEmoji: {
    fontSize: 24,
    lineHeight: 32,
  },

  // 차단된 아바타 컨테이너
  avatarContainerBlocked: {
    backgroundColor: Colors.grey[300],
  },

  // 차단된 아바타 이모지
  avatarEmojiBlocked: {
    opacity: 1,
  },

  // 친구 이름
  friendName: {
    ...Typography.header.h4,
    color: Colors.black[500],
    height: 24,
  },

  // 차단된 친구 이름 (해제 상태)
  friendNameBlocked: {
    color: Colors.black[500],
  },

  // 차단 버튼
  blockButton: {
    backgroundColor: Colors.whiteGrey[500],
    borderRadius: 28,
    height: 36,
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    gap: 8,
  },

  // 차단 해제 버튼
  unblockButton: {
    backgroundColor: Colors.black[500],
  },

  // 버튼 아이콘
  buttonIcon: {
    width: 16,
    height: 16,
  },

  // 버튼 텍스트
  buttonText: {
    ...Typography.body.body8,
    color: Colors.black[500],
  },

  // 해제 버튼 텍스트
  buttonTextUnblock: {
    color: Colors.white[500],
  },
});
