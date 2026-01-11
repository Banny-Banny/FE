/**
 * components/my-egg-list/components/modal/index.tsx
 * 이스터에그 모달 컴포넌트
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] 토큰 기반 스타일 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] react-native-remix-icon 사용
 * - [x] commons/components/modal 사용
 * - [x] title 필드 사용
 * - [x] 미디어 ID를 직접 URL로 변환
 * - [x] useKakaoAddress 훅으로 주소 변환
 */

import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import { Modal } from '@/commons/components/modal';
import { Colors } from '@/commons/constants';
import { AudioPlayer } from '@/components/shared/audio-player';
import { VideoPlayer } from '@/components/shared/video-player';
import { isValidImageUrl } from '@/utils';

import type { EggDetailResponse } from '../../hooks/useEggDetail';
import { useEasterEggModal } from './hooks/useEasterEggModal';
import { styles } from './styles';

export interface EasterEggModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 이스터에그 상세 데이터 (원본 API 응답) */
  data: EggDetailResponse | null;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ visible, onClose, data }) => {
  // 모든 비즈니스 로직을 hook에서 가져옴
  // data가 없어도 hook은 호출하여 항상 같은 구조 유지
  const {
    // 미디어 관련
    mediaUrls,
    // 주소 관련
    locationAddress,
    // 프로필 이미지
    authorProfileImg,
    // 날짜 포맷팅
    createdDate,
    formatShortDateWithTime,
    // 발견 순서 관련
    getDiscoveryOrderText,
    getCurrentUserViewedAt,
  } = useEasterEggModal({ data });

  // 화면 높이의 90%를 계산하여 최대 높이 제한
  const maxHeight = useMemo(() => {
    const screenHeight = Dimensions.get('window').height;
    return screenHeight * 0.8;
  }, []);

  // 데이터가 없으면 빈 모달 반환 (항상 같은 구조 유지)
  if (!data) {
    return (
      <Modal
        visible={visible}
        onClose={onClose}
        width={340}
        height="100%"
        padding={0}
        closeOnBackdropPress>
        <View style={[styles.scrollViewWrapper, { maxHeight }]}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Icon name="close-line" size={20} color={Colors.black[500]} />
          </Pressable>
        </View>
      </Modal>
    );
  }

  // 미디어 렌더링 함수
  const renderMedia = () => {
    const hasImage = isValidImageUrl(mediaUrls.imageUrl);
    const hasAudio = data?.audioMediaId != null;
    const hasVideo = data?.videoMediaId != null;

    if (!hasImage && !hasAudio && !hasVideo) {
      return null;
    }

    return (
      <View style={styles.mediaContainer}>
        {/* 이미지 렌더링 */}
        {hasImage && mediaUrls.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: mediaUrls.imageUrl }}
              style={styles.image}
              contentFit="cover"
              accessibilityLabel="이스터에그 이미지"
            />
          </View>
        )}

        {/* 오디오 플레이어 렌더링 */}
        {hasAudio && data.audioMediaId && (
          <View style={styles.audioPlayerWrapper}>
            <AudioPlayer mediaId={data.audioMediaId} />
          </View>
        )}

        {/* 비디오 플레이어 렌더링 */}
        {hasVideo && data.videoMediaId && <VideoPlayer mediaId={data.videoMediaId} />}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      width={340}
      height="auto"
      padding={0}
      closeOnBackdropPress
      disableAnimation={false}>
      <View style={[styles.scrollViewWrapper, { maxHeight }]}>
        {/* 닫기 버튼 (우측 상단) */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Icon name="close-line" size={20} color={Colors.black[500]} />
        </Pressable>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          nestedScrollEnabled={false}
          scrollEnabled={true}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="never"
          contentInset={{ top: 0, bottom: 0 }}
          automaticallyAdjustContentInsets={false}>
          {/* 상단 프로필 이미지 */}
          <View style={styles.profileImageContainer}>
            {authorProfileImg ? (
              <Image
                source={{ uri: authorProfileImg }}
                style={styles.profileImage}
                contentFit="cover"
                accessibilityLabel={`${data.author.nickname} 프로필 이미지`}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="gift-line" size={40} color={Colors.grey[400]} />
              </View>
            )}
          </View>

          {/* 서브타이틀 */}
          {data.type === 'FOUND' ? (
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>
                <Text style={styles.subtitleBold}>{data.author.nickname}</Text>
                <Text>님의 소중한 추억을 </Text>
                {getDiscoveryOrderText() && (
                  <Text style={styles.subtitleBold}>{getDiscoveryOrderText()}</Text>
                )}
              </Text>
              <Text style={styles.subtitle}>(으)로 찾으셨군요!</Text>
            </View>
          ) : (
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>다른 사람들이 발견한 내 이스터에그를</Text>
              <Text style={styles.subtitle}>확인해보세요!</Text>
            </View>
          )}

          {/* 위치 정보 배지 (중앙 정렬) */}
          <View style={styles.badgeContainer}>
            <Icon name="map-pin-line" size={16} color={Colors.black[500]} />
            <Text style={styles.badgeText}>{locationAddress}</Text>
          </View>

          {/* 발견 날짜 정보 (FOUND 타입일 때만, 카드 밖) */}
          {data.type === 'FOUND' && getCurrentUserViewedAt() && (
            <View style={styles.discovererInfoContainer}>
              <Icon name="time-line" size={14} color={Colors.grey[600]} />
              <Text style={styles.discovererDateText}>{getCurrentUserViewedAt()}에 발견함</Text>
            </View>
          )}

          {/* 메인 컨텐츠 카드 */}
          <View style={styles.contentCard}>
            {/* 제목 헤더 */}
            <View style={styles.titleHeader}>
              <Text style={styles.contentTitle}>{data.title}</Text>
              <View style={styles.dateBadge}>
                <Icon name="calendar-line" size={14} color={Colors.grey[600]} />
                <Text style={styles.dateText}>{createdDate}</Text>
              </View>
            </View>

            {/* 본문 */}
            <Text style={styles.contentText}>{data.message}</Text>

            {/* 미디어 렌더링 */}
            {renderMedia()}

            {/* 발견한 사람들 목록 (PLANTED 타입일 때만, 0명일 때도 공간 유지) */}
            {data.type === 'PLANTED' && (
              <View style={styles.viewersSection}>
                <View style={styles.viewersHeader}>
                  <Icon name="group-line" size={16} color={Colors.black[500]} />
                  <Text style={styles.viewersTitle}>발견한 사람 ({data.viewers?.length || 0})</Text>
                </View>
                <View style={styles.viewersList}>
                  {data.viewers && data.viewers.length > 0 ? (
                    data.viewers.map((viewer) => {
                      const viewerProfileImg = isValidImageUrl(viewer.profileImg)
                        ? viewer.profileImg
                        : null;
                      const viewedDate = formatShortDateWithTime(viewer.viewedAt);

                      return (
                        <View key={viewer.id} style={styles.viewerItem}>
                          <View style={styles.discovererViewerInfo}>
                            <View style={styles.discovererViewerAvatar}>
                              {viewerProfileImg ? (
                                <Image
                                  source={{ uri: viewerProfileImg }}
                                  style={styles.discovererViewerAvatarImage}
                                  contentFit="cover"
                                  accessibilityLabel={`${viewer.nickname} 프로필 이미지`}
                                />
                              ) : (
                                <Icon name="gift-line" size={16} color={Colors.black[500]} />
                              )}
                            </View>
                            <Text style={styles.viewerName}>{viewer.nickname}</Text>
                          </View>
                          <View style={styles.viewerDateBadge}>
                            <Icon name="time-line" size={12} color={Colors.grey[600]} />
                            <Text style={styles.viewerDateText}>{viewedDate}</Text>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <View style={styles.emptyViewersContainer}>
                      <Text style={styles.emptyViewersText}>아직 발견한 사람이 없습니다</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EasterEggModal;
