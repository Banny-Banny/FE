/**
 * components/timecapsule-create/components/confirm-modal/constants.ts
 * ConfirmModal 컴포넌트의 constants 정의
 *
 * @description
 * - 3가지 모달 타입별 설정 정의 (PAYMENT_COMPLETE, SUBMIT_CONFIRM, SUBMIT_COMPLETE)
 * - 피그마 디자인 기준으로 텍스트, 아이콘, 크기, 색상 정의
 * - 공통 디자인 값 정의 (spacing, padding, 아이콘 크기 등)
 */

import { Colors } from '@/commons/constants/color';

/**
 * 모달 타입별 컨텐츠 설정
 * - 피그마 노드 3개를 각각 확인하여 추출한 값
 * - 노드 295:3725 → PAYMENT_COMPLETE
 * - 노드 370:2795 → SUBMIT_CONFIRM
 * - 노드 370:2816 → SUBMIT_COMPLETE
 */
export const MODAL_CONTENTS = {
  /**
   * 결제완료 확인 모달
   * - 피그마 노드: 214:1721 (295:3725 내부)
   * - 버튼 1개 (확인)
   * - 성공 아이콘 (카드 아이콘)
   */
  PAYMENT_COMPLETE: {
    title: '결제가 완료되었습니다!',
    description: '',
    iconName: 'ri-bank-card-2-fill' as const, // 카드 결제 아이콘
    iconColor: Colors.black[500], // 피그마: #0a0a0a (검정 아이콘)
    iconBackgroundColor: Colors.grey[50], // 피그마: #f5f5f5 (회색 배경)
    confirmText: '확인',
    buttonCount: 1 as const,
    closeOnBackdropPress: true,
    width: 344, // 피그마 확인: 344px
    height: 'auto' as const,
  },
  /**
   * 제출 전 재확인 모달
   * - 피그마 노드: 370:2795
   * - 버튼 2개 (취소, 묻기)
   * - 경고 아이콘 (느낌표)
   */
  SUBMIT_CONFIRM: {
    title: '이대로 타임캡슐을 묻을까요?',
    description: '한 번 닫힌 타임캡슐은 수정할 수 없어요',
    iconName: 'ri-error-warning-fill' as const, // 경고 아이콘
    iconColor: Colors.red[500], // 피그마: 경고 색상
    iconBackgroundColor: Colors.grey[50], // 피그마: #f5f5f5
    confirmText: '묻기',
    cancelText: '취소',
    buttonCount: 2 as const,
    closeOnBackdropPress: false, // 실수 방지
    width: 344, // 피그마 확인: 344px
    height: 'auto' as const,
  },
  /**
   * 제출완료 확인 모달
   * - 피그마 노드: 370:2816 (370:2921)
   * - 버튼 1개 (확인)
   * - 성공 아이콘 (캡슐 아이콘)
   */
  SUBMIT_COMPLETE: {
    title: '타임캡슐이',
    subtitle: '성공적으로 묻혔습니다!',
    description: '',
    iconName: 'ri-archive-fill' as const, // 캡슐/보관함 아이콘
    iconColor: Colors.black[500], // 피그마: #0a0a0a
    iconBackgroundColor: Colors.grey[50], // 피그마: #f5f5f5
    confirmText: '확인',
    buttonCount: 1 as const,
    closeOnBackdropPress: true,
    width: 344, // 피그마 확인: 344px
    height: 'auto' as const,
  },
} as const;

/**
 * 공통 디자인 값
 * - 피그마에서 확인한 모든 타입에서 공통으로 사용되는 값
 */
export const MODAL_DESIGN = {
  /**
   * 아이콘 관련
   * - 피그마: 아이콘 크기 80px (container), 내부 아이콘 34px
   * - 아이콘 배경 크기: 80px, border-radius: 28px
   */
  iconContainerSize: 80, // 피그마: 80px
  iconSize: 34, // 피그마: 34px (실제 아이콘 크기)
  iconBackgroundRadius: 28, // 피그마: rounded-[28px]

  /**
   * 간격 (Spacing)
   * - 피그마에서 각 요소 사이 간격 측정
   */
  spacing: {
    iconToTitle: 24, // 피그마: 아이콘과 제목 사이 간격 (대략 24px)
    titleToDescription: 8, // 피그마: 제목과 설명 사이 간격 (대략 8px)
    descriptionToContent: 24, // 피그마: 설명과 추가 컨텐츠 사이 간격
    contentToButton: 24, // 피그마: 컨텐츠와 버튼 사이 간격
    buttonGap: 12, // 피그마: 버튼 2개일 때 버튼 사이 간격 (11.998px ≈ 12px)
  },

  /**
   * 패딩 (Padding)
   * - 피그마: 모달 내부 패딩
   */
  padding: {
    vertical: 33, // 피그마: 상단 33px (아이콘 시작 위치 기준)
    horizontal: 26, // 피그마: 좌우 26px (양옆 여백)
    bottom: 24, // 피그마: 하단 패딩 (버튼 하단 기준)
  },

  /**
   * 버튼 관련
   * - 피그마: 버튼 높이 60px (61.991px ≈ 60px)
   * - 버튼 border-radius: 20px
   */
  button: {
    height: 60, // 피그마: 60px (61.991px ≈ 60px)
    borderRadius: 20, // 피그마: rounded-[20px]
  },

  /**
   * 정보 카드 (SUBMIT_COMPLETE에서 사용)
   * - 피그마: 개봉일, 참여 인원 정보 표시 영역
   */
  infoCard: {
    height: 168, // 피그마: 167.999px ≈ 168px
    borderRadius: 20, // 피그마: rounded-[20px]
    backgroundColor: Colors.grey[50], // 피그마: #f5f5f5
    borderColor: Colors.whiteGrey[500], // 피그마: #e5e5e5
    borderWidth: 1.838, // 피그마: 1.838px (약 2px)
  },
} as const;
