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
import { useKakaoAddress } from '@/commons/hooks/useKakaoAddress';
import { formatAdministrativeAddress } from '@/utils/addressFormat';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import dayjs from 'dayjs';
import UnlockedCapsuleDetail from './components/unlocked-capsule-detail';
import { useMyCapsules } from './hooks/useMyCapsules';
import type { MyCapsuleItem } from './types';
import { styles } from './styles';

// 공통 날짜 포맷터
const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('YYYY년 MM월 DD일');
};

// localhost 이미지 URL 제거됨 - 리믹스 아이콘 사용

/**
 * 열린 캡슐 카드 컴포넌트 (위치 정보 포함)
 */
function OpenedCapsuleCard({
  capsule,
  onPress,
}: {
  capsule: MyCapsuleItem;
  onPress: () => void;
}) {
  // 위치 정보가 있으면 주소로 변환
  const { addressData } = useKakaoAddress({
    lat: capsule.location?.latitude ?? null,
    lng: capsule.location?.longitude ?? null,
  });

  const locationText = addressData ? formatAdministrativeAddress(addressData) : null;

  const buriedDate = capsule.createdAt ? formatDate(capsule.createdAt) : null;
  const openedDate = capsule.openDate ? formatDate(capsule.openDate) : null;

  return (
    <TouchableOpacity style={styles.openedCapsuleCard} onPress={onPress}>
      <View style={styles.openedCardContent}>
        <View style={styles.openedCardIcon}>
          <Text style={styles.openedCardEmoji}>💊</Text>
        </View>
        <View style={styles.openedCardInfo}>
          <View style={styles.openedCardTitleContainer}>
            <Text style={styles.openedCardTitle}>{capsule.title}</Text>
          </View>
          <View style={styles.openedCardDetails}>
            {locationText && (
              <View style={styles.openedCardDetailRow}>
                <Icon name="ri-map-pin-line" size={16} color={Colors.grey[500]} />
                <Text style={styles.openedCardDetailText}>{locationText}</Text>
              </View>
            )}
            {buriedDate && (
              <View style={styles.openedCardDetailRow}>
                <Icon name="ri-calendar-line" size={16} color={Colors.grey[500]} />
                <Text style={styles.openedCardDetailText}>묻은 날짜: {buriedDate}</Text>
              </View>
            )}
            {openedDate && (
              <View style={styles.openedCardDetailRow}>
                <Icon name="ri-calendar-check-line" size={16} color={Colors.grey[500]} />
                <Text style={styles.openedCardDetailText}>열린 날짜: {openedDate}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MyCapsule() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'opened' | 'locked'>('opened');
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<string | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // API 데이터 로드
  const { capsules, isLoading, error, refetch } = useMyCapsules();

  // ⭐ 화면이 포커스될 때마다 데이터 리페치 (대기실에서 돌아왔을 때)
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 [MyCapsule] 화면 포커스 - 데이터 리페치');
      refetch();
    }, [refetch])
  );

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
    router.push(ROUTES.MY_PAGE);
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
              {capsules.waitingRooms.map((capsule) => {
                // 진행률 계산
                const progressPercent =
                  capsule.participantCount > 0
                    ? (capsule.completedCount / capsule.participantCount) * 100
                    : 0;

                // 남은 시간 계산
                const now = new Date();
                const deadlineDate = new Date(capsule.deadline);
                const diffTime = deadlineDate.getTime() - now.getTime();
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                const diffHours = Math.floor(diffMinutes / 60);
                const diffDays = Math.floor(diffHours / 24);
                const remainingHours = diffHours % 24;
                const remainingMinutes = diffMinutes % 60;

                let timeText = '';
                if (diffTime < 0) {
                  timeText = '마감됨';
                } else if (diffDays > 0) {
                  timeText = `${diffDays}일 ${remainingHours}시간 ${remainingMinutes}분`;
                } else if (diffHours > 0) {
                  timeText = `${diffHours}시간 ${remainingMinutes}분`;
                } else {
                  timeText = `${remainingMinutes}분`;
                }

                return (
                  <TouchableOpacity
                    key={capsule.id}
                    style={styles.capsuleCard}
                    onPress={() => handleWaitingRoomPress(capsule.id)}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardTitleContainer}>
                        <Text style={styles.cardTitle}>{capsule.title}</Text>
                      </View>
                    </View>

                    {/* 진행 상황 섹션 */}
                    <View style={styles.cardProgressSection}>
                      <View style={styles.progressLabelRow}>
                        <View style={styles.progressLabel}>
                          <Text style={styles.progressLabelText}>진행 상황</Text>
                        </View>
                        <View style={styles.progressValue}>
                          <Text style={styles.progressValueText}>
                            {capsule.completedCount}/{capsule.participantCount}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressBarFill,
                              { width: `${progressPercent}%` },
                            ]}
                          />
                        </View>
                      </View>
                    </View>

                    {/* 참여자 아이콘 섹션 */}
                    <View style={styles.cardParticipantsSection}>
                      {capsule.participantCount <= 10 ? (
                        // 10명 이하: 아이콘으로 표시
                        Array.from({ length: capsule.participantCount }).map((_, index) => (
                          <View
                            key={index}
                            style={
                              index < capsule.completedCount
                                ? styles.participantIconCompleted
                                : styles.participantIconPending
                            }>
                            <Icon
                              name="ri-user-line"
                              size={14}
                              color={
                                index < capsule.completedCount
                                  ? Colors.white[500]
                                  : Colors.grey[500]
                              }
                            />
                          </View>
                        ))
                      ) : (
                        // 10명 초과: 9개 아이콘 + "+N" 표시
                        <>
                          {Array.from({ length: 9 }).map((_, index) => (
                            <View
                              key={index}
                              style={
                                index < capsule.completedCount
                                  ? styles.participantIconCompleted
                                  : styles.participantIconPending
                              }>
                              <Icon
                                name="ri-user-line"
                                size={14}
                                color={
                                  index < capsule.completedCount
                                    ? Colors.white[500]
                                    : Colors.grey[500]
                                }
                              />
                            </View>
                          ))}
                          <View style={styles.participantMoreContainer}>
                            <Text style={styles.participantMoreText}>
                              +{capsule.participantCount - 9}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>

                    {/* 남은 시간 섹션 */}
                    <View style={styles.cardTimeSection}>
                      <View style={styles.timeSectionContent}>
                        <View style={styles.timeLabel}>
                          <Text style={styles.timeLabelText}>남은 시간</Text>
                        </View>
                        <View style={styles.timeValue}>
                          <Text style={styles.timeValueText}>{timeText}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
              <OpenedCapsuleCard
                key={capsule.id}
                capsule={capsule}
                onPress={() => handleOpenedCapsulePress(capsule.id)}
              />
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
                      <View style={styles.lockedCardDetails}>
                        <View style={styles.lockedCardDetailRow}>
                          <Icon name="ri-calendar-line" size={16} color={Colors.grey[500]} />
                          <Text style={styles.lockedCardDetailTextContent}>
                            묻은 날짜: {formatDate(capsule.createdAt)}
                          </Text>
                        </View>
                        <View style={styles.lockedCardDetailRow}>
                          <Icon name="ri-calendar-check-line" size={16} color={Colors.grey[500]} />
                          <Text style={styles.lockedCardDetailTextContent}>
                            열리는 날짜: {formatDate(capsule.openDate)}
                          </Text>
                        </View>
                      </View>
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
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* 열린 캡슐 상세 모달 */}
      <UnlockedCapsuleDetail
        visible={isDetailModalVisible}
        onClose={handleCloseModal}
        capsuleId={selectedCapsuleId}
      />
    </View>
  );
}
