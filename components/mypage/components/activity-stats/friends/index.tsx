/**
 * components/mypage/components/activity-stats/friends/index.tsx
 * 친구 관리 모달 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] Modal 컴포넌트 사용
 * - [✓] Colors, Typography 토큰만 사용
 *
 * Figma 노드 ID: 161:25212
 */

import { Modal } from '@/commons/components/modal';
import { Colors } from '@/commons/constants';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { styles } from './styles';

// 타입 정의
export interface Friend {
  id: string;
  name: string;
  emoji: string;
  isBlocked: boolean;
}

export interface FriendsModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 친구 목록 */
  friends?: Friend[];
  /** 새로고침 함수 */
  onRefresh?: () => void;
  /** 친구 차단/해제 함수 */
  onToggleBlock?: (friendId: string) => void;
}

// 기본 친구 목록 데이터 (Figma 디자인 기준)
const DEFAULT_FRIENDS: Friend[] = [
  { id: '1', name: '김민수', emoji: '🐨', isBlocked: false },
  { id: '2', name: '이지은', emoji: '🐼', isBlocked: false },
  { id: '3', name: '최유나', emoji: '🐯', isBlocked: false },
  { id: '4', name: '정우성', emoji: '🐰', isBlocked: false },
  { id: '5', name: '한지민', emoji: '🦋', isBlocked: false },
  { id: '6', name: '신유', emoji: '🐶', isBlocked: false },
  { id: '7', name: '최산', emoji: '🦊', isBlocked: false },
  { id: '8', name: '김선호', emoji: '🐮', isBlocked: false },
  { id: '9', name: '박서준', emoji: '🐵', isBlocked: true },
];

export function FriendsModal({
  visible,
  onClose,
  friends = DEFAULT_FRIENDS,
  onRefresh,
  onToggleBlock,
}: FriendsModalProps) {
  // 차단되지 않은 친구 수 계산
  const activeFriendsCount = friends.filter((f: Friend) => !f.isBlocked).length;
  const totalFriendsCount = friends.length;

  // 친구 차단/해제 핸들러
  const handleToggleBlock = (friendId: string) => {
    if (onToggleBlock) {
      onToggleBlock(friendId);
    }
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} width="90%" height={614} closeOnBackdropPress={true}>
      <View style={styles.modalContainer} collapsable={false}>
        {/* 헤더 섹션 */}
        <View style={styles.headerSection}>
          {/* 헤더 상단 (제목 + 버튼) */}
          <View style={styles.headerTop}>
            <Text style={styles.title}>친구 관리</Text>
            <View style={styles.headerButtons}>
              <Pressable style={styles.refreshButton} onPress={handleRefresh}>
                <Icon name={'ri-refresh-line' as IconName} size={20} color={Colors.black[500]} />
              </Pressable>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Icon name={'ri-close-line' as IconName} size={24} color={Colors.black[500]} />
              </Pressable>
            </View>
          </View>

          {/* 서브타이틀 */}
          <Text style={styles.subtitle}>
            카카오톡 연동 친구 목록 ({activeFriendsCount}/{totalFriendsCount})
          </Text>

          {/* 정보 박스 */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              새로고침 시 카카오톡 친구 목록을 다시 불러옵니다. 차단한 친구는 새로고침 후에도 차단
              상태가 유지됩니다.
            </Text>
          </View>
        </View>

        {/* 친구 목록 섹션 */}
        <View style={styles.friendsSectionWrapper}>
          <ScrollView
            style={styles.friendsSection}
            contentContainerStyle={styles.friendsList}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            bounces={true}
            scrollEnabled={true}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}>
            {friends.map((friend: Friend) => (
              <View
                key={friend.id}
                style={[styles.friendItem, friend.isBlocked && styles.friendItemBlocked]}
                pointerEvents="box-none">
                {/* 친구 정보 */}
                <View style={styles.friendInfo} pointerEvents="box-none">
                  {/* 아바타 */}
                  <View
                    style={[
                      styles.avatarContainer,
                      friend.isBlocked && styles.avatarContainerBlocked,
                    ]}>
                    <Text
                      style={[styles.avatarEmoji, friend.isBlocked && styles.avatarEmojiBlocked]}>
                      {friend.emoji}
                    </Text>
                  </View>

                  {/* 이름 */}
                  <Text style={[styles.friendName, friend.isBlocked && styles.friendNameBlocked]}>
                    {friend.name}
                  </Text>
                </View>

                {/* 차단/해제 버튼 */}
                <Pressable
                  style={[styles.blockButton, friend.isBlocked && styles.unblockButton]}
                  onPress={() => handleToggleBlock(friend.id)}
                  pointerEvents="auto">
                  <Icon
                    name={
                      (friend.isBlocked
                        ? 'ri-user-unfollow-line'
                        : 'ri-user-forbid-line') as IconName
                    }
                    size={16}
                    color={friend.isBlocked ? Colors.white[500] : Colors.black[500]}
                  />
                  <Text style={[styles.buttonText, friend.isBlocked && styles.buttonTextUnblock]}>
                    {friend.isBlocked ? '해제' : '차단'}
                  </Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
