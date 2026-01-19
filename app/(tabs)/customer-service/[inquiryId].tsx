/**
 * app/(tabs)/customer-service/[inquiryId].tsx
 * 고객센터 채팅창 페이지
 */

import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import { styles } from '@/components/customer-service/styles';
import { getMockInquiryById } from '@/components/customer-service/mocks/inquiries';

export default function CustomerServiceChatPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const inquiryId = Array.isArray(params.inquiryId) ? params.inquiryId[0] : params.inquiryId;

  // Mock: 문의 정보 조회
  const inquiry = inquiryId ? getMockInquiryById(inquiryId) : null;

  if (!inquiryId) {
    return (
      <View style={styles.container}>
        <Text>문의 ID가 없습니다.</Text>
      </View>
    );
  }

  // Phase 2에서 채팅 UI 구현 예정
  return (
    <View style={styles.container}>
      <Text>채팅창 (Phase 2에서 구현 예정)</Text>
      <Text>문의 ID: {inquiryId}</Text>
      {inquiry && <Text>문의 제목: {inquiry.title}</Text>}
    </View>
  );
}
