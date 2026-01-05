/**
 * EggSlotModal Component
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] 토큰 기반 스타일 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 * - [x] commons/components/modal 공통컴포넌트 활용
 * - [x] react-native-remix-icon 사용
 */

import { Button } from '@/commons/components/button';
import { Modal } from '@/commons/components/modal';
import { Colors } from '@/commons/constants';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from './styles';
import type { EggSlotModalProps } from './types';

export const EggSlotModal: React.FC<EggSlotModalProps> = ({
  visible,
  onClose,
  usedCount,
  totalCount = 3,
}) => {
  // 사용된 개수가 전체 개수를 초과하지 않도록 제한
  const safeUsedCount = Math.min(Math.max(0, usedCount), totalCount);
  // remaining slots 계산 (totalCount - usedCount)
  const remainingCount = Math.max(0, totalCount - safeUsedCount);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      width={340}
      height="auto"
      closeOnBackdropPress={true}
      disableAnimation={true}>
      <View style={styles.modalContent}>
        {/* X 버튼 - 모달 우측 상단 */}
        <Pressable
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="모달 닫기">
          <Icon name="close-line" size={20} color={Colors.black[500]} />
        </Pressable>

        {/* 헤더 영역 */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>MY EGGS</Text>
            <Text style={styles.subtitle}>현재 보유한 이스터에그 개수</Text>
          </View>
        </View>

        {/* 에그 슬롯 표시 영역 */}
        <View style={styles.eggSlotContainer}>
          <View style={styles.eggSlotRow}>
            {Array.from({ length: totalCount }, (_, index) => {
              // remaining slots를 기준으로 찬 알 표시
              // 앞에서부터 remainingCount만큼 꽉찬 알, 그 다음부터 빈 알
              const isFilled = index < remainingCount;
              const slotNumber = index + 1;

              return (
                <View key={slotNumber} style={styles.eggSlotItem}>
                  {isFilled ? (
                    <Image
                      source={require('../../../../assets/icons/egg-icon.svg')}
                      style={styles.eggIcon}
                      contentFit="contain"
                      accessibilityLabel={`에그 슬롯 ${slotNumber} - 사용됨`}
                    />
                  ) : (
                    <Image
                      source={require('../../../../assets/icons/egg-icon.svg')}
                      style={styles.eggIconEmpty}
                      contentFit="contain"
                      accessibilityLabel={`에그 슬롯 ${slotNumber} - 비어있음`}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* 개수 표시 */}
        <View style={styles.countContainer}>
          <Text style={styles.currentCount}>{remainingCount}</Text>
          <Text style={styles.totalCount}>/{totalCount}</Text>
        </View>

        {/* 정보 섹션 */}
        <View style={styles.infoContainer}>
          <View style={styles.infoIconContainer}>
            <Icon name="information-line" size={16} color={Colors.grey[800]} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>
              <Text>이스터에그는 최대 </Text>
              <Text style={styles.infoTextHighlight}>3개</Text>
              <Text>까지 보유할 수 있으며, 지도에서 휘발되거나 지워지면 자동으로 채워집니다.</Text>
            </Text>
          </View>
        </View>

        {/* 확인 버튼 */}
        <View style={styles.confirmButtonContainer}>
          <Button label="확인" variant="primary" size="S" onPress={onClose} fullWidth={true} />
        </View>
      </View>
    </Modal>
  );
};

export default EggSlotModal;
