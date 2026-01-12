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

import { ROUTES } from '@/commons/constants/routes';
import { useNavigation, useToggle } from '@/commons/hooks';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useMyCapsules } from '@/components/my-capsule/hooks/useMyCapsules';
import { useUserInfo } from '../../hooks/useUserInfo';
import { FriendsModal } from './friends';
import { useFriends } from './friends/hooks/useFriends';
import { styles } from './styles';

export function ActivityStats() {
  const {
    isOpen: isFriendsModalVisible,
    open: handleFriendsPress,
    close: handleCloseFriendsModal,
  } = useToggle();
  const navigation = useNavigation();

  // ============================================
  // 사용자 통계 정보 (summary만 사용)
  // ============================================
  const { data: userInfo } = useUserInfo();
  
  // ============================================
  // 캡슐 개수 계산 (API에서 실제 데이터 가져오기)
  // ============================================
  const { capsules } = useMyCapsules();
  
  // 실제 캡슐 개수 계산 (대기실 + 열린 캡슐 + 잠긴 캡슐 = 전체 캡슐 개수)
  // API에서 직접 가져온 실제 캡슐 개수를 사용하여 정확한 개수 표시
  const actualCapsuleCount = useMemo(() => {
    return (
      capsules.waitingRooms.length +
      capsules.openedCapsules.length +
      capsules.lockedCapsules.length
    );
  }, [capsules]);
  
  // summary 정보 (캡슐 개수는 실제 API에서 가져온 값 사용)
  const summary = useMemo(() => {
    return {
      capsuleCount: actualCapsuleCount, // 항상 실제 캡슐 개수 사용
      easterEggCount: userInfo?.summary?.easterEggCount ?? 0,
      friendCount: userInfo?.summary?.friendCount ?? 0,
    };
  }, [actualCapsuleCount, userInfo?.summary]);

  // ============================================
  // 친구 목록 관리 (API 호출 로직은 useFriends 훅에서 처리)
  // ============================================
  const { friends, isRefreshing, refreshFriends, toggleBlock } = useFriends();

  // ============================================
  // 캡슐 목록으로 이동
  // ============================================
  const handleCapsulePress = () => {
    navigation.push(ROUTES.MY_CAPSULE);
  };

  // ============================================
  // 이스터에그 목록으로 이동
  // ============================================
  const handleEasterEggPress = () => {
    navigation.push(ROUTES.MY_EGG_LIST);
  };

  return (
    <>
      <View style={styles.container}>
        {/* 캡슐 통계 */}
        <Pressable style={styles.statItem} onPress={handleCapsulePress}>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{summary.capsuleCount}</Text>
          </View>
          <View style={styles.statLabelContainer}>
            <Text style={styles.statLabel}>캡슐</Text>
          </View>
        </Pressable>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 이스터에그 통계 */}
        <Pressable style={styles.statItem} onPress={handleEasterEggPress}>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{summary.easterEggCount}</Text>
          </View>
          <View style={styles.statLabelContainer}>
            <Text style={styles.statLabel}>이스터에그</Text>
          </View>
        </Pressable>

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
