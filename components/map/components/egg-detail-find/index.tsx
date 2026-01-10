/**
 * EggDetailFind Component
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] 토큰 기반 스타일 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 * - [x] react-native-remix-icon 사용
 * - [x] commons/components/modal 사용
 */

import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import { Button } from '@/commons/components/button';
import { Modal } from '@/commons/components/modal';
import { Colors } from '@/commons/constants';

import { useCapsuleDetail } from '../egg-detail-owner/hooks/useCapsuleDetail';
import { AudioPlayer } from '@/components/shared/audio-player';
import { useEggDetailFind } from './hooks/useEggDetailFind';
import { styles } from './styles';
import type { EggDetailFindProps } from './types';

export const EggDetailFind: React.FC<EggDetailFindProps> = ({
  visible,
  onClose,
  data,
  capsuleId,
  currentLocation,
}) => {
  // 상세 데이터 조회
  const {
    data: detailData,
    isLoading: isDetailLoading,
    error: detailError,
  } = useCapsuleDetail({
    capsuleId: capsuleId || null,
    lat: currentLocation?.lat || null,
    lng: currentLocation?.lng || null,
  });

  // 비즈니스 로직은 Hook에서 가져옴
  const { discoveryData, isLoading, error } = useEggDetailFind({
    visible,
    data,
    detailData,
    isLoading: isDetailLoading,
    error: detailError,
  });

  // 데이터가 없으면 렌더링하지 않음
  if (!discoveryData) {
    return null;
  }

  // 발견 순서에 따른 배지 텍스트
  const getBadgeText = (): string => {
    switch (discoveryData.discoveryOrder) {
      case 'first':
        return '첫 번째 발견자';
      case 'second':
        return '두 번째 발견자';
      case 'last':
        return '마지막 발견자';
      default:
        // TypeScript exhaustive check를 위한 default case
        const _exhaustive: never = discoveryData.discoveryOrder;
        return _exhaustive;
    }
  };

  // 발견 순서에 따른 서브타이틀
  const getSubtitle = (): string => {
    if (discoveryData.discoveryOrder === 'last') {
      return '마지막 발견자가 되었습니다!';
    }
    return '누군가의 소중한 추억을 찾으셨군요!';
  };

  // 미디어 타입별 렌더링
  const renderMedia = () => {
    const images = discoveryData.media.filter((m) => m.type === 'IMAGE');
    const audios = discoveryData.media.filter((m) => m.type === 'AUDIO');
    const videos = discoveryData.media.filter((m) => m.type === 'VIDEO');

    return (
      <View style={styles.mediaContainer}>
        {/* 이미지 렌더링 */}
        {images.map((image) => (
          <View key={image.id} style={styles.imageContainer}>
            <Image
              source={{ uri: image.url }}
              style={styles.image}
              contentFit="cover"
              accessibilityLabel="이스터에그 이미지"
            />
          </View>
        ))}

        {/* 오디오 플레이어 렌더링 */}
        {audios.map((audio) => {
          // audio.url이 URL인지 ID인지 확인
          // URL이 아니면 ID로 간주하여 AudioPlayer에 전달
          const isUrl = audio.url.startsWith('http://') || audio.url.startsWith('https://');
          return (
            <AudioPlayer
              key={audio.id}
              mediaId={isUrl ? null : audio.url}
              audioUrl={isUrl ? audio.url : undefined}
            />
          );
        })}

        {/* 비디오 렌더링 */}
        {videos.map((video) => (
          <Pressable
            key={video.id}
            style={styles.videoContainer}
            onPress={() => {
              // TODO: 비디오 재생 로직 추가
            }}
            accessibilityLabel="이스터에그 비디오 재생">
            <Image
              source={{ uri: video.thumbnailUrl || video.url }}
              style={styles.videoThumbnail}
              contentFit="cover"
            />
            <View style={styles.videoOverlay}>
              <View style={styles.videoPlayButton}>
                <Icon name="play-fill" size={28} color={Colors.black[500]} />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      width={340}
      height="80%"
      padding={0}
      closeOnBackdropPress>
      <View style={styles.scrollViewWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps="handled">
          {/* 상단 알 아이콘 */}
          <View style={styles.eggIconContainer}>
            <View style={styles.eggIconWrapper}>
              <Image
                source={require('@/assets/images/modal_egg.png')}
                style={styles.eggImage}
                contentFit="contain"
                accessibilityLabel="이스터에그"
              />
            </View>
          </View>

          {/* 제목 */}
          <Text style={styles.title}>이스터에그 발견!</Text>

          {/* 서브타이틀 */}
          <Text style={styles.subtitle}>{getSubtitle()}</Text>

          {/* 발견자 배지 */}
          <View style={styles.badgeContainer}>
            <Icon name="award-fill" size={16} color={Colors.black[500]} />
            <Text style={styles.badgeText}>{getBadgeText()}</Text>
          </View>

          {/* 메인 컨텐츠 카드 */}
          <View style={styles.contentCard}>
            {/* 작성자 정보 헤더 */}
            <View style={styles.authorHeader}>
              <View style={styles.authorInfo}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.authorEmoji}>{discoveryData.author.emoji}</Text>
                </View>
                <Text style={styles.authorName}>{discoveryData.author.name}</Text>
              </View>
              <View style={styles.dateBadge}>
                <View style={styles.dateIcon}>
                  <Icon name="calendar-line" size={14} color={Colors.grey[600]} />
                </View>
                <Text style={styles.dateText}>{discoveryData.createdAt}</Text>
              </View>
            </View>

            {/* 제목 */}
            <Text style={styles.contentTitle}>{discoveryData.title}</Text>

            {/* 본문 */}
            <Text style={styles.contentText}>{discoveryData.content}</Text>

            {/* 미디어 렌더링 */}
            {renderMedia()}

            {/* 열람 횟수 및 소멸 예정 */}
            <View style={styles.expiringContainer}>
              <View style={styles.viewCountBadge}>
                <Text style={styles.viewCountText}>열람 횟수</Text>
                <Text style={styles.viewCountNumber}>
                  {discoveryData.viewCount.current}/{discoveryData.viewCount.max}
                </Text>
              </View>
              {discoveryData.isExpiring && <Text style={styles.expiringLabel}>소멸 예정</Text>}
            </View>
          </View>

          {/* 소멸 예정 안내 텍스트 (마지막 발견자) */}
          {discoveryData.isExpiring && (
            <Text style={styles.expiringText}>이 이스터에그는 이제 소멸됩니다 ✨</Text>
          )}

          {/* 확인 버튼 */}
          <Button label="확인했어요" variant="primary" size="S" onPress={onClose} />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EggDetailFind;
