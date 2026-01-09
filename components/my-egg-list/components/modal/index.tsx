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
 */

import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import { Modal } from '@/commons/components/modal';
import { Colors } from '@/commons/constants';
import type { MediaType } from '@/commons/constants/media';
import { AudioPlayer } from '@/components/shared/audio-player';
import { isValidImageUrl } from '@/utils';

import { styles } from './styles';

/**
 * 이스터에그 상세 데이터 타입
 */
export interface EasterEggDetailData {
  eggId: number;
  type: 'FOUND' | 'PLANTED'; // "FOUND" (내가 발견한 것) 또는 "PLANTED" (내가 심은 것)
  isMine: boolean; // 내가 작성자인지 여부 (수정/삭제 버튼 노출 분기용)

  // 콘텐츠 정보
  title: string;
  message: string;
  imageUrl?: string; // media_id 넘겨주면 프론트에서 url로 전환해도 됨 -> 모든 미디어 동일
  audioUrl?: string;
  videoUrl?: string;

  // 위치 정보
  location: {
    address?: string; // 안 보내도 됨(프론트에서 전환 가능)
    latitude: number;
    longitude: number;
  };

  // 상태 및 통계 정보
  author: {
    id: number;
    name: string;
    profileUrl?: string;
  };
  createdAt: string; // 생성일
  foundAt?: string; // (내가) 발견한 날짜 (type이 FOUND일 때만 존재)
  expiredAt?: string | null; // 소멸된 날짜 (소멸되지 않았다면, null로 반환)
  discoveredCount?: number; // 이 알을 발견한 총 인원 수 (내가 심은 알 상세용)
  viewer?: {
    id: number;
    name: string;
    profileUrl?: string;
  };
}

export interface EasterEggModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 이스터에그 상세 데이터 */
  data: EasterEggDetailData | null;
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
  // 오디오 재생 상태 관리
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 비디오 재생 상태 관리
  const videoRef = useRef<Video>(null);

  // 데이터가 없으면 렌더링하지 않음
  if (!data) {
    return null;
  }

  // 위치 주소 (address가 없으면 기본값 사용)
  const locationAddress = data.location.address || '위치 정보 없음';

  // 날짜 포맷팅
  const createdDate = formatDate(data.createdAt);
  const foundDate = data.foundAt ? formatDate(data.foundAt) : null;

  // 날짜 텍스트 생성
  const getDateText = (): string => {
    if (data.type === 'FOUND' && foundDate) {
      return `작성일: ${createdDate} · 발견일: ${foundDate}`;
    }
    return `작성일: ${createdDate}`;
  };

  // 오디오 재생/일시정지 토글
  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    // TODO: 실제 오디오 재생 로직 구현
  };

  // 미디어 렌더링 함수
  const renderMedia = () => {
    const hasImage = isValidImageUrl(data.imageUrl);
    const hasAudio = isValidImageUrl(data.audioUrl);
    const hasVideo = isValidImageUrl(data.videoUrl);

    if (!hasImage && !hasAudio && !hasVideo) {
      return null;
    }

    return (
      <View style={styles.mediaContainer}>
        {/* 이미지 렌더링 */}
        {hasImage && data.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: data.imageUrl }}
              style={styles.image}
              contentFit="cover"
              accessibilityLabel="이스터에그 이미지"
            />
          </View>
        )}

        {/* 오디오 플레이어 렌더링 */}
        {hasAudio && data.audioUrl && (
          <AudioPlayer
            audio={{
              id: `audio-${data.eggId}`,
              type: 'AUDIO' as MediaType,
              url: data.audioUrl,
            }}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onTogglePlay={handleTogglePlay}
          />
        )}

        {/* 비디오 렌더링 */}
        {hasVideo && data.videoUrl && (
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={{ uri: data.videoUrl }}
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
      height="80%"
      padding={0}
      closeOnBackdropPress>
      <View style={styles.scrollViewWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps="handled">
          {/* 닫기 버튼 */}
          <Pressable style={styles.closeButton} onPress={onClose} accessibilityLabel="닫기">
            <Icon name="close-line" size={20} color={Colors.black[500]} />
          </Pressable>

          <View style={styles.contentWrapper}>
            {/* 상단 섹션 (아이콘, 제목, 위치) */}
            <View style={styles.topSection}>
              <View style={styles.iconContainer}>
                <View style={styles.iconWrapper}>
                  <Image
                    source={require('@/assets/images/modal_egg.png')}
                    style={styles.iconImage}
                    contentFit="contain"
                    accessibilityLabel="이스터에그 아이콘"
                  />
                </View>
              </View>

              {/* 제목 */}
              <Text style={styles.title}>{data.title}</Text>

              {/* 위치 정보 */}
              <View style={styles.locationContainer}>
                <Icon name="map-pin-line" size={14} color={Colors.grey[700]} />
                <Text style={styles.locationText}>{locationAddress}</Text>
              </View>
            </View>

            {/* 하단 섹션 (메시지 카드, 작성자 카드, 미디어) */}
            <View style={styles.bottomSection}>
              {/* 메시지 카드 */}
              <View style={styles.messageCard}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageEmoji}>💬</Text>
                  <Text style={styles.messageLabel}>메시지</Text>
                </View>
                <Text style={styles.messageText}>{data.message}</Text>
              </View>

              {/* 미디어 렌더링 (이미지, 오디오, 비디오) */}
              {renderMedia()}

              {/* 작성자/발견자 정보 카드 */}
              {data.type === 'PLANTED' && data.isMine ? (
                // 내가 심은 알일 때: 누가 발견했는지 표시
                <View style={styles.authorCard}>
                  <View style={styles.authorHeader}>
                    <Icon name="eye-line" size={16} color={Colors.black[500]} />
                    <Text style={styles.authorLabel}>
                      발견한 사람 {data.discoveredCount ? `(${data.discoveredCount}명)` : ''}
                    </Text>
                  </View>
                  {data.viewer ? (
                    <View style={styles.viewerInfo}>
                      <View style={styles.viewerAvatar}>
                        {isValidImageUrl(data.viewer.profileUrl) && data.viewer.profileUrl ? (
                          <Image
                            source={{ uri: data.viewer.profileUrl }}
                            style={styles.viewerAvatarImage}
                            contentFit="cover"
                            accessibilityLabel={`${data.viewer.name} 프로필 이미지`}
                          />
                        ) : (
                          <Text style={styles.viewerAvatarEmoji}>👤</Text>
                        )}
                      </View>
                      <Text style={styles.viewerName}>{data.viewer.name}</Text>
                    </View>
                  ) : (
                    <Text style={styles.dateText}>아직 발견한 사람이 없습니다</Text>
                  )}
                  <Text style={styles.dateText}>{getDateText()}</Text>
                </View>
              ) : (
                // 내가 발견한 알일 때: 누가 숨겼는지 표시
                <View style={styles.authorCard}>
                  <View style={styles.authorHeader}>
                    <Icon name="star-fill" size={16} color={Colors.black[500]} />
                    <Text style={styles.authorLabel}>{data.author.name}님이 숨긴 알</Text>
                  </View>
                  <Text style={styles.dateText}>{getDateText()}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EasterEggModal;
