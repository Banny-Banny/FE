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
 */

import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { styles } from './styles';
import { UserBottomSheet } from '../write-bottomsheet';

// Props 인터페이스 정의
interface StepRoomProps {
  role: 'host' | 'guest';
}

// 참여자 데이터 타입
interface Participant {
  id: string;
  name: string;
  emoji: string;
  status: 'completed' | 'pending' | 'waiting';
  isHost?: boolean;
  isMe?: boolean;
}

// 임시 참여자 데이터 (실제로는 props로 받아야 함)
const mockParticipants: Participant[] = [
  {
    id: '1',
    name: '나 (최홍식)',
    emoji: '🥚',
    status: 'pending',
    isMe: true,
  },
  {
    id: '2',
    name: '양지윤',
    emoji: '🥚',
    status: 'completed',
    isHost: true,
  },
  {
    id: '3',
    name: '박초롱',
    emoji: '🥚',
    status: 'waiting',
  },
  {
    id: '4',
    name: '',
    emoji: '👤',
    status: 'waiting',
  },
];

export const StepRoom: React.FC<StepRoomProps> = ({ role }) => {
  // 호스트 여부 확인
  const isHost = role === 'host';

  // 바텀시트 상태 관리
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  // 진행 상황 계산
  const completedCount = mockParticipants.filter(p => p.status === 'completed').length;
  const totalCount = mockParticipants.filter(p => p.name).length;

  // 진행률 계산
  const progressPercentage = (completedCount / totalCount) * 100;

  // 참여자 카드 렌더링
  const renderParticipantCard = (participant: Participant, index: number) => {
    const isActive = participant.isMe || participant.status === 'completed';
    const showCheckbox = participant.name !== '';

    return (
      <View
        key={participant.id}
        style={[
          styles.participantCard,
          isActive ? styles.participantCardActive : styles.participantCardInactive,
        ]}
      >
        <View style={styles.participantInfo}>
          {/* 아바타 */}
          <View style={[styles.avatar, isActive && styles.avatarActive]}>
            <Text
              style={[
                styles.avatarEmoji,
                participant.status === 'waiting' && styles.avatarEmojiDisabled,
              ]}
            >
              {participant.emoji}
            </Text>
          </View>

          {/* 참여자 정보 */}
          <View style={styles.participantDetails}>
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                if (participant.name) {
                  setSelectedParticipant(participant);
                  setIsBottomSheetVisible(true);
                }
              }}
            >
              <Text style={styles.participantName}>{participant.name || '초대한 친구 기다리는 중...'}</Text>
              {participant.isHost && <Text style={styles.crownEmoji}>👑</Text>}
            </Pressable>
            {participant.name && (
              <Text
                style={[
                  styles.participantStatus,
                  participant.status === 'completed' && styles.statusCompleted,
                  participant.status === 'pending' && styles.statusPending,
                  participant.status === 'waiting' && styles.statusWaiting,
                ]}
              >
                {participant.status === 'completed' && '작성 완료'}
                {participant.status === 'pending' && '클릭하여 작성하기'}
                {participant.status === 'waiting' && '아직 작성하지 않았어요'}
              </Text>
            )}
          </View>
        </View>

        {/* 체크박스 */}
        {showCheckbox && (
          <View
            style={[
              styles.checkbox,
              isActive ? styles.checkboxActive : styles.checkboxInactive,
            ]}
          >
            {participant.status === 'completed' && (
              <Image
                source={{ uri: 'http://localhost:3845/assets/1455ea22b06a869fb03b37b32abd782756a3d2c5.svg' }}
                style={styles.checkboxChecked}
              />
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 헤더 */}
      <View style={styles.header}>
        {/* 역할 배지 */}
        <View style={[styles.roleBadge, isHost ? styles.roleBadgeHost : styles.roleBadgeGuest]}>
          {isHost && (
            <Image
              source={{ uri: 'http://localhost:3845/assets/1f875e9b22d7c8d0622c09038ec62e695bda2110.svg' }}
              style={styles.crownIcon}
            />
          )}
          <Text style={styles.roleBadgeText}>{isHost ? 'HOST' : 'GUEST'}</Text>
        </View>

        {/* 헤더 아이콘 */}
        <View style={styles.headerIcons}>
          {isHost && (
            <View style={styles.iconButton}>
              <Image
                source={{ uri: 'http://localhost:3845/assets/2b85f143dbb5617dc71235137b4aee78446c358d.svg' }}
                style={styles.icon}
              />
            </View>
          )}
          <View style={styles.iconButton}>
            <Image
              source={{ uri: 'http://localhost:3845/assets/4c02952bcd2c4e22c40d80f69612f998a9003c12.svg' }}
              style={styles.icon}
            />
          </View>
        </View>
      </View>

      {/* 타이틀 */}
      <Text style={styles.title}>캡슐 대기실</Text>

      {/* 정보 카드 */}
      <View style={styles.infoCard}>
        <View>
          <Text style={styles.infoCardLabel}>캡슐 이름</Text>
          <Text style={styles.infoCardValue}>ㅋ</Text>
        </View>

        <View style={styles.infoCardDetails}>
          {/* 개봉일 */}
          <View>
            <View style={styles.infoCardDetailItem}>
              <Image
                source={{ uri: 'http://localhost:3845/assets/7eb4946b787f0ad1ae41b5ffaca9b8a766b0d4ea.svg' }}
                style={styles.infoCardDetailIcon}
              />
              <Text style={styles.infoCardDetailLabel}>개봉일</Text>
            </View>
            <Text style={styles.infoCardDetailValue}>2025.06.10</Text>
          </View>

          {/* 참여자 */}
          <View>
            <View style={styles.infoCardDetailItem}>
              <Image
                source={{ uri: 'http://localhost:3845/assets/778d8cc95130db179cb52f43c52ec2220117b67c.svg' }}
                style={styles.infoCardDetailIcon}
              />
              <Text style={styles.infoCardDetailLabel}>참여자</Text>
            </View>
            <Text style={styles.infoCardDetailValue}>4명</Text>
          </View>
        </View>
      </View>

      {/* 진행 상황 */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>진행 상황</Text>
          <Text style={styles.progressValue}>{`${completedCount}/${totalCount}`}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>

      {/* 참여자 목록 */}
      <View style={styles.participantSection}>
        <Text style={styles.participantLabel}>참여자 목록</Text>
        <View style={styles.participantList}>
          {mockParticipants.map((participant, index) => renderParticipantCard(participant, index))}
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
          <Image
            source={{ uri: 'http://localhost:3845/assets/afeea765c879dab4b03d9207a68e204640aab75a.svg' }}
            style={styles.deadlineIcon}
          />
          <Text style={styles.deadlineText}>작성 마감: 23시간 59분 남음</Text>
        </View>

        {/* 타임캡슐 묻기 버튼 (호스트만) */}
        {isHost && (
          <View style={styles.buttonSection}>
            <View style={[styles.submitButton, styles.submitButtonDisabled]}>
              <Text style={styles.submitButtonText}>타임캡슐 묻기</Text>
            </View>
            <Text style={styles.buttonHint}>모든 참여자 작성 완료 시 활성화</Text>
          </View>
        )}
      </View>

      {/* 바텀시트 */}
      {selectedParticipant && (
        <UserBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={() => setIsBottomSheetVisible(false)}
          participant={selectedParticipant}
        />
      )}
    </ScrollView>
  );
};
