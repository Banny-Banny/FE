/**
 * components/timecapsule-create/components/confirm-modal/index.tsx
 * ConfirmModal 컴포넌트 구현
 *
 * @description
 * - 타임캡슐 생성 플로우에서 사용되는 재사용 가능한 확인(Confirm) 모달 내용
 * - 3가지 타입: PAYMENT_COMPLETE, SUBMIT_CONFIRM, SUBMIT_COMPLETE
 * - ModalProvider와 함께 사용
 * - react-native-remix-icon 사용
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from 'react-native-remix-icon';
import { ConfirmModalProps } from './types';
import { MODAL_CONTENTS } from './constants';
import { styles } from './styles';

export default function ConfirmModal({
  type,
  onConfirm,
  onCancel,
  data,
}: ConfirmModalProps) {
  // type에 따라 constants에서 설정 가져오기
  const config = useMemo(() => MODAL_CONTENTS[type], [type]);

  // 확인 버튼 핸들러
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  // 취소 버튼 핸들러 (SUBMIT_CONFIRM에서만 사용)
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  /**
   * SUBMIT_COMPLETE 타입에서 정보 카드 렌더링
   */
  const renderInfoCard = () => {
    if (type !== 'SUBMIT_COMPLETE' || !data) return null;

    return (
      <View style={styles.infoCardContainer}>
        {/* 캡슐 이름 */}
        {data.capsuleName && (
          <View style={styles.capsuleNameContainer}>
            <Text style={styles.capsuleName}>{data.capsuleName}</Text>
          </View>
        )}

        {/* 개봉일 정보 */}
        {data.openDate && (
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="calendar-2-fill" size={16} color="#999" />
              <Text style={styles.infoLabel}>오픈일</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.infoValue}>{data.openDate}</Text>
              {data.dDay !== undefined && (
                <View style={styles.dDayBadge}>
                  <Text style={styles.dDayText}>D-{data.dDay}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 참여 인원 정보 */}
        {data.participantCount !== undefined && (
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="group-fill" size={16} color="#999" />
              <Text style={styles.infoLabel}>참여 인원</Text>
            </View>
            <Text style={styles.infoValue}>{data.participantCount}명</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
        {/* 아이콘 영역 */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: config.iconBackgroundColor },
          ]}
        >
          <Icon
            name={config.iconName}
            size={34}
            color={config.iconColor}
          />
        </View>

        {/* 텍스트 영역 */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{config.title}</Text>
          {config.subtitle && (
            <Text style={styles.subtitle}>{config.subtitle}</Text>
          )}
          {config.description && (
            <Text style={styles.description}>{config.description}</Text>
          )}
        </View>

        {/* 정보 카드 (SUBMIT_COMPLETE 타입에서만 표시) */}
        {renderInfoCard()}

        {/* 버튼 영역 */}
        <View style={styles.buttonContainer}>
          {config.buttonCount === 1 ? (
            // 버튼 1개: 확인만
            <Pressable
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
                {config.confirmText}
              </Text>
            </Pressable>
          ) : (
            // 버튼 2개: 취소, 확인
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.buttonSecondary, styles.buttonHalf]}
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                  {config.cancelText}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonPrimary, styles.buttonHalf]}
                onPress={handleConfirm}
              >
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
                  {config.confirmText}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
  );
}
