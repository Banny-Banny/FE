/**
 * app/(tabs)/customer-service/chat.tsx
 * 채팅방 페이지 (단순화)
 * - 한 유저당 채팅방 1개만 존재
 */

import { ChatRoom } from '@/components/customer-service/components/chat-room';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';

export default function ChatRoomPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleBack = () => {
    queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    router.replace('/(tabs)/customer-service' as any);
  };

  return (
    <ChatRoom 
      inquiryTitle="고객센터" 
      onBack={handleBack}
    />
  );
}
