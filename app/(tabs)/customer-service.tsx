/**
 * app/(tabs)/customer-service.tsx
 * 고객센터 페이지 (문의 내역 리스트)
 */

import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { InquiryList } from '@/components/customer-service/components/inquiry-list';
import { useInquiries } from '@/components/customer-service/hooks/useInquiries';
import { Inquiry } from '@/components/customer-service/types';
import { ROUTES } from '@/commons/constants';
import { Toast } from '@/commons/components/toast';

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
    router.push(`/(tabs)/customer-service/${inquiry.id}` as any);
  };

  const handleNewInquiryPress = () => {
    // 새 문의 생성: join_room 이벤트가 자동으로 새 문의를 생성하므로
    // 특별한 inquiryId ('new')로 채팅방 페이지로 이동
    // 채팅방 페이지에서 join_room을 inquiryId 없이 호출하여 새 문의 생성
    router.push('/(tabs)/customer-service/new' as any);
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
