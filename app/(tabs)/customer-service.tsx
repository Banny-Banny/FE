/**
 * app/(tabs)/customer-service.tsx
 * 고객센터 페이지 (문의 내역 리스트)
 */

import { Toast } from '@/commons/components/toast';
import { InquiryList } from '@/components/customer-service/components/inquiry-list';
import { useInquiries } from '@/components/customer-service/hooks/useInquiries';
import { Inquiry } from '@/components/customer-service/types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function CustomerServicePage() {
  const router = useRouter();
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

  return (
    <>
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
    </>
  );
}
