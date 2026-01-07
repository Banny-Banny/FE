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

import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { Colors } from '@/commons/constants';
import { styles } from './styles';

export interface ItemProps {
  id?: string;
  title: string;
  description: string;
  location: string;
  date: string;
  eggIcon?: string | number; // Image source
  hasImage?: boolean;
  hasAudio?: boolean;
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
  onPress,
}: ItemProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          {eggIcon && (
            <View style={styles.iconContainer}>
              <Image
                source={typeof eggIcon === 'string' ? { uri: eggIcon } : eggIcon}
                style={styles.icon}
              />
            </View>
          )}
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText} numberOfLines={1}>
                {title}
              </Text>
              <View style={styles.mediaIconsContainer}>
                {hasImage && (
                  <View style={styles.mediaIconWrapper}>
                    <Icon name={'ri-image-line' as IconName} size={14} color={Colors.grey[500]} />
                  </View>
                )}
                {hasAudio && (
                  <View style={styles.mediaIconWrapper}>
                    <Icon name={'ri-mic-line' as IconName} size={14} color={Colors.grey[500]} />
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.descriptionText} numberOfLines={2}>
              {description}
            </Text>
          </View>
        </View>
        <View style={styles.footerRow}>
          <View style={styles.metaContainer}>
            <View style={styles.locationContainer}>
              <View style={styles.locationIconContainer}>
                <Icon name={'ri-map-pin-line' as IconName} size={12} color={Colors.grey[500]} />
              </View>
              <Text style={styles.metaText}>{location}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.metaText}>{date}</Text>
          </View>
          <View style={styles.actionContainer}>
            {hasImage && (
              <View style={styles.actionButton}>
                <Icon name={'ri-image-line' as IconName} size={16} color={Colors.grey[500]} />
              </View>
            )}
            {hasAudio && (
              <View style={styles.actionButton}>
                <Icon name={'ri-mic-line' as IconName} size={16} color={Colors.grey[500]} />
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
