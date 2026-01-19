/**
 * components/timecapsule-create/pages/room/index.tsx
 * 타임캡슐 생성 - 대기실 페이지 (비즈니스 로직)
 *
 * 역할:
 * - 참여자들이 모두 입력을 완료할 때까지 대기
 * - StepRoom 컴포넌트를 래핑하여 사용
 * - payment 페이지에서 전달받은 orderId를 route params로 수신
 * - 완료 후 메인 페이지 또는 캡슐 보관함으로 이동
 *
 * StepRoom Props 참고:
 * - role: 'host' | 'guest' (필수)
 * - orderId?: string (방장용 - 대기실 생성)
 * - capsuleId?: string (게스트용 - 딥링크로 입장)
 * - inviteCode?: string (게스트용 - 콘텐츠 제출 시 필요)
 * - onSubmit?: () => void (타임캡슐 묻기 완료 핸들러)
 */

import { ROUTES } from '@/commons/constants';
import { Spinner } from '@/commons/components/spinner';
import StepRoom from '@/components/timecapsule-create/components/step-room';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

/**
 * 타임캡슐 생성 - 대기실 페이지
 */
export default function TimeCapsuleCreateRoom() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // route params에서 orderId 수신
  const orderId = params.orderId as string | undefined;

  /**
   * orderId가 없으면 info 페이지로 리다이렉트
   * - 잘못된 경로로 직접 접근한 경우
   */
  useEffect(() => {
    if (!orderId) {
      setIsRedirecting(true);
      router.replace('/timecapsule/info');
    }
  }, [orderId, router]);

  // 리다이렉트 중이거나 orderId 없으면 로딩 표시
  if (isRedirecting || !orderId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </View>
    );
  }

  /**
   * 타임캡슐 묻기 완료 핸들러
   * - 메인 페이지로 이동
   */
  const handleSubmit = () => {
    router.push(ROUTES.MAIN);
  };

  // 결제 완료 후 진입이므로 항상 호스트
  const userRole: 'host' | 'guest' = 'host';

  return (
    <View style={{ flex: 1 }}>
      <StepRoom
        role={userRole}
        orderId={orderId}
        onSubmit={handleSubmit}
        // capsuleId, inviteCode는 게스트용 optional props
      />
    </View>
  );
}
