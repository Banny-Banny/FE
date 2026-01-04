/**
 * components/timecapsule-create/components/submit-complete-modal/index.tsx
 * 타임캡슐 완료 모달 컴포넌트
 *
 * @description
 * - 타임캡슐이 성공적으로 묻혔을 때 표시되는 모달
 * - 공통 Modal 컴포넌트의 children으로 사용됨
 * - 아이콘, 제목, 정보 카드(캡슐 이름, 개봉일, 참여 인원), 확인 버튼으로 구성
 */

import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { Button } from '@/commons/components/button';
import { Colors } from '@/commons/constants/color';
import { styles } from './styles';

interface SubmitCompleteModalProps {
  /** 캡슐 이름 */
  capsuleName: string;
  /** 개봉일 (예: "2026.01.16") */
  openDate: string;
  /** D-Day (예: 365) */
  dDay?: number;
  /** 참여 인원 수 */
  participantCount: number;
  /** 확인 버튼 클릭 시 실행될 함수 */
  onConfirm: () => void;
}

/**
 * 타임캡슐 완료 모달
 * - useModal().openModal()의 children으로 전달됨
 */
export default function SubmitCompleteModal({
  capsuleName,
  openDate,
  dDay,
  participantCount,
  onConfirm,
}: SubmitCompleteModalProps) {
  return (
    <View style={styles.container}>
      {/* 아이콘 영역 */}
      <View style={styles.iconContainer}>
        <Icon name="archive-fill" size={64} color={Colors.black[500]} />
      </View>

      {/* 텍스트 영역 */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>타임캡슐이</Text>
        <Text style={styles.subtitle}>성공적으로 묻혔습니다!</Text>
      </View>

      {/* 정보 카드 */}
      <View style={styles.infoCardContainer}>
        {/* 캡슐 이름 */}
        <View style={styles.capsuleNameContainer}>
          <Text style={styles.capsuleName}>{capsuleName}</Text>
        </View>

        {/* 개봉일 정보 */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="calendar-2-fill" size={16} color={Colors.grey[600]} />
            <Text style={styles.infoLabel}>오픈일</Text>
          </View>
          <View style={styles.dateValueContainer}>
            <Text style={styles.infoValue}>{openDate}</Text>
            {dDay !== undefined && (
              <View style={styles.dDayBadge}>
                <Text style={styles.dDayText}>D-{dDay}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 참여 인원 정보 */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon name="group-fill" size={16} color={Colors.grey[600]} />
            <Text style={styles.infoLabel}>참여 인원</Text>
          </View>
          <Text style={styles.infoValue}>{participantCount}명</Text>
        </View>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <Button label="확인" variant="primary" size="S" fullWidth={true} onPress={onConfirm} />
      </View>
    </View>
  );
}
