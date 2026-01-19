/**
 * app/(tabs)/customer-service.tsx
 * 고객센터 페이지 (문의 내역 리스트)
 */

import React from 'react';
import { useRouter } from 'expo-router';
import { InquiryList } from '@/components/customer-service/components/inquiry-list';
import { useMockInquiries } from '@/components/customer-service/hooks/useMockInquiries';
import { Inquiry } from '@/components/customer-service/types';
import { ROUTES } from '@/commons/constants';

export default function CustomerServicePage() {
  const router = useRouter();
  const { inquiries, isLoading } = useMockInquiries();

  const handleInquiryPress = (inquiry: Inquiry) => {
    router.push(`/(tabs)/customer-service/${inquiry.id}` as any);
  };

  const handleNewInquiryPress = () => {
    // Mock: 새 문의 생성 후 채팅창 진입
    // 실제로는 새 문의를 생성하고 그 ID로 채팅창 진입
    const newInquiryId = `inquiry-new-${Date.now()}`;
    router.push(`/(tabs)/customer-service/${newInquiryId}` as any);
  };

  return <InquiryList inquiries={inquiries} onInquiryPress={handleInquiryPress} onNewInquiryPress={handleNewInquiryPress} isLoading={isLoading} />;
}
