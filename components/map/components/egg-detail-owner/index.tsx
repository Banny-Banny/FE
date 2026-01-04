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

import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';

import { BottomSheet } from '@/commons/components/bottom-sheet';
import { Button } from '@/commons/components/button';
import { Colors } from '@/commons/constants';

import { TEXTS } from './constants';
import { useEggDetail } from './hooks/useEggDetail';
import { styles } from './styles';
import type { EggDetailProps } from './types';

export const EggDetail: React.FC<EggDetailProps> = ({ isVisible, onClose, capsule }) => {
  // 비즈니스 로직은 Hook에서 가져옴
  const { formattedDate, locationText, discoveryCount } = useEggDetail({ capsule });

  if (!capsule) {
    return null;
  }

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose}>
      <View style={styles.container}>
        {/* 헤더 섹션 */}
        <View style={styles.header}>
          {/* 왼쪽: 이스터에그 아이콘 */}
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Image
                source={require('../../../../assets/icons/egg-icon.svg')}
                style={styles.eggIcon}
                contentFit="contain"
                accessibilityLabel="이스터에그 아이콘"
              />
              <Text style={styles.iconText}>?</Text>
            </View>
          </View>

          {/* 오른쪽: 제목과 부제목 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{capsule.title}</Text>
            <Text style={styles.subtitle}>{TEXTS.header.subtitle}</Text>
          </View>
        </View>

        {/* 정보 카드 섹션 */}
        <View style={styles.infoCardsContainer}>
          {/* 숨긴 날짜 카드 */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <View style={styles.infoCardHeader}>
                <Icon name="calendar-line" size={12} color={Colors.grey[700]} />
                <Text style={styles.infoCardLabel}>{TEXTS.infoCard.dateLabel}</Text>
              </View>
              <Text style={styles.infoCardValue}>{formattedDate}</Text>
            </View>
          </View>

          {/* 위치 카드 */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardContent}>
              <View style={styles.infoCardHeader}>
                <Icon name="map-pin-line" size={12} color={Colors.grey[700]} />
                <Text style={styles.infoCardLabel}>{TEXTS.infoCard.locationLabel}</Text>
              </View>
              <Text style={styles.infoCardValue} numberOfLines={1}>
                {locationText}
              </Text>
            </View>
          </View>
        </View>

        {/* 발견 기록 섹션 */}
        <View style={styles.discoverySection}>
          <View style={styles.discoveryHeader}>
            <Icon name="group-line" size={16} color={Colors.black[500]} />
            <Text style={styles.discoveryTitle}>
              {TEXTS.discovery.title} ({discoveryCount})
            </Text>
          </View>
          <View style={styles.discoveryEmptyBox}>
            <Text style={styles.discoveryEmptyText}>{TEXTS.discovery.emptyText}</Text>
          </View>
        </View>

        {/* 닫기 버튼 */}
        <Button label={TEXTS.button.close} variant="primary" size="M" onPress={onClose} />
      </View>
    </BottomSheet>
  );
};

