/**
 * UnlockedCapsuleDetail 컴포넌트
 * 피그마 디자인: node-id=1078:3466
 *
 * 구조:
 * - 공통 Modal 컴포넌트 사용
 * - 헤더: 제목 + 사용자 아바타 3개 (클릭 가능)
 * - 컨텐츠: 사용자별 다른 내용 표시
 *   - 텍스트 메시지
 *   - 이미지 캐러셀 (스와이프 가능)
 *   - 오디오 플레이어
 * - 닫기 버튼: 오른쪽 상단
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Icon from 'react-native-remix-icon';
import { Modal } from '@/commons/components/modal';
import { Colors } from '@/commons/constants/color';
import { styles } from './styles';
import { useOpenedCapsuleDetail } from '../../hooks/useOpenedCapsuleDetail';
import { getMediaUrl } from '@/utils/mediaUrl';
import { AudioPlayer } from '@/components/shared/audio-player';
import { VideoPlayer } from '@/components/shared/video-player';
import type { ImageMedia, VideoMedia, AudioMedia } from '../../types';

interface UnlockedCapsuleDetailProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 캡슐 ID (필수) */
  capsuleId: string | null;
}

// 모달 너비에서 좌우 패딩 제외한 이미지 너비
const MODAL_WIDTH = 345.347;
const CONTENT_PADDING = 15.99;
const IMAGE_WIDTH = MODAL_WIDTH - CONTENT_PADDING * 2; // 313.367

export default function UnlockedCapsuleDetail({
  visible,
  onClose,
  capsuleId
}: UnlockedCapsuleDetailProps) {
  // API 데이터 로드
  const { data, writtenSlots, isLoading, error } = useOpenedCapsuleDetail(capsuleId);

  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // 미디어 URL 상태 (이미지만 관리, 비디오/오디오는 AudioPlayer/VideoPlayer에서 처리)
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

  // 선택된 슬롯
  const selectedSlot = writtenSlots[selectedSlotIndex];
  const imageCount = selectedSlot?.content?.images?.length || 0;

  // 이미지 URL 가져오기 (선택된 슬롯이 변경될 때마다)
  // 비디오와 오디오는 AudioPlayer/VideoPlayer 컴포넌트에서 자동으로 처리
  useEffect(() => {
    if (!selectedSlot?.content?.images) {
      setImageUrls(new Map());
      return;
    }

    const loadImageUrls = async () => {
      const newImageUrls = new Map<string, string>();

      // 이미지 URL 가져오기
      for (const image of selectedSlot.content.images || []) {
        if (image.url && image.url.trim() !== '') {
          // 이미 URL이 있으면 사용
          newImageUrls.set(image.id, image.url);
        } else if (image.id) {
          // media_id로 URL 가져오기
          try {
            const url = await getMediaUrl(image.id);
            newImageUrls.set(image.id, url);
          } catch (err) {
            console.error('Failed to load image URL:', err);
          }
        }
      }

      setImageUrls(newImageUrls);
    };

    loadImageUrls();
  }, [selectedSlotIndex, selectedSlot]);

  const handleUserSelect = (index: number) => {
    setSelectedSlotIndex(index);
    setCurrentImageIndex(0);
    // 이미지 스크롤을 처음으로 리셋
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: false });
    }
  };

  const handleImageScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / IMAGE_WIDTH);
    setCurrentImageIndex(index);
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <Modal
        visible={visible}
        onClose={onClose}
        width={345.347}
        height={724.375}
        padding={0}
        closeOnBackdropPress={true}
        disableAnimation={false}>
        <View style={styles.modalContainer}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: Colors.grey[500] }}>로딩 중...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  // 에러 또는 데이터 없음 처리
  if (error || !data || !selectedSlot) {
    return (
      <Modal
        visible={visible}
        onClose={onClose}
        width={345.347}
        height={724.375}
        padding={0}
        closeOnBackdropPress={true}
        disableAnimation={false}>
        <View style={styles.modalContainer}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: Colors.grey[500] }}>
              {error || '데이터를 불러올 수 없습니다.'}
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  const currentContent = selectedSlot.content;
  
  // URL이 포함된 콘텐츠 생성 (이미지만 URL 변환, 비디오/오디오는 컴포넌트에서 처리)
  const enrichedContent = currentContent ? {
    ...currentContent,
    images: currentContent.images?.map((img) => ({
      ...img,
      url: imageUrls.get(img.id) || img.url || '',
    })),
  } : undefined;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      width={345.347}
      height={724.375}
      padding={0}
      closeOnBackdropPress={true}
      disableAnimation={false}>
      {/* 모달 컨테이너 */}
      <View style={styles.modalContainer} pointerEvents="box-none">
        {/* 닫기 버튼 */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <Icon name="ri-close-line" size={20} color={Colors.black[500]} />
        </TouchableOpacity>

        {/* 헤더 섹션 */}
        <View style={styles.headerSection}>
          {/* 제목 - API 데이터 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{data.title}</Text>
          </View>

          {/* 사용자 아바타 섹션 - API 데이터로 동적 렌더링 */}
          <View style={styles.userAvatarsContainer}>
            {writtenSlots.map((slot, index) => (
              <TouchableOpacity
                key={slot.slotId}
                style={styles.userAvatarWrapper}
                onPress={() => handleUserSelect(index)}
                activeOpacity={0.7}>
                <View style={styles.userAvatarContainer}>
                  <View
                    style={
                      selectedSlotIndex === index
                        ? styles.userAvatarBorderSelected
                        : styles.userAvatarBorder
                    }>
                    <View style={styles.userAvatarInner}>
                      {slot.author.profileImg ? (
                        <Image
                          source={{ uri: slot.author.profileImg }}
                          style={{ width: '100%', height: '100%', borderRadius: 50 }}
                          contentFit="cover"
                        />
                      ) : (
                        <Text style={styles.userAvatarEmoji}>{slot.author.emoji}</Text>
                      )}
                    </View>
                  </View>
                  <Text
                    style={
                      selectedSlotIndex === index
                        ? styles.userAvatarNameSelected
                        : styles.userAvatarName
                    }>
                    {slot.author.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 컨텐츠 섹션 */}
        <ScrollView
          style={styles.contentSection}
          contentContainerStyle={styles.contentScrollContainer}
          showsVerticalScrollIndicator={false}>
          {/* 텍스트 메시지 - API 데이터 */}
          {enrichedContent?.text && (
            <View style={styles.textMessagesContainer}>
              <View style={styles.textMessageCard}>
                <Text style={styles.textMessageText}>{enrichedContent.text}</Text>
              </View>
            </View>
          )}

          {/* 이미지 캐러셀 섹션 - API 데이터 */}
          {enrichedContent?.images && enrichedContent.images.length > 0 && (
            <View style={styles.imageSection}>
              <View style={styles.imageContainer}>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={handleImageScroll}
                  style={styles.imageScrollView}>
                  {enrichedContent.images.map((image) => (
                    <View key={image.id} style={styles.imageItem}>
                      {image.url ? (
                        <Image
                          source={{ uri: image.url }}
                          style={styles.imagePlaceholder}
                          contentFit="cover"
                        />
                      ) : (
                        <View style={[styles.imagePlaceholder, { backgroundColor: Colors.grey[200], justifyContent: 'center', alignItems: 'center' }]}>
                          <Text style={{ color: Colors.grey[500] }}>이미지 로딩 중...</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
                {/* 이미지 인디케이터 */}
                {enrichedContent.images.length > 1 && (
                  <View style={styles.imageIndicator}>
                    <Text style={styles.imageIndicatorText}>
                      {currentImageIndex + 1}/{enrichedContent.images.length}
                    </Text>
                  </View>
                )}
              </View>
              {/* 페이지네이션 인디케이터 */}
              {enrichedContent.images.length > 1 && (
                <View style={styles.paginationContainer}>
                  {enrichedContent.images.map((image, index) => (
                    <View
                      key={image.id}
                      style={
                        index === currentImageIndex
                          ? styles.paginationDotActive
                          : styles.paginationDotInactive
                      }
                    />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* 동영상 섹션 - VideoPlayer 컴포넌트 사용 */}
          {currentContent?.video && currentContent.video.id && (
            <View style={styles.videoSection}>
              <View style={styles.videoContainer}>
                <VideoPlayer
                  mediaId={currentContent.video.url || currentContent.video.id}
                  thumbnailUrl={currentContent.video.thumbnailUrl || undefined}
                />
              </View>
            </View>
          )}

          {/* 오디오 플레이어 섹션 - AudioPlayer 컴포넌트 사용 */}
          {currentContent?.audio && currentContent.audio.id && (
            <View style={styles.audioSection}>
              <AudioPlayer
                mediaId={currentContent.audio.url || currentContent.audio.id}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
