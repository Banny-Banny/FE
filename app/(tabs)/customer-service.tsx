/**
 * app/(tabs)/customer-service.tsx
 * 고객센터 페이지 (문의 내역 리스트)
 */

import { Colors, ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';
import { Toast } from '@/commons/components/toast';
import { InquiryList } from '@/components/customer-service/components/inquiry-list';
import { useInquiries } from '@/components/customer-service/hooks/useInquiries';
import { Inquiry } from '@/components/customer-service/types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from '@/components/customer-service/styles';

export default function CustomerServicePage() {
  const router = useRouter();
  const navigation = useNavigation();
  const { inquiries, isLoading, error } = useInquiries({ sortBy: 'latest' });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleInquiryPress = (inquiry: Inquiry) => {
    // 한 유저당 채팅방 1개만 존재하므로 바로 채팅방으로 이동
    router.push(`/(tabs)/customer-service/chat` as any);
  };

  const handleNewInquiryPress = () => {
    // 한 유저당 채팅방 1개만 존재하므로 바로 채팅방으로 이동
    router.push(`/(tabs)/customer-service/chat` as any);
  };

  const handleClose = () => {
    navigation.replace(ROUTES.MY_PAGE);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>고객센터</Text>
          {inquiries.length > 0 && (
            <Text style={styles.headerSubtitle}>총 {inquiries.length}개의 문의</Text>
          )}
        </View>
        <Pressable style={styles.headerCloseButton} onPress={handleClose}>
          <Icon name="ri-close-line" size={24} color={Colors.black[500]} />
        </Pressable>
      </View>

      {/* 문의 내역 리스트 */}
      <InquiryList 
        inquiries={inquiries} 
        onInquiryPress={handleInquiryPress} 
        onNewInquiryPress={handleNewInquiryPress} 
        isLoading={isLoading} 
      />
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}
