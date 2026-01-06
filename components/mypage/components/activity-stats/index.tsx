/**
 * components/mypage/components/activity-stats/index.tsx
 * 활동 통계 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 *
 * Figma 노드 ID: 161:24090
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useToggle } from '@/commons/hooks';
import { useUserInfo } from '../../hooks/useUserInfo';
import { FriendsModal } from './friends';
import { useFriends } from './friends/hooks/useFriends';
import { styles } from './styles';

export function ActivityStats() {
  const { isOpen: isFriendsModalVisible, open: handleFriendsPress, close: handleCloseFriendsModal } = useToggle();

  // ============================================
  // 사용자 통계 정보 (summary만 사용)
  // ============================================
  const { data: userInfo } = useUserInfo();
  const summary = userInfo?.summary || {
    capsuleCount: 0,
    easterEggCount: 0,
    friendCount: 0,
  };

  // ============================================
  // 친구 목록 관리 (API 호출 로직은 useFriends 훅에서 처리)
  // ============================================
  const { friends, isRefreshing, refreshFriends, toggleBlock } = useFriends();

  return (
    <>
      <View style={styles.container}>
        {/* 캡슐 통계 */}
        <View style={styles.statItem}>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{summary.capsuleCount}</Text>
          </View>
          <View style={styles.statLabelContainer}>
            <Text style={styles.statLabel}>캡슐</Text>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 이스터에그 통계 */}
        <View style={styles.statItem}>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{summary.easterEggCount}</Text>
          </View>
          <View style={styles.statLabelContainer}>
            <Text style={styles.statLabel}>이스터에그</Text>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 친구 통계 */}
        <Pressable style={styles.statItem} onPress={handleFriendsPress}>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{summary.friendCount}</Text>
          </View>
          <View style={styles.statLabelContainer}>
            <Text style={styles.statLabel}>친구</Text>
          </View>
        </Pressable>
      </View>

      {/* 친구 관리 모달 */}
      <FriendsModal
        visible={isFriendsModalVisible}
        onClose={handleCloseFriendsModal}
        friends={friends}
        onRefresh={refreshFriends}
        onToggleBlock={toggleBlock}
        isRefreshing={isRefreshing}
      />
    </>
  );
}
