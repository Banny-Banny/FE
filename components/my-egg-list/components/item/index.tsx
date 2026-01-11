/**
 * components/my-egg-list/components/item/index.tsx
 * 이스터에그 목록 아이템 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (View, Text 등 기본 컴포넌트 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.ts에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] react-native-remix-icon 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * Figma 노드 ID: 585:2856
 * 생성 시각: 2025-01-XX
 */

import { Colors } from '@/commons/constants';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { styles } from './styles';

// 소멸된 알 이미지
const BROKEN_EGG_ICON = require('@/assets/images/broken_egg.svg');

export interface ItemProps {
  id?: string;
  title: string;
  description: string;
  location?: string; // latitude/longitude 기반으로 계산되며, 없을 수 있음
  date: string;
  eggIcon?: string | number; // Image source
  hasImage?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  viewCount?: number; // 조회수 (심은 알에서 사용)
  showViewCount?: boolean; // 조회수 표시 여부 (심은 알에서 true)
  status?: 'ACTIVE' | 'EXPIRED'; // 활성/소멸 상태 (심은 알에서 사용)
  onPress?: () => void;
}

export function Item({
  title,
  description,
  location,
  date,
  eggIcon,
  hasImage,
  hasAudio,
  hasVideo,
  viewCount,
  showViewCount = false, // 기본값은 false
  status,
  onPress,
}: ItemProps) {
  const isExpired = status === 'EXPIRED';

  // 소멸된 알이면 broken_egg.svg 사용, 아니면 기존 eggIcon 사용
  const displayIcon = isExpired ? BROKEN_EGG_ICON : eggIcon;

  return (
    <Pressable
      style={[styles.container, isExpired && styles.containerExpired]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          {displayIcon && (
            <View style={styles.iconContainer}>
              <Image
                source={typeof displayIcon === 'string' ? { uri: displayIcon } : displayIcon}
                style={styles.icon}
                contentFit="contain"
                transition={200}
              />
            </View>
          )}
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText} numberOfLines={1}>
                {title}
              </Text>
              {showViewCount && viewCount !== undefined && (
                <View style={styles.viewCountContainer}>
                  <Icon name={'ri-eye-line' as IconName} size={13} color={Colors.darkGrey[700]} />
                  <Text style={styles.viewCountText}>{viewCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.descriptionText} numberOfLines={2}>
              {description}
            </Text>
          </View>
        </View>
        <View style={styles.footerRow}>
          <View style={styles.metaContainer}>
            {location && (
              <>
                <View style={styles.locationContainer}>
                  <View style={styles.locationIconContainer}>
                    <Icon
                      name={'ri-map-pin-line' as IconName}
                      size={13}
                      color={Colors.darkGrey[600]}
                    />
                  </View>
                  <Text style={styles.metaText}>{location}</Text>
                </View>
                <View style={styles.divider} />
              </>
            )}
            <Text style={styles.metaText}>{date}</Text>
          </View>
          <View style={styles.actionContainer}>
            {hasImage && (
              <View style={styles.actionButton}>
                <Icon name={'ri-image-line' as IconName} size={16} color={Colors.darkGrey[700]} />
              </View>
            )}
            {hasAudio && (
              <View style={styles.actionButton}>
                <Icon name={'ri-mic-line' as IconName} size={16} color={Colors.darkGrey[700]} />
              </View>
            )}
            {hasVideo && (
              <View style={styles.actionButton}>
                <Icon name={'ri-vidicon-line' as IconName} size={16} color={Colors.darkGrey[700]} />
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
