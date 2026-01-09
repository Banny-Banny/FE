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

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Icon from 'react-native-remix-icon';
import { Modal } from '@/commons/components/modal';
import { Colors } from '@/commons/constants/color';
import { styles } from './styles';
import { useOpenedCapsuleDetail } from '../../hooks/useOpenedCapsuleDetail';

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

  // 선택된 슬롯
  const selectedSlot = writtenSlots[selectedSlotIndex];
  const imageCount = selectedSlot?.content?.images?.length || 0;

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
                      <Text style={styles.userAvatarEmoji}>{slot.author.emoji}</Text>
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
          {currentContent?.text && (
            <View style={styles.textMessagesContainer}>
              <View style={styles.textMessageCard}>
                <Text style={styles.textMessageText}>{currentContent.text}</Text>
              </View>
            </View>
          )}

          {/* 이미지 캐러셀 섹션 - API 데이터 */}
          {imageCount > 0 && (
            <View style={styles.imageSection}>
              <View style={styles.imageContainer}>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={handleImageScroll}
                  style={styles.imageScrollView}>
                  {currentContent.images!.map((image) => (
                    <View key={image.id} style={styles.imageItem}>
                      <Image
                        source={{ uri: image.url }}
                        style={styles.imagePlaceholder}
                        contentFit="cover"
                      />
                    </View>
                  ))}
                </ScrollView>
                {/* 이미지 인디케이터 */}
                {imageCount > 1 && (
                  <View style={styles.imageIndicator}>
                    <Text style={styles.imageIndicatorText}>
                      {currentImageIndex + 1}/{imageCount}
                    </Text>
                  </View>
                )}
              </View>
              {/* 페이지네이션 인디케이터 */}
              {imageCount > 1 && (
                <View style={styles.paginationContainer}>
                  {currentContent.images!.map((image, index) => (
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

          {/* 동영상 섹션 - API 데이터 */}
          {currentContent?.video && (
            <View style={styles.videoSection}>
              <View style={styles.videoContainer}>
                <Image
                  source={{ uri: currentContent.video.thumbnailUrl }}
                  style={styles.videoThumbnail}
                  contentFit="cover"
                />
                {/* 오버레이 및 재생 버튼 */}
                <View style={styles.videoOverlay} pointerEvents="box-none">
                  <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
                    <Icon name="ri-play-circle-line" size={24} color={Colors.white[500]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* 오디오 플레이어 섹션 - API 데이터 */}
          {currentContent?.audio && (
            <View style={styles.audioSection}>
              <View style={styles.audioCard}>
                <View style={styles.audioContent}>
                  <View style={styles.audioIconContainer}>
                    <Icon name="ri-music-line" size={20} color={Colors.black[500]} />
                  </View>
                  <View style={styles.audioTitleContainer}>
                    <Text style={styles.audioTitle} numberOfLines={1}>
                      {currentContent.audio.title}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.audioPlayButton} activeOpacity={0.8}>
                    <Icon name="ri-play-line" size={16} color={Colors.white[500]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
