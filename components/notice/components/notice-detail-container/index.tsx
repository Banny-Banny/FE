/**
 * components/notice/components/notice-detail-container/index.tsx
 * 공지사항 상세 Feature Container
 *
 * Feature Slice Architecture 패턴에 따라
 * 비즈니스 로직과 UI 컴포넌트를 조립하는 컨테이너
 */

import { Colors, ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon, { type IconName } from 'react-native-remix-icon';
import { useNoticeDetail } from '../../hooks/useNoticeDetail';
import { styles } from '../../styles';
import { NoticeDetail } from '../notice-detail';

export default function NoticeDetailContainer() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notice, isLoading, error, refetch } = useNoticeDetail(id || '');

  const handleClose = () => {
    navigation.replace(ROUTES.NOTICES);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>공지사항</Text>
        </View>
        <Pressable style={styles.headerCloseButton} onPress={handleClose}>
          <Icon name={'ri-close-line' as IconName} size={24} color={Colors.black[500]} />
        </Pressable>
      </View>

      {/* 공지사항 상세 */}
      <NoticeDetail notice={notice} isLoading={isLoading} error={error} onRetry={refetch} />
    </View>
  );
}
