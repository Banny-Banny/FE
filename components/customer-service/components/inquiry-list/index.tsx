/**
 * components/customer-service/components/inquiry-list/index.tsx
 * 문의 내역 리스트 컨테이너 컴포넌트
 */

import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Inquiry } from '../../types';
import { InquiryItem } from '../inquiry-item';
import { NewInquiryButton } from '../new-inquiry-button';
import { styles } from './styles';
import { InquiryListProps } from './types';

export function InquiryList({ inquiries = [], onInquiryPress, onNewInquiryPress, isLoading = false }: InquiryListProps) {
  const renderItem = ({ item }: { item: Inquiry }) => {
    return <InquiryItem inquiry={item} onPress={onInquiryPress} />;
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>문의 내역이 없습니다.{'\n'}새 문의를 시작해보세요.</Text>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerWrapper}>
        <NewInquiryButton onPress={onNewInquiryPress} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={inquiries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
