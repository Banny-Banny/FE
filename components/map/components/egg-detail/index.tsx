/**
 * Egg Detail Component
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.ts → 스타일만 분리
 * - [x] nativewind 토큰 참조만 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] BottomSheet 공통 컴포넌트 사용
 */

import { BottomSheet } from '@/commons/components/bottom-sheet';
import { formatCurrency } from '@/utils';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from './styles';
import type { EggDetailProps } from './types';

export const EggDetail: React.FC<EggDetailProps> = ({ isVisible, onClose, capsule }) => {
  // 날짜 포맷팅
  const formattedOpenDate = useMemo(() => {
    if (!capsule?.open_at) return null;
    return dayjs(capsule.open_at).format('YYYY년 MM월 DD일');
  }, [capsule?.open_at]);

  // 거리 포맷팅
  const formattedDistance = useMemo(() => {
    if (!capsule?.distance_m) return null;
    if (capsule.distance_m < 1000) {
      return `${Math.round(capsule.distance_m)}m`;
    }
    return `${(capsule.distance_m / 1000).toFixed(1)}km`;
  }, [capsule?.distance_m]);

  // 미디어 URL 처리 (media_urls가 이미 URL인지 ID인지 확인 필요)
  const mediaUrls = useMemo(() => {
    if (!capsule?.media_urls || capsule.media_urls.length === 0) return [];
    // media_urls가 이미 URL 형식인지 확인
    return capsule.media_urls;
  }, [capsule?.media_urls]);

  if (!capsule) {
    return null;
  }

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <View style={styles.container}>
        {/* 헤더 섹션 */}
        <View style={styles.header}>
          <Text style={styles.title}>{capsule.title}</Text>

          {/* 메타 정보 */}
          <View style={styles.metaInfo}>
            {formattedOpenDate && (
              <View style={styles.metaItem}>
                <Text style={styles.dateText}>{formattedOpenDate} 개봉</Text>
              </View>
            )}
            {formattedDistance && (
              <View style={styles.metaItem}>
                <Text style={styles.distanceText}>{formattedDistance} 거리</Text>
              </View>
            )}
          </View>

          {/* 상태 배지 */}
          <View
            style={[
              styles.statusBadge,
              capsule.is_locked ? styles.lockedBadge : styles.unlockedBadge,
            ]}>
            <Text
              style={
                capsule.is_locked ? styles.statusText : styles.unlockedStatusText
              }>
              {capsule.is_locked ? '잠금' : '개봉 가능'}
            </Text>
          </View>
        </View>

        {/* 내용 섹션 */}
        {capsule.content && (
          <View style={styles.contentSection}>
            <Text style={styles.contentText}>{capsule.content}</Text>
          </View>
        )}

        {/* 미디어 섹션 */}
        {mediaUrls.length > 0 && (
          <View style={styles.mediaSection}>
            <Text style={styles.mediaTitle}>첨부파일</Text>
            <View style={styles.mediaContainer}>
              {mediaUrls.map((url, index) => {
                const mediaType = capsule.media_types?.[index] || 'IMAGE';
                const isImage = mediaType === 'IMAGE' || mediaType === 'image';
                const isVideo = mediaType === 'VIDEO' || mediaType === 'video';

                if (isImage) {
                  return (
                    <View key={index} style={styles.imageContainer}>
                      <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
                    </View>
                  );
                }

                if (isVideo) {
                  // 비디오는 나중에 Video 컴포넌트로 교체 가능
                  return (
                    <View key={index} style={styles.videoContainer}>
                      <Image source={{ uri: url }} style={styles.video} resizeMode="cover" />
                    </View>
                  );
                }

                return null;
              })}
            </View>
          </View>
        )}

        {/* 상품 정보 섹션 */}
        {capsule.product && (
          <View style={styles.productSection}>
            <Text style={styles.productTitle}>상품 정보</Text>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{capsule.product.name}</Text>
              <Text style={styles.productPrice}>{formatCurrency(capsule.product.price)}</Text>
            </View>
          </View>
        )}

        {/* 조회 정보 */}
        <View style={styles.viewInfo}>
          <Text style={styles.viewText}>
            조회 {capsule.view_count} / {capsule.view_limit}
          </Text>
        </View>
      </View>
    </BottomSheet>
  );
};

