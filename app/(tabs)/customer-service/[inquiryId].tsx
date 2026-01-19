/**
 * app/(tabs)/customer-service/[inquiryId].tsx
 * 채팅방 페이지 (동적 라우트)
 */

import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChatRoom } from '@/components/customer-service/components/chat-room';
import { getMockInquiryById } from '@/components/customer-service/mocks/inquiries';

export default function ChatRoomPage() {
  const { inquiryId } = useLocalSearchParams<{ inquiryId: string }>();
  const router = useRouter();

  // Mock 데이터에서 문의 정보 로드
  const inquiry = inquiryId ? getMockInquiryById(inquiryId) : null;
  const inquiryTitle = inquiry?.title || '고객센터';

  const handleBack = () => {
    router.back();
  };

  if (!inquiryId) {
    return null;
  }

  return <ChatRoom inquiryId={inquiryId} inquiryTitle={inquiryTitle} onBack={handleBack} />;
}
