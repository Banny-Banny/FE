/**
 * components/timecapsule-create/components/submit-confirm-modal/index.tsx
 * 타임캡슐 묻기 확인 모달 컴포넌트
 *
 * @description
 * - 타임캡슐을 묻기 전 재확인하는 모달
 * - 공통 Modal 컴포넌트의 children으로 사용됨
 * - 경고 아이콘, 제목, 설명, 개봉일 정보 카드, 취소/묻기 버튼으로 구성
 * - 피그마: 459:1421
 */

import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { DualButton } from '@/commons/components/dual-button';
import { Colors } from '@/commons/constants/color';
import { styles } from './styles';

interface SubmitConfirmModalProps {
  /** 개봉일 (예: "2026.01.16") */
  openDate: string;
  /** 확인 버튼 클릭 시 실행될 함수 */
  onConfirm: () => void;
  /** 취소 버튼 클릭 시 실행될 함수 */
  onCancel: () => void;
}

/**
 * 타임캡슐 묻기 확인 모달
 * - useModal().openModal()의 children으로 전달됨
 */
export default function SubmitConfirmModal({
  openDate,
  onConfirm,
  onCancel,
}: SubmitConfirmModalProps) {
  return (
    <View style={styles.container}>
      {/* 아이콘 영역 */}
      <View style={styles.iconContainer}>
        <Icon name="error-warning-fill" size={64} color={Colors.red[500]} />
      </View>

      {/* 텍스트 영역 */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>이대로 타임캡슐을 묻을까요?</Text>
        <Text style={styles.description}>한 번 닫힌 타임캡슐은 수정할 수 없어요</Text>
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 개봉일 정보 카드 */}
      <View style={styles.infoCardContainer}>
        <Text style={styles.infoLabel}>개봉일</Text>
        <Text style={styles.infoValue}>{openDate}</Text>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <DualButton
          cancelLabel="취소"
          confirmLabel="묻기"
          size="S"
          onCancelPress={onCancel}
          onConfirmPress={onConfirm}
        />
      </View>
    </View>
  );
}
