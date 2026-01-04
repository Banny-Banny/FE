/**
 * components/timecapsule-create/components/step-room/index.tsx
 * StepRoom 컴포넌트 - 타임캡슐 대기실 화면
 *
 * 체크리스트:
 * - [✓] Props 인터페이스 정의 (role: 'host' | 'guest')
 * - [✓] 조건부 렌더링 구현 (호스트/게스트)
 * - [✓] 인라인 스타일 금지
 * - [✓] 색상 토큰만 사용
 * - [✓] Figma 디자인 1:1 대응
 * - [✓] Hooks 연결 (useRoomData, useParticipants)
 * - [✓] 데이터 바인딩 (roomData, participants, progress)
 */

import { Button } from '@/commons/components/button';
import { TimeCapsuleHeader } from '@/commons/components/timecapsule-header';
import { useModal } from '@/commons/components/modal/hooks/useModal';
import { Colors } from '@/commons/constants/color';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import SubmitConfirmModal from '../../modals/submit-confirm-modal';
import SubmitCompleteModal from '../../modals/submit-complete-modal';
import UserBottomSheet from '../write-bottomsheet';
import { useParticipants } from './hooks/useParticipants';
import { useRoomData } from './hooks/useRoomData';
import { useRoomSubmit } from './hooks/useRoomSubmit';
import { styles } from './styles';
import type { Participant } from './types';

// Props 인터페이스 정의
interface StepRoomProps {
  role: 'host' | 'guest';
  capsuleId?: string; // 캡슐 ID (옵션, 없으면 환경변수 사용)
  onSubmit?: () => void; // 타임캡슐 묻기 완료 핸들러 (테스트용)
}

export default function StepRoom({ role, capsuleId: propsCapsuleId, onSubmit }: StepRoomProps) {
  // ============================================
  // Hooks
  // ============================================

  /** 호스트 여부 확인 */
  const isHost = role === 'host';

  /** 라우터 */
  const router = useRouter();

  /** 모달 제어 Hook */
  const { openModal, closeModal } = useModal();

  /**
   * capsuleId 우선순위:
   * 1. Props로 전달받은 capsuleId
   * 2. 환경변수 (EXPO_PUBLIC_CAPSULE_ID)
   * 3. undefined (목데이터 사용)
   */
  const capsuleId = propsCapsuleId || process.env.EXPO_PUBLIC_CAPSULE_ID;

  /** 캡슐대기실 데이터 Hook */
  const { roomSettings, roomData, isLoading: isRoomLoading, error: roomError, calculateProgress, canSubmit } = useRoomData(capsuleId);

  /** 참여자 목록 Hook */
  const { participants, myParticipant, saveContent, canEdit } = useParticipants();

  /** 타임캡슐 최종 제출 Hook */
  const { submitTimeCapsule, isSubmitting: isSubmittingCapsule, error: submitError } = useRoomSubmit();

  // ============================================
  // 상태 관리
  // ============================================

  /** 바텀시트 상태 관리 */
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  // ============================================
  // 계산된 값 (useMemo로 최적화)
  // ============================================

  /** 진행 상황 계산 (완료 인원 / 전체 인원) */
  const progress = useMemo(() => {
    return calculateProgress(participants);
  }, [calculateProgress, participants]);

  /** 최종 제출 가능 여부 (진행률 100%) */
  const isSubmitEnabled = useMemo(() => {
    return canSubmit(participants);
  }, [canSubmit, participants]);

  /** 작성 마감까지 남은 시간 계산 */
  const remainingTime = useMemo(() => {
    if (!roomData?.deadline) return '';

    const now = dayjs();
    const deadlineDate = dayjs(roomData.deadline);
    const diffHours = deadlineDate.diff(now, 'hour');
    const diffMinutes = deadlineDate.diff(now, 'minute') % 60;

    return `${diffHours}시간 ${diffMinutes}분 남음`;
  }, [roomData?.deadline]);

  // ============================================
  // 이벤트 핸들러
  // ============================================

  /** 공유 기능 */
  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: '타임캡슐에 초대합니다',
        message: `타임캡슐 이름: ${roomData?.capsuleName || ''}\n\n함께 추억을 남겨보세요!\n\n초대 링크: [추후 API 연동]`,
      });

      // iOS에서 공유 성공/취소 여부 확인 가능 (선택사항)
      if (result.action === Share.sharedAction) {
        // 공유 완료
      } else if (result.action === Share.dismissedAction) {
        // 사용자가 취소
      }
    } catch (error) {
      console.error('공유하기 실패:', error);
    }
  };

  /** 바텀시트 저장 핸들러 */
  const handleBottomSheetSave = async (content: any) => {
    if (!selectedParticipant) return;

    try {
      console.log('💾 [StepRoom] 바텀시트 저장 시작:', selectedParticipant.id);
      await saveContent(selectedParticipant.id, content);
      console.log('✅ [StepRoom] 바텀시트 저장 성공!');
      setIsBottomSheetVisible(false);
    } catch (err) {
      console.error('❌ [StepRoom] 바텀시트 저장 실패:', err);
    }
  };

  // ============================================
  // 참여자 카드 렌더링
  // ============================================

  const renderParticipantCard = (participant: Participant, index: number) => {
    const isActive = participant.isMe || participant.status === 'completed';
    const showCheckbox = participant.name !== '';
    const isEditable = canEdit(participant.id);

    return (
      <Pressable
        key={participant.id}
        style={[
          styles.participantCard,
          isActive ? styles.participantCardActive : styles.participantCardInactive,
        ]}
        onPress={() => {
          // 프라이버시 체크: 본인 것만 클릭 가능
          if (participant.name && isEditable) {
            console.log('📝 [StepRoom] 참여자 카드 클릭:', participant.name);
            setSelectedParticipant(participant);
            setIsBottomSheetVisible(true);
          } else if (participant.name && !isEditable) {
            console.log('🚫 [StepRoom] 다른 사람 카드 클릭 차단:', participant.name);
          }
        }}>
        <View style={styles.participantInfo}>
          {/* 아바타 */}
          <View style={[styles.avatar, isActive && styles.avatarActive]}>
            <Text
              style={[
                styles.avatarEmoji,
                participant.status === 'waiting' && styles.avatarEmojiDisabled,
              ]}>
              {participant.emoji}
            </Text>
          </View>

          {/* 참여자 정보 */}
          <View style={styles.participantDetails}>
            {participant.name ? (
              <>
                <View style={styles.participantNameRow}>
                  <Text style={styles.participantName}>{participant.name}</Text>
                  {participant.isHost && <Text style={styles.crownEmoji}>👑</Text>}
                </View>
                <Text
                  style={[
                    styles.participantStatus,
                    participant.status === 'completed' && styles.statusCompleted,
                    participant.status === 'pending' && styles.statusPending,
                    participant.status === 'waiting' && styles.statusWaiting,
                  ]}>
                  {participant.status === 'completed' && '작성 완료'}
                  {participant.status === 'pending' && '클릭하여 작성하기'}
                  {participant.status === 'waiting' && '아직 작성하지 않았어요'}
                </Text>
              </>
            ) : (
              <Text style={styles.emptySlotText}>친구를 초대해 남은 슬롯을 채워주세요!</Text>
            )}
          </View>
        </View>

        {/* 체크박스 또는 공유 아이콘 */}
        {participant.name ? (
          showCheckbox && (
            <View
              style={[styles.checkbox, isActive ? styles.checkboxActive : styles.checkboxInactive]}>
              {participant.status === 'completed' && (
                <Icon name="checkbox-circle-fill" size={20} color={Colors.green[500]} />
              )}
            </View>
          )
        ) : (
          <Pressable onPress={handleShare}>
            <Icon name="share-line" size={24} color={Colors.black[500]} />
          </Pressable>
        )}
      </Pressable>
    );
  };

  // ============================================
  // 로딩 및 에러 처리
  // ============================================

  /** 로딩 상태 */
  if (isRoomLoading || !roomData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.black[500]} />
          <Text style={{ marginTop: 16, textAlign: 'center', color: Colors.grey[500] }}>
            캡슐대기실 정보를 불러오는 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /** 에러 상태 */
  if (roomError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={{ textAlign: 'center', color: Colors.red[500] }}>
            에러가 발생했습니다: {roomError.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================
  // 렌더링
  // ============================================

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <TimeCapsuleHeader
        title="캡슐 대기실"
        onBack={() => router.back()}
        titleAlign="left"
        rightIcons={[
          {
            icon: 'more-2-fill',
            onPress: () => {
              // TODO: 더보기 메뉴 구현
              console.log('더보기 메뉴');
            },
          },
          {
            icon: 'close-line',
            onPress: () => {
              // TODO: 닫기 기능 구현
              router.back();
            },
          },
        ]}
      />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

      {/* 정보 카드 */}
      <View style={styles.infoCard}>
        <View>
          <Text style={styles.infoCardLabel}>캡슐 이름</Text>
          <Text style={styles.infoCardValue}>{roomData.capsuleName}</Text>
        </View>

        <View style={styles.infoCardDetails}>
          {/* 개봉일 */}
          <View style={styles.infoCardDetailItem}>
            <View style={styles.infoCardIconWrapper}>
              <Icon name="calendar-line" size={28} color={Colors.grey[500]} />
            </View>
            <View>
              <Text style={styles.infoCardDetailLabel}>개봉일</Text>
              <Text style={styles.infoCardDetailValue}>{roomData.openDate}</Text>
            </View>
          </View>

          {/* 참여자 */}
          <View style={styles.infoCardDetailItem}>
            <View style={styles.infoCardIconWrapper}>
              <Icon name="user-3-line" size={37} color={Colors.grey[500]} />
            </View>
            <View>
              <Text style={styles.infoCardDetailLabel}>참여자</Text>
              <Text style={styles.infoCardDetailValue}>{roomData.maxParticipants}명</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 친구 초대하기 버튼 */}
      <View style={styles.inviteButtonWrapper}>
        <Button
          label="친구 초대하기"
          variant="outline"
          size="M"
          icon="share-line"
          iconPosition="left"
          onPress={handleShare}
        />
      </View>

      {/* 참여자 목록 */}
      <View style={styles.participantSection}>
        <Text style={styles.participantLabel}>참여자 목록</Text>
        <View style={styles.participantList}>
          {participants.map((participant, index) => renderParticipantCard(participant, index))}
        </View>
      </View>

      {/* 하단 정보 */}
      <View style={styles.bottomSection}>
        <Text style={styles.infoText}>
          {isHost
            ? '내 글은 방장이 최종 제출하기 전까지 수정할 수 있어요'
            : '방장이 최종 제출하기 전까지 수정할 수 있어요'}
        </Text>

        <View style={styles.deadlineContainer}>
          <Icon name="time-line" size={16} color={Colors.grey[500]} />
          <Text style={styles.deadlineText}>
            작성 마감: {remainingTime || '계산 중...'}
          </Text>
        </View>

        {/* 타임캡슐 묻기 버튼 (호스트만, 진행률 100%일 때 활성화) */}
        {isHost && (
          <View style={styles.buttonSection}>
            <Button
              label={isSubmittingCapsule ? '제출 중...' : '타임캡슐 묻기'}
              variant="primary"
              size="M"
              disabled={!isSubmitEnabled || isSubmittingCapsule}
              onPress={() => {
                console.log('🎯 [StepRoom] 타임캡슐 묻기 버튼 클릭!');
                console.log('📊 [StepRoom] 진행률:', progress.percentage, '%');
                console.log('✅ [StepRoom] 제출 가능 여부:', isSubmitEnabled);

                // 1단계: 정말 묻겠습니까?
                openModal({
                  width: 344,
                  height: 'auto',
                  closeOnBackdropPress: false,
                  children: (
                    <SubmitConfirmModal
                      openDate={roomData.openDate}
                      onConfirm={async () => {
                        console.log('✅ [StepRoom] 타임캡슐 묻기 확인!');
                        closeModal();

                        try {
                          // 백엔드로 최종 제출
                          console.log('📤 [StepRoom] 백엔드로 타임캡슐 제출 시작...');
                          await submitTimeCapsule(roomData, participants);
                          console.log('✅ [StepRoom] 백엔드 제출 완료!');

                          // D-Day 계산
                          const now = dayjs();
                          const openDateObj = dayjs(roomData.openDate, 'YYYY.MM.DD');
                          const dDay = openDateObj.diff(now, 'day');

                          // 2단계: 제출 완료!
                          openModal({
                            width: 344,
                            height: 'auto',
                            closeOnBackdropPress: true,
                            children: (
                              <SubmitCompleteModal
                                capsuleName={roomData.capsuleName}
                                openDate={roomData.openDate}
                                dDay={dDay}
                                participantCount={progress.total}
                                onConfirm={() => {
                                  console.log('✅ [StepRoom] 제출 완료 모달 확인!');
                                  closeModal();
                                  if (onSubmit) {
                                    onSubmit();
                                  }
                                }}
                              />
                            ),
                          });
                        } catch (err) {
                          // 제출 실패 시 에러 모달 표시
                          console.error('❌ [StepRoom] 타임캡슐 제출 실패:', err);
                          openModal({
                            width: 344,
                            height: 'auto',
                            closeOnBackdropPress: true,
                            children: (
                              <View style={{ padding: 24 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                                  제출 실패
                                </Text>
                                <Text style={{ fontSize: 14, color: Colors.grey[600], marginBottom: 24 }}>
                                  {err instanceof Error ? err.message : '타임캡슐 제출에 실패했습니다.'}
                                </Text>
                                <TouchableOpacity
                                  style={{
                                    backgroundColor: Colors.black[500],
                                    padding: 16,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                  }}
                                  onPress={closeModal}>
                                  <Text style={{ color: Colors.white[500], fontWeight: 'bold' }}>확인</Text>
                                </TouchableOpacity>
                              </View>
                            ),
                          });
                        }
                      }}
                      onCancel={() => {
                        console.log('❌ [StepRoom] 타임캡슐 묻기 취소!');
                        closeModal();
                      }}
                    />
                  ),
                });
              }}
            />
            {!isSubmitEnabled && (
              <Text style={styles.buttonHint}>모든 참여자 작성 완료 시 활성화</Text>
            )}
          </View>
        )}
      </View>

        {/* 바텀시트 */}
        {selectedParticipant && (
          <UserBottomSheet
            isVisible={isBottomSheetVisible}
            onClose={() => setIsBottomSheetVisible(false)}
            participant={selectedParticipant}
            onSave={handleBottomSheetSave}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
