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

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { styles } from './styles';
import Icon from 'react-native-remix-icon';
import { Colors } from '@/commons/constants';
import { useRouter } from 'expo-router';
import UnlockedCapsuleDetail from './components/unlocked-capsule-detail';
import StepRoom from '@/components/timecapsule-create/components/step-room';

// Figma MCP에서 제공된 이미지 에셋 (localhost URL)
const imgIcon = 'http://localhost:3845/assets/c7f9e7fa4ec9d540e830ce95c2d2196964a7eeef.svg'; // 닫기 버튼
const imgIcon1 = 'http://localhost:3845/assets/a22c1af0ba98ba3fdfdf3f6a86abf8862eb407cb.svg'; // 친구 아이콘
const imgIcon2 = 'http://localhost:3845/assets/6b05fa5d2a4ba64ac1c1ca10dc30e5039ade8232.svg'; // 캘린더 아이콘
const imgIcon3 = 'http://localhost:3845/assets/5655b8070e93b88cf47e829b34d74978f64b73f5.svg'; // 시계 아이콘
const imgFrame = 'http://localhost:3845/assets/f2c7ed3d753e187512bcc1a7da523b7631750016.svg'; // 위치 아이콘
const imgFrame1 = 'http://localhost:3845/assets/f0053ac32eed9859e8321770ad0664138b0c5453.svg'; // 친구 아이콘
const imgFrame2 = 'http://localhost:3845/assets/2b987eacf04a4f9e11b4b721a230096c6899b0fc.svg'; // 캘린더 아이콘

export default function MyCapsule() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'opened' | 'locked'>('opened');
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<string | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isStepRoomVisible, setIsStepRoomVisible] = useState(false);
  const [stepRoomCapsuleId, setStepRoomCapsuleId] = useState<string | null>(null);

  const handleTabPress = (tab: 'opened' | 'locked') => {
    setActiveTab(tab);
  };

  const handleWaitingRoomPress = (capsuleId: string) => {
    setStepRoomCapsuleId(capsuleId);
    setIsStepRoomVisible(true);
  };

  const handleOpenedCapsulePress = (capsuleId: string) => {
    setSelectedCapsuleId(capsuleId);
    setIsDetailModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalVisible(false);
    setSelectedCapsuleId(null);
  };

  const handleCloseStepRoom = () => {
    setIsStepRoomVisible(false);
    setStepRoomCapsuleId(null);
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    }
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
          <Text style={styles.headerSubtitleText}>열린 캡슐 1개 · 잠긴 캡슐 2개</Text>
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
            <Text style={styles.sectionCountText}>3개</Text>
          </View>
        </View>

        {/* 가로 스크롤 카드 리스트 */}
        <View style={styles.horizontalScrollContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardListContainer}>
              {/* 카드 1 */}
              <TouchableOpacity
                style={styles.capsuleCard}
                onPress={() => handleWaitingRoomPress('capsule-1')}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>강동구 불주먹들👊</Text>
                  </View>
                </View>

                <View style={styles.cardProgressSection}>
                  <View style={styles.progressLabelRow}>
                    <View style={styles.progressLabel}>
                      <Text style={styles.progressLabelText}>진행 상황</Text>
                    </View>
                    <View style={styles.progressValue}>
                      <Text style={styles.progressValueText}>1/2</Text>
                    </View>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View style={styles.progressBarFill} />
                    </View>
                  </View>
                </View>

                <View style={styles.cardEggsSection}>
                  <View style={styles.eggIconGrey}>
                    <Text style={styles.eggEmoji}>🥚</Text>
                  </View>
                  <View style={styles.eggIconWhite}>
                    <Text style={styles.eggEmoji}>🥚</Text>
                  </View>
                </View>

                <View style={styles.cardTimeSection}>
                  <View style={styles.timeSectionContent}>
                    <View style={styles.timeLabel}>
                      <Text style={styles.timeLabelText}>남은 시간</Text>
                    </View>
                    <View style={styles.timeValue}>
                      <Text style={styles.timeValueText}>23시간 59분</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* 카드 2 */}
              <TouchableOpacity
                style={styles.capsuleCard}
                onPress={() => handleWaitingRoomPress('capsule-2')}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>졸업 추억</Text>
                  </View>
                  <View style={styles.cardEmojiContainer}>
                    <Text style={styles.cardEmoji}>⏰</Text>
                  </View>
                </View>

                <View style={styles.cardProgressSection}>
                  <View style={styles.progressLabelRow}>
                    <View style={styles.progressLabel}>
                      <Text style={styles.progressLabelText}>진행 상황</Text>
                    </View>
                    <View style={styles.progressValue}>
                      <Text style={styles.progressValueText}>2/3</Text>
                    </View>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View style={styles.progressBarFillLarge} />
                    </View>
                  </View>
                </View>

                <View style={styles.cardEggsSection}>
                  <View style={styles.eggIconGrey}>
                    <Text style={styles.eggEmoji}>🎓</Text>
                  </View>
                  <View style={styles.eggIconWhite}>
                    <Text style={styles.eggEmoji}>🎓</Text>
                  </View>
                  <View style={styles.eggIconWhite}>
                    <Text style={styles.eggEmoji}>🎓</Text>
                  </View>
                </View>

                <View style={styles.cardTimeSection}>
                  <View style={styles.timeSectionContent}>
                    <View style={styles.timeLabel}>
                      <Text style={styles.timeLabelText}>남은 시간</Text>
                    </View>
                    <View style={styles.timeValue}>
                      <Text style={styles.timeValueText}>18시간 30분</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* 카드 3 */}
              <TouchableOpacity
                style={styles.capsuleCard}
                onPress={() => handleWaitingRoomPress('capsule-3')}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>여름 캠핑</Text>
                  </View>
                  <View style={styles.cardEmojiContainer}>
                    <Text style={styles.cardEmoji}>⏰</Text>
                  </View>
                </View>

                <View style={styles.cardProgressSection}>
                  <View style={styles.progressLabelRow}>
                    <View style={styles.progressLabel}>
                      <Text style={styles.progressLabelText}>진행 상황</Text>
                    </View>
                    <View style={styles.progressValue}>
                      <Text style={styles.progressValueText}>1/4</Text>
                    </View>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View style={styles.progressBarFillSmall} />
                    </View>
                  </View>
                </View>

                <View style={styles.cardEggsSectionFour}>
                  <View style={styles.eggIconGrey}>
                    <Text style={styles.eggEmoji}>🏕️</Text>
                  </View>
                  <View style={styles.eggIconGrey}>
                    <Text style={styles.eggEmoji}>🏕️</Text>
                  </View>
                  <View style={styles.eggIconWhite}>
                    <Text style={styles.eggEmoji}>🏕️</Text>
                  </View>
                  <View style={styles.eggIconGrey}>
                    <Text style={styles.eggEmoji}>🏕️</Text>
                  </View>
                </View>

                <View style={styles.cardTimeSection}>
                  <View style={styles.timeSectionContent}>
                    <View style={styles.timeLabel}>
                      <Text style={styles.timeLabelText}>남은 시간</Text>
                    </View>
                    <View style={styles.timeValue}>
                      <Text style={styles.timeValueText}>12시간 15분</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* 탭 섹션 */}
      <View style={styles.tabContainer}>
        <View style={styles.tabInner}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabPress('opened')}>
            <View style={styles.tabTextContainer}>
              <Text
                style={
                  activeTab === 'opened' ? styles.tabTextActive : styles.tabTextInactive
                }>
                열린 캡슐 (1)
              </Text>
            </View>
            {activeTab === 'opened' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => handleTabPress('locked')}>
            <View style={styles.tabTextContainer}>
              <Text
                style={
                  activeTab === 'locked' ? styles.tabTextActive : styles.tabTextInactive
                }>
                잠긴 캡슐 (2)
              </Text>
            </View>
            {activeTab === 'locked' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* 열린 캡슐 리스트 섹션 */}
      {activeTab === 'opened' && (
        <ScrollView style={styles.lockedCapsulesSection}>
          <View style={styles.lockedCapsulesList}>
            {/* 열린 캡슐 카드 1 */}
            <TouchableOpacity
              style={styles.openedCapsuleCard}
              onPress={() => handleOpenedCapsulePress('opened-capsule-1')}>
              <View style={styles.openedCardContent}>
                <View style={styles.openedCardIcon}>
                  <Text style={styles.openedCardEmoji}>💊</Text>
                </View>
                <View style={styles.openedCardInfo}>
                  <View style={styles.openedCardTitleContainer}>
                    <Text style={styles.openedCardTitle}>2024 추억 타임캡슐</Text>
                  </View>
                  <View style={styles.openedCardDetails}>
                    <View style={styles.openedCardDetailRow}>
                      <Image source={{ uri: imgFrame }} style={styles.openedCardDetailIcon} />
                      <Text style={styles.openedCardDetailText}>서울 강남역</Text>
                    </View>
                    <View style={styles.openedCardDetailRow}>
                      <Image source={{ uri: imgFrame1 }} style={styles.openedCardDetailIcon} />
                      <Text style={styles.openedCardDetailText}>김민수, 박지은, 이준호</Text>
                    </View>
                    <View style={styles.openedCardDetailRow}>
                      <Image source={{ uri: imgFrame2 }} style={styles.openedCardDetailIcon} />
                      <Text style={styles.openedCardDetailText}>2025-01-01</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* 열린 캡슐 카드 2 */}
            <TouchableOpacity
              style={styles.openedCapsuleCard}
              onPress={() => handleOpenedCapsulePress('opened-capsule-2')}>
              <View style={styles.openedCardContent}>
                <View style={styles.openedCardIcon}>
                  <Text style={styles.openedCardEmoji}>🎂</Text>
                </View>
                <View style={styles.openedCardInfo}>
                  <View style={styles.openedCardTitleContainer}>
                    <Text style={styles.openedCardTitle}>2023 생일 파티</Text>
                  </View>
                  <View style={styles.openedCardDetails}>
                    <View style={styles.openedCardDetailRow}>
                      <Image source={{ uri: imgFrame }} style={styles.openedCardDetailIcon} />
                      <Text style={styles.openedCardDetailText}>서울 이태원</Text>
                    </View>
                    <View style={styles.openedCardDetailRow}>
                      <Image source={{ uri: imgFrame1 }} style={styles.openedCardDetailIcon} />
                      <Text style={styles.openedCardDetailText}>이수진, 정민호</Text>
                    </View>
                    <View style={styles.openedCardDetailRow}>
                      <Image source={{ uri: imgFrame2 }} style={styles.openedCardDetailIcon} />
                      <Text style={styles.openedCardDetailText}>2024-06-15</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* 열린 캡슐 카드 3 */}
            <TouchableOpacity
              style={styles.openedCapsuleCard}
              onPress={() => handleOpenedCapsulePress('opened-capsule-3')}>
              <View style={styles.openedCardContent}>
                <View style={styles.openedCardIcon}>
                  <Text style={styles.openedCardEmoji}>🎓</Text>
                </View>
                <View style={styles.openedCardInfo}>
                  <View style={styles.openedCardTitleContainer}>
                    <Text style={styles.openedCardTitle}>대학 졸업식</Text>
                  </View>
                  <View style={styles.openedCardDetails}>
                    <View style={styles.openedCardDetailRow}>
                      <Image source={{ uri: imgFrame }} style={styles.openedCardDetailIcon} />
                      <Text style={styles.openedCardDetailText}>서울대학교</Text>
                    </View>
                    <View style={styles.openedCardDetailRow}>
                      <Image source={{ uri: imgFrame1 }} style={styles.openedCardDetailIcon} />
                      <Text style={styles.openedCardDetailText}>전체 동기들</Text>
                    </View>
                    <View style={styles.openedCardDetailRow}>
                      <Image source={{ uri: imgFrame2 }} style={styles.openedCardDetailIcon} />
                      <Text style={styles.openedCardDetailText}>2024-02-28</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* 잠긴 캡슐 리스트 섹션 */}
      {activeTab === 'locked' && (
        <ScrollView style={styles.lockedCapsulesSection}>
        <View style={styles.lockedCapsulesList}>
          {/* 잠긴 캡슐 카드 1 */}
          <View style={styles.lockedCapsuleCard}>
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
                    <Text style={styles.lockedCardTitle}>졸업 여행</Text>
                  </View>
                    <View style={styles.lockedCardDetails}>
                      <View style={styles.lockedCardDetailRow}>
                        <Image source={{ uri: imgFrame }} style={styles.lockedCardDetailIcon} />
                        <View style={styles.lockedCardDetailText}>
                          <Text style={styles.lockedCardDetailTextContent}>제주도</Text>
                        </View>
                      </View>
                      <View style={styles.lockedCardDetailRow}>
                        <Image source={{ uri: imgFrame1 }} style={styles.lockedCardDetailIcon} />
                        <View style={styles.lockedCardDetailText}>
                          <Text style={styles.lockedCardDetailTextContent}>박서준, 최유나</Text>
                        </View>
                      </View>
                      <View style={styles.lockedCardDetailRow}>
                        <Image source={{ uri: imgFrame2 }} style={styles.lockedCardDetailIcon} />
                        <View style={styles.lockedCardDetailText}>
                          <Text style={styles.lockedCardDetailTextContent}>2025-12-31</Text>
                        </View>
                      </View>
                    </View>
                </View>
              </View>
            </View>
            <View style={styles.lockedCardFooter}>
              <Image source={{ uri: imgIcon3 }} style={styles.lockedCardFooterIcon} />
              <View style={styles.lockedCardFooterText}>
                <Text style={styles.lockedCardFooterTextContent}>D-350일 남음</Text>
              </View>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>잠김</Text>
              </View>
            </View>
          </View>

          {/* 잠긴 캡슐 카드 2 */}
          <View style={styles.lockedCapsuleCard}>
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
                    <Text style={styles.lockedCardTitle}>생일 파티</Text>
                  </View>
                    <View style={styles.lockedCardDetails}>
                      <View style={styles.lockedCardDetailRow}>
                        <Image source={{ uri: imgFrame }} style={styles.lockedCardDetailIcon} />
                        <View style={styles.lockedCardDetailText}>
                          <Text style={styles.lockedCardDetailTextContent}>서울 홍대</Text>
                        </View>
                      </View>
                      <View style={styles.lockedCardDetailRow}>
                        <Image source={{ uri: imgFrame1 }} style={styles.lockedCardDetailIcon} />
                        <View style={styles.lockedCardDetailText}>
                          <Text style={styles.lockedCardDetailTextContent}>김민수</Text>
                        </View>
                      </View>
                      <View style={styles.lockedCardDetailRow}>
                        <Image source={{ uri: imgFrame2 }} style={styles.lockedCardDetailIcon} />
                        <View style={styles.lockedCardDetailText}>
                          <Text style={styles.lockedCardDetailTextContent}>2025-03-15</Text>
                        </View>
                      </View>
                    </View>
                </View>
              </View>
            </View>
            <View style={styles.lockedCardFooter}>
              <Image source={{ uri: imgIcon3 }} style={styles.lockedCardFooterIcon} />
              <View style={styles.lockedCardFooterText}>
                <Text style={styles.lockedCardFooterTextContent}>D-89일 남음</Text>
              </View>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>잠김</Text>
              </View>
            </View>
          </View>

          {/* 잠긴 캡슐 카드 3 */}
          <View style={styles.lockedCapsuleCard}>
            <View style={styles.lockedCardImageContainer}>
              <View style={styles.lockedCardGradient} />
              <View style={styles.lockedCardContent}>
                <View style={styles.lockedCardIcon}>
                  <View style={styles.lockedCardIconText}>
                    <Text style={styles.lockedCardEmoji}>🏖️</Text>
                  </View>
                </View>
                <View style={styles.lockedCardInfo}>
                  <View style={styles.lockedCardTitleContainer}>
                    <Text style={styles.lockedCardTitle}>여름 바다 여행</Text>
                  </View>
                  <View style={styles.lockedCardDetails}>
                    <View style={styles.lockedCardDetailRow}>
                      <Image source={{ uri: imgFrame }} style={styles.lockedCardDetailIcon} />
                      <View style={styles.lockedCardDetailText}>
                        <Text style={styles.lockedCardDetailTextContent}>부산 해운대</Text>
                      </View>
                    </View>
                    <View style={styles.lockedCardDetailRow}>
                      <Image source={{ uri: imgFrame1 }} style={styles.lockedCardDetailIcon} />
                      <View style={styles.lockedCardDetailText}>
                        <Text style={styles.lockedCardDetailTextContent}>최지훈, 한소영</Text>
                      </View>
                    </View>
                    <View style={styles.lockedCardDetailRow}>
                      <Image source={{ uri: imgFrame2 }} style={styles.lockedCardDetailIcon} />
                      <View style={styles.lockedCardDetailText}>
                        <Text style={styles.lockedCardDetailTextContent}>2025-07-20</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.lockedCardFooter}>
              <Image source={{ uri: imgIcon3 }} style={styles.lockedCardFooterIcon} />
              <View style={styles.lockedCardFooterText}>
                <Text style={styles.lockedCardFooterTextContent}>D-195일 남음</Text>
              </View>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>잠김</Text>
              </View>
            </View>
          </View>

          {/* 잠긴 캡슐 카드 4 */}
          <View style={styles.lockedCapsuleCard}>
            <View style={styles.lockedCardImageContainer}>
              <View style={styles.lockedCardGradient} />
              <View style={styles.lockedCardContent}>
                <View style={styles.lockedCardIcon}>
                  <View style={styles.lockedCardIconText}>
                    <Text style={styles.lockedCardEmoji}>🎄</Text>
                  </View>
                </View>
                <View style={styles.lockedCardInfo}>
                  <View style={styles.lockedCardTitleContainer}>
                    <Text style={styles.lockedCardTitle}>크리스마스 파티</Text>
                  </View>
                  <View style={styles.lockedCardDetails}>
                    <View style={styles.lockedCardDetailRow}>
                      <Image source={{ uri: imgFrame }} style={styles.lockedCardDetailIcon} />
                      <View style={styles.lockedCardDetailText}>
                        <Text style={styles.lockedCardDetailTextContent}>서울 강남</Text>
                      </View>
                    </View>
                    <View style={styles.lockedCardDetailRow}>
                      <Image source={{ uri: imgFrame1 }} style={styles.lockedCardDetailIcon} />
                      <View style={styles.lockedCardDetailText}>
                        <Text style={styles.lockedCardDetailTextContent}>김태영, 박서연</Text>
                      </View>
                    </View>
                    <View style={styles.lockedCardDetailRow}>
                      <Image source={{ uri: imgFrame2 }} style={styles.lockedCardDetailIcon} />
                      <View style={styles.lockedCardDetailText}>
                        <Text style={styles.lockedCardDetailTextContent}>2025-12-25</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.lockedCardFooter}>
              <Image source={{ uri: imgIcon3 }} style={styles.lockedCardFooterIcon} />
              <View style={styles.lockedCardFooterText}>
                <Text style={styles.lockedCardFooterTextContent}>D-353일 남음</Text>
              </View>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>잠김</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      )}

      {/* 열린 캡슐 상세 모달 */}
      <UnlockedCapsuleDetail visible={isDetailModalVisible} onClose={handleCloseModal} />

      {/* 캡슐 대기실 (StepRoom) */}
      {isStepRoomVisible && stepRoomCapsuleId && (
        <StepRoom
          role="host"
          capsuleId={stepRoomCapsuleId}
          onSubmit={handleCloseStepRoom}
        />
      )}
    </View>
  );
}
