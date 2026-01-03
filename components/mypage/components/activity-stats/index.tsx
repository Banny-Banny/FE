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

import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { FriendsModal } from './friends';
import { styles } from './styles';

export function ActivityStats() {
  const [isFriendsModalVisible, setIsFriendsModalVisible] = useState(false);

  const handleFriendsPress = () => {
    setIsFriendsModalVisible(true);
  };

  const handleCloseFriendsModal = () => {
    setIsFriendsModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        {/* 캡슐 통계 */}
        <View style={styles.statItem}>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>3</Text>
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
            <Text style={styles.statValue}>12</Text>
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
            <Text style={styles.statValue}>8</Text>
          </View>
          <View style={styles.statLabelContainer}>
            <Text style={styles.statLabel}>친구</Text>
          </View>
        </Pressable>
      </View>

      {/* 친구 관리 모달 */}
      <FriendsModal visible={isFriendsModalVisible} onClose={handleCloseFriendsModal} />
    </>
  );
}
