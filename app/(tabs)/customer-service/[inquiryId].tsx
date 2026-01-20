/**
 * app/(tabs)/customer-service/[inquiryId].tsx
 * 채팅방 페이지 (동적 라우트)
 */

import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChatRoom } from '@/components/customer-service/components/chat-room';
import { getMockInquiryById } from '@/components/customer-service/mocks/inquiries';

export default function ChatRoomPage() {
  const { inquiryId: paramInquiryId } = useLocalSearchParams<{ inquiryId: string }>();
  const router = useRouter();
  const [inquiryId, setInquiryId] = useState<string>(paramInquiryId || '');

  // 새 문의 생성 시 서버 응답에서 받은 inquiryId로 URL 업데이트
  useEffect(() => {
    if (paramInquiryId === 'new' && inquiryId && inquiryId !== 'new') {
      // 서버에서 받은 실제 inquiryId로 URL 업데이트
      router.replace(`/(tabs)/customer-service/${inquiryId}` as any);
    }
  }, [inquiryId, paramInquiryId, router]);

  // Mock 데이터에서 문의 정보 로드 (새 문의가 아닌 경우만)
  const inquiry = inquiryId && inquiryId !== 'new' ? getMockInquiryById(inquiryId) : null;
  const inquiryTitle = inquiry?.title || '고객센터';

  const handleBack = () => {
    router.back();
  };

  const handleInquiryIdReceived = (newInquiryId: string) => {
    // 서버에서 받은 inquiryId 저장
    setInquiryId(newInquiryId);
  };

  if (!paramInquiryId) {
    return null;
  }

  return (
    <ChatRoom 
      inquiryId={inquiryId === 'new' ? undefined : inquiryId} // 'new'이면 undefined 전달하여 join_room이 새 문의 생성
      inquiryTitle={inquiryTitle} 
      onBack={handleBack}
      onInquiryIdReceived={handleInquiryIdReceived}
    />
  );
}
