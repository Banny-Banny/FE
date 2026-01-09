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

// localhost 이미지 URL 제거됨 - 리믹스 아이콘 사용

// 사용자별 데이터
const USER_DATA = {
  '김민수': {
    emoji: '😊',
    message: '2024년 정말 고생 많았어! 2025년엔 더 멋진 일들만 가득하길 바랄게 ㅎㅎ',
    images: [
      'http://localhost:3845/assets/placeholder1.jpg',
      'http://localhost:3845/assets/placeholder2.jpg',
    ],
    video: {
      thumbnail: 'http://localhost:3845/assets/video-thumbnail1.jpg',
      url: '',
    },
    audio: {
      title: 'Perfect Day - Lou Reed',
      url: '',
    },
  },
  '박지은': {
    emoji: '🌸',
    message: '올해 너무 즐거웠어! 내년에도 함께하자 ♥',
    images: [
      'http://localhost:3845/assets/placeholder3.jpg',
    ],
    video: {
      thumbnail: 'http://localhost:3845/assets/video-thumbnail2.jpg',
      url: '',
    },
    audio: {
      title: 'Perfect Day - Lou Reed',
      url: '',
    },
  },
  '이준호': {
    emoji: '⚡',
    message: '2024년 함께한 모든 순간이 소중했어!',
    images: [
      'http://localhost:3845/assets/placeholder4.jpg',
      'http://localhost:3845/assets/placeholder5.jpg',
      'http://localhost:3845/assets/placeholder6.jpg',
    ],
    video: {
      thumbnail: 'http://localhost:3845/assets/video-thumbnail3.jpg',
      url: '',
    },
    audio: {
      title: 'Perfect Day - Lou Reed',
      url: '',
    },
  },
};

interface UnlockedCapsuleDetailProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
}

// 모달 너비에서 좌우 패딩 제외한 이미지 너비
const MODAL_WIDTH = 345.347;
const CONTENT_PADDING = 15.99;
const IMAGE_WIDTH = MODAL_WIDTH - CONTENT_PADDING * 2; // 313.367

export default function UnlockedCapsuleDetail({ visible, onClose }: UnlockedCapsuleDetailProps) {
  const [selectedUser, setSelectedUser] = useState<'김민수' | '박지은' | '이준호'>('김민수');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const currentUserData = USER_DATA[selectedUser];
  const imageCount = currentUserData.images.length;

  const handleUserSelect = (userName: '김민수' | '박지은' | '이준호') => {
    setSelectedUser(userName);
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
          {/* 제목 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>2024 추억 타임캡슐</Text>
          </View>

          {/* 사용자 아바타 섹션 */}
          <View style={styles.userAvatarsContainer}>
            {/* 김민수 */}
            <TouchableOpacity
              style={styles.userAvatarWrapper}
              onPress={() => handleUserSelect('김민수')}
              activeOpacity={0.7}>
              <View style={styles.userAvatarContainer}>
                <View
                  style={
                    selectedUser === '김민수'
                      ? styles.userAvatarBorderSelected
                      : styles.userAvatarBorder
                  }>
                  <View style={styles.userAvatarInner}>
                    <Text style={styles.userAvatarEmoji}>😊</Text>
                  </View>
                </View>
                <Text
                  style={
                    selectedUser === '김민수'
                      ? styles.userAvatarNameSelected
                      : styles.userAvatarName
                  }>
                  김민수
                </Text>
              </View>
            </TouchableOpacity>

            {/* 박지은 */}
            <TouchableOpacity
              style={styles.userAvatarWrapper}
              onPress={() => handleUserSelect('박지은')}
              activeOpacity={0.7}>
              <View style={styles.userAvatarContainer}>
                <View
                  style={
                    selectedUser === '박지은'
                      ? styles.userAvatarBorderSelected
                      : styles.userAvatarBorder
                  }>
                  <View style={styles.userAvatarInner}>
                    <Text style={styles.userAvatarEmoji}>🌸</Text>
                  </View>
                </View>
                <Text
                  style={
                    selectedUser === '박지은'
                      ? styles.userAvatarNameSelected
                      : styles.userAvatarName
                  }>
                  박지은
                </Text>
              </View>
            </TouchableOpacity>

            {/* 이준호 */}
            <TouchableOpacity
              style={styles.userAvatarWrapper}
              onPress={() => handleUserSelect('이준호')}
              activeOpacity={0.7}>
              <View style={styles.userAvatarContainer}>
                <View
                  style={
                    selectedUser === '이준호'
                      ? styles.userAvatarBorderSelected
                      : styles.userAvatarBorder
                  }>
                  <View style={styles.userAvatarInner}>
                    <Text style={styles.userAvatarEmoji}>⚡</Text>
                  </View>
                </View>
                <Text
                  style={
                    selectedUser === '이준호'
                      ? styles.userAvatarNameSelected
                      : styles.userAvatarName
                  }>
                  이준호
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 컨텐츠 섹션 */}
        <ScrollView
          style={styles.contentSection}
          contentContainerStyle={styles.contentScrollContainer}
          showsVerticalScrollIndicator={false}>
          {/* 텍스트 메시지 (1개만) */}
          <View style={styles.textMessagesContainer}>
            <View style={styles.textMessageCard}>
              <Text style={styles.textMessageText}>{currentUserData.message}</Text>
            </View>
          </View>

          {/* 이미지 캐러셀 섹션 */}
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
                  {currentUserData.images.map((imageUrl, index) => (
                    <View key={index} style={styles.imageItem}>
                      <Image
                        source={{ uri: imageUrl }}
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
                  {currentUserData.images.map((_, index) => (
                    <View
                      key={index}
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

          {/* 동영상 섹션 */}
          {currentUserData.video && (
            <View style={styles.videoSection}>
              <View style={styles.videoContainer}>
                <Image
                  source={{ uri: currentUserData.video.thumbnail }}
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

          {/* 오디오 플레이어 섹션 */}
          {currentUserData.audio && (
            <View style={styles.audioSection}>
              <View style={styles.audioCard}>
                <View style={styles.audioContent}>
                  <View style={styles.audioIconContainer}>
                    <Icon name="ri-music-line" size={20} color={Colors.black[500]} />
                  </View>
                  <View style={styles.audioTitleContainer}>
                    <Text style={styles.audioTitle} numberOfLines={1}>
                      {currentUserData.audio.title}
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
