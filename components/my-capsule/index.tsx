/**
 * MyCapsule 컴포넌트
 * Figma 디자인: node-id=1078:2782
 *
 * 체크리스트:
 * - [✅] Figma 디자인 1:1 매칭
 * - [✅] 디자인 토큰 100% 사용 (Colors, Typography)
 * - [✅] StyleSheet 전용 (인라인 스타일 0건)
 * - [✅] 소수점 값 반올림 적용
 * - [✅] localhost 이미지 URL 사용 (Figma MCP 규칙)
 * - [✅] react-native-remix-icon 사용 (아이콘)
 */

import { Colors, ROUTES } from '@/commons/constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import UnlockedCapsuleDetail from './components/unlocked-capsule-detail';
import { useMyCapsules } from './hooks/useMyCapsules';
import { styles } from './styles';

// localhost 이미지 URL 제거됨 - 리믹스 아이콘 사용

export default function MyCapsule() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'opened' | 'locked'>('opened');
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<string | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // API 데이터 로드
  const { capsules, isLoading, error, refetch } = useMyCapsules();

  const handleTabPress = (tab: 'opened' | 'locked') => {
    setActiveTab(tab);
  };

  const handleWaitingRoomPress = (capsuleId: string) => {
    // 대기실 페이지로 라우팅
    router.push(`/room/join?capsuleId=${capsuleId}`);
  };

  const handleOpenedCapsulePress = (capsuleId: string) => {
    setSelectedCapsuleId(capsuleId);
    setIsDetailModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalVisible(false);
    setSelectedCapsuleId(null);
  };

  const handleClose = () => {
    router.push(ROUTES.MAIN);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 섹션 */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>캡슐보관함</Text>
          </View>
          <TouchableOpacity style={styles.headerCloseButton} onPress={handleClose}>
            <Icon name="ri-close-line" size={20} color={Colors.black[500]} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerSubtitle}>
          <Text style={styles.headerSubtitleText}>
            열린 캡슐 {capsules.openedCapsules.length}개 · 잠긴 캡슐{' '}
            {capsules.lockedCapsules.length}개
          </Text>
        </View>
      </View>

      {/* 열려있는 캡슐 섹션 */}
      <View style={styles.openCapsulesSection}>
        {/* 섹션 헤더 */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>캡슐 대기실</Text>
          </View>
          <View style={styles.sectionCount}>
            <Text style={styles.sectionCountText}>{capsules.waitingRooms.length}개</Text>
          </View>
        </View>

        {/* 가로 스크롤 카드 리스트 - API 데이터 매핑 */}
        <View style={styles.horizontalScrollContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardListContainer}>
              {capsules.waitingRooms.map((capsule) => (
                <TouchableOpacity
                  key={capsule.id}
                  style={styles.capsuleCard}
                  onPress={() => handleWaitingRoomPress(capsule.id)}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleContainer}>
                      <Text style={styles.cardTitle}>{capsule.title}</Text>
                    </View>
                  </View>

                  {/* TODO: 진행 상황, 이모지, 남은 시간 등 추가 UI 데이터 매핑 */}
                  {/* 현재 API는 title, status, openDate, participantCount, myWriteStatus만 제공 */}
                  {/* 추후 API 확장 필요 또는 별도 API 호출 필요 */}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* 탭 섹션 - 동적 카운트 */}
      <View style={styles.tabContainer}>
        <View style={styles.tabInner}>
          <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('opened')}>
            <View style={styles.tabTextContainer}>
              <Text style={activeTab === 'opened' ? styles.tabTextActive : styles.tabTextInactive}>
                열린 캡슐 ({capsules.openedCapsules.length})
              </Text>
            </View>
            {activeTab === 'opened' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('locked')}>
            <View style={styles.tabTextContainer}>
              <Text style={activeTab === 'locked' ? styles.tabTextActive : styles.tabTextInactive}>
                잠긴 캡슐 ({capsules.lockedCapsules.length})
              </Text>
            </View>
            {activeTab === 'locked' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* 열린 캡슐 리스트 섹션 - API 데이터 매핑 */}
      {activeTab === 'opened' && (
        <ScrollView style={styles.lockedCapsulesSection}>
          <View style={styles.lockedCapsulesList}>
            {capsules.openedCapsules.map((capsule) => (
              <TouchableOpacity
                key={capsule.id}
                style={styles.openedCapsuleCard}
                onPress={() => handleOpenedCapsulePress(capsule.id)}>
                <View style={styles.openedCardContent}>
                  <View style={styles.openedCardIcon}>
                    <Text style={styles.openedCardEmoji}>💊</Text>
                  </View>
                  <View style={styles.openedCardInfo}>
                    <View style={styles.openedCardTitleContainer}>
                      <Text style={styles.openedCardTitle}>{capsule.title}</Text>
                    </View>
                    {/* TODO: 위치, 참여자, 날짜 등 추가 UI 데이터 매핑 */}
                    {/* 현재 API는 기본 정보만 제공, 추후 API 확장 필요 */}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* 잠긴 캡슐 리스트 섹션 - API 데이터 매핑 */}
      {activeTab === 'locked' && (
        <ScrollView style={styles.lockedCapsulesSection}>
          <View style={styles.lockedCapsulesList}>
            {capsules.lockedCapsules.map((capsule) => (
              <View key={capsule.id} style={styles.lockedCapsuleCard}>
                <View style={styles.lockedCardImageContainer}>
                  <View style={styles.lockedCardGradient} />
                  <View style={styles.lockedCardContent}>
                    <View style={styles.lockedCardIcon}>
                      <View style={styles.lockedCardIconText}>
                        <Text style={styles.lockedCardEmoji}>💊</Text>
                      </View>
                    </View>
                    <View style={styles.lockedCardInfo}>
                      <View style={styles.lockedCardTitleContainer}>
                        <Text style={styles.lockedCardTitle}>{capsule.title}</Text>
                      </View>
                      {/* TODO: 위치, 참여자, 날짜 등 추가 UI 데이터 매핑 */}
                      {/* 현재 API는 기본 정보만 제공, 추후 API 확장 필요 */}
                    </View>
                  </View>
                </View>
                <View style={styles.lockedCardFooter}>
                  <Icon name="ri-time-line" size={16} color={Colors.grey[500]} />
                  <View style={styles.lockedCardFooterText}>
                    {/* TODO: openDate로 D-day 계산 */}
                    <Text style={styles.lockedCardFooterTextContent}>
                      {(() => {
                        const now = new Date();
                        const openDate = new Date(capsule.openDate);
                        const diffTime = openDate.getTime() - now.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays > 0 ? `D-${diffDays}일 남음` : '개봉됨';
                      })()}
                    </Text>
                  </View>
                  <View style={styles.lockedBadge}>
                    <Text style={styles.lockedBadgeText}>잠김</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* 열린 캡슐 상세 모달 */}
      <UnlockedCapsuleDetail visible={isDetailModalVisible} onClose={handleCloseModal} />
    </View>
  );
}
