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

import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import { Modal } from '@/commons/components/modal';
import { Colors } from '@/commons/constants';
import type { MediaType } from '@/commons/constants/media';
import { useKakaoAddress } from '@/commons/hooks/useKakaoAddress';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { AudioPlayer } from '@/components/shared/audio-player';
import { getMediaUrl, isValidImageUrl } from '@/utils';
import { formatRoadAddress } from '@/utils/addressFormat';

import type { EggDetailResponse } from '../../hooks/useEggDetail';
import { styles } from './styles';

export interface EasterEggModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 이스터에그 상세 데이터 (원본 API 응답) */
  data: EggDetailResponse | null;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ visible, onClose, data }) => {
  // 현재 사용자 정보
  const { user } = useAuth();

  // 오디오 재생 상태 관리
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 비디오 재생 상태 관리
  const videoRef = useRef<Video>(null);

  // 미디어 URL 상태 관리 (미디어 ID를 URL로 변환)
  const [mediaUrls, setMediaUrls] = useState<{
    imageUrl: string | null;
    audioUrl: string | null;
    videoUrl: string | null;
  }>({
    imageUrl: null,
    audioUrl: null,
    videoUrl: null,
  });

  // 미디어 ID를 URL로 변환
  useEffect(() => {
    if (!data) {
      setMediaUrls({
        imageUrl: null,
        audioUrl: null,
        videoUrl: null,
      });
      return;
    }

    const fetchMediaUrls = async () => {
      try {
        const [imageUrl, audioUrl, videoUrl] = await Promise.all([
          data.imageMediaId
            ? getMediaUrl(data.imageMediaId).catch(() => null)
            : Promise.resolve(null),
          data.audioMediaId
            ? getMediaUrl(data.audioMediaId).catch(() => null)
            : Promise.resolve(null),
          data.videoMediaId
            ? getMediaUrl(data.videoMediaId).catch(() => null)
            : Promise.resolve(null),
        ]);

        setMediaUrls({ imageUrl, audioUrl, videoUrl });
      } catch (error) {
        if (__DEV__) {
          console.error('[EasterEggModal] 미디어 URL 변환 실패:', error);
        }
        setMediaUrls({
          imageUrl: null,
          audioUrl: null,
          videoUrl: null,
        });
      }
    };

    fetchMediaUrls();
  }, [data]);

  // 주소 변환 (useKakaoAddress 훅 사용)
  const { addressData: kakaoAddressData, isLoading: isAddressLoading } = useKakaoAddress({
    lat: data?.location.latitude ?? null,
    lng: data?.location.longitude ?? null,
  });

  // 주소 결정: location.address가 있으면 우선 사용, 없으면 카카오 주소 변환 결과 사용
  const locationAddress =
    data?.location.address ||
    (kakaoAddressData ? formatRoadAddress(kakaoAddressData) : null) ||
    '위치 정보 없음';

  // 데이터가 없으면 렌더링하지 않음
  if (!data) {
    return null;
  }

  // 프로필 이미지 URL 유효성 검사
  const authorProfileImg = isValidImageUrl(data.author.profileImg) ? data.author.profileImg : null;

  // 날짜 포맷팅 (MM.DD 형식)
  const formatShortDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };

  const createdDate = formatShortDate(data.createdAt);
  const foundDate = data.type === 'FOUND' && data.foundAt ? formatShortDate(data.foundAt) : null;

  // 발견 순서에 따른 배지 텍스트 (FOUND 타입일 때만)
  // viewers 배열의 인덱스를 기반으로 몇 번째 발견자인지 판단
  const getBadgeText = (): string | null => {
    if (data.type === 'FOUND' && data.viewers && data.viewers.length > 0 && user?.id) {
      // 현재 사용자가 viewers 배열의 어느 인덱스에 있는지 찾기
      const currentUserIndex = data.viewers.findIndex((viewer) => viewer.id === user.id);

      // 현재 사용자가 viewers 배열에 없으면 null 반환
      if (currentUserIndex === -1) {
        return null;
      }

      const maxViewCount = data.discoveredCount || 3;

      // viewers[0] = 첫 번째 발견자
      // viewers[1] = 두 번째 발견자
      // viewers[2] = 마지막 발견자 (discoveredCount가 3인 경우)
      if (currentUserIndex === 0) {
        return '첫 번째 발견자';
      }
      if (currentUserIndex === 1) {
        return '두 번째 발견자';
      }
      if (currentUserIndex === maxViewCount - 1) {
        return '마지막 발견자';
      }
      return `${currentUserIndex + 1}번째 발견자`;
    }
    return null;
  };

  // 현재 사용자의 발견 날짜 및 시간 (FOUND 타입일 때만)
  const getCurrentUserViewedAt = (): string | null => {
    if (data.type === 'FOUND' && data.viewers && data.viewers.length > 0 && user?.id) {
      const currentUser = data.viewers.find((viewer) => viewer.id === user.id);
      if (currentUser?.viewedAt) {
        const date = new Date(currentUser.viewedAt);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}.${day} ${hours}:${minutes}`;
      }
    }
    return null;
  };

  // 오디오 재생/일시정지 토글
  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    // TODO: 실제 오디오 재생 로직 구현
  };

  // 미디어 렌더링 함수
  const renderMedia = () => {
    const hasImage = isValidImageUrl(mediaUrls.imageUrl);
    const hasAudio = isValidImageUrl(mediaUrls.audioUrl);
    const hasVideo = isValidImageUrl(mediaUrls.videoUrl);

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
        {hasAudio && mediaUrls.audioUrl && (
          <View style={styles.audioPlayerWrapper}>
            <AudioPlayer
              audio={{
                id: `audio-${data.eggId}`,
                type: 'AUDIO' as MediaType,
                url: mediaUrls.audioUrl,
              }}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onTogglePlay={handleTogglePlay}
            />
          </View>
        )}

        {/* 비디오 렌더링 */}
        {hasVideo && mediaUrls.videoUrl && (
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={{ uri: mediaUrls.videoUrl }}
              style={styles.video}
              useNativeControls={true}
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              shouldPlay={false}
            />
          </View>
        )}
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
      closeOnBackdropPress>
      <View style={styles.scrollViewWrapper}>
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
          contentInsetAdjustmentBehavior="automatic">
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
                {getBadgeText() && (
                  <>
                    <Text style={styles.subtitleBold}>
                      {getBadgeText() === '첫 번째 발견자'
                        ? '첫 번째'
                        : getBadgeText() === '두 번째 발견자'
                        ? '두 번째'
                        : getBadgeText() === '마지막 발견자'
                        ? '마지막'
                        : getBadgeText()?.replace(' 발견자', '') || ''}
                    </Text>
                    <Text>(으)로</Text>
                  </>
                )}
              </Text>
              <Text style={styles.subtitle}>찾으셨군요!</Text>
            </View>
          ) : (
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>다른 사람들이 발견한 내 이스터에그를</Text>
              <Text style={styles.subtitle}>확인해보세요!</Text>
            </View>
          )}

          {/* 위치 정보 배지 (FOUND 타입일 때만, 중앙 정렬) */}
          {data.type === 'FOUND' && (
            <View style={styles.badgeContainer}>
              <Icon name="map-pin-line" size={16} color={Colors.black[500]} />
              <Text style={styles.badgeText}>{locationAddress}</Text>
            </View>
          )}

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
                      const viewedDate = formatShortDate(viewer.viewedAt);

                      return (
                        <View key={viewer.id} style={styles.viewerItem}>
                          <View style={styles.viewerInfo}>
                            <View style={styles.viewerAvatar}>
                              {viewerProfileImg ? (
                                <Image
                                  source={{ uri: viewerProfileImg }}
                                  style={styles.viewerAvatarImage}
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
                            <Icon name="calendar-line" size={12} color={Colors.grey[600]} />
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
