/**
 * app/(tabs)/timecapsule/payment-callback.tsx
 * 타임캡슐 결제 완료 콜백 페이지
 *
 * 역할:
 * - 토스페이먼츠 결제 완료 후 리다이렉트 받는 페이지
 * - URL 파라미터에서 결제 정보 확인
 * - 결제 승인 API 호출
 * - 주문 상태 업데이트
 * - 대기실로 이동 (결제 완료 플래그와 함께)
 *
 * ⚠️ HIDDEN_SCREENS에 등록되어 탭 네비게이션에서 숨김 처리됨
 */

import { Spinner } from '@/commons/components/spinner';
import { updateOrderStatus } from '@/components/toss-payments/api/payment';
import { useTossPayment } from '@/components/toss-payments/hooks/useTossPayment';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, View } from 'react-native';

export default function PaymentCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { confirmPayment } = useTossPayment();
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessedRef = useRef(false); // 무한 루프 방지 플래그
  const routerRef = useRef(router); // router를 ref로 저장 (의존성 배열 최적화)

  // router ref 업데이트
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  // URL 파라미터에서 결제 정보 추출 (의존성 배열 최적화)
  const paymentKey = (params.paymentKey as string | undefined) || '';
  const orderId = (params.orderId as string | undefined) || '';
  const amountParam = (params.amount as string | undefined) || '';

  useEffect(() => {
    // 이미 처리된 경우 무시 (무한 루프 방지)
    if (hasProcessedRef.current) {
      return;
    }

    // 필수 파라미터가 없으면 처리하지 않음
    if (!paymentKey || !orderId || !amountParam) {
      return;
    }

    const processPayment = async () => {
      // 처리 시작 플래그 설정
      hasProcessedRef.current = true;

      try {
        const amount = parseInt(amountParam);

        // 금액 파싱 검증
        if (isNaN(amount) || amount <= 0) {
          Alert.alert('결제 오류', '결제 금액이 올바르지 않습니다.', [
            {
              text: '확인',
              onPress: () => {
                routerRef.current.replace('/timecapsule/info');
              },
            },
          ]);
          return;
        }

        // 결제 승인 API 호출
        const paymentData = await confirmPayment(paymentKey, orderId, amount);

        // 주문 상태 변경 API 호출
        try {
          await updateOrderStatus(orderId, 'PAID');
        } catch (err: any) {
          // 주문 상태 변경 실패는 경고만 표시하고 결제 플로우는 계속 진행
          console.warn('주문 상태 변경 실패:', err);
        }

        // 대기실로 이동 (결제 완료 플래그와 함께)
        routerRef.current.replace({
          pathname: '/timecapsule/room',
          params: {
            orderId,
            paymentCompleted: 'true',
          },
        });
      } catch (error: any) {
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? (error as { message: string }).message
            : '결제 승인에 실패했습니다';

        Alert.alert('결제 승인 실패', errorMessage, [
          {
            text: '확인',
            onPress: () => {
              routerRef.current.replace('/timecapsule/info');
            },
          },
        ]);
      } finally {
        setIsProcessing(false);
      }
    };

    // 웹 환경에서만 실행 (모바일은 WebView에서 처리)
    if (Platform.OS === 'web') {
      processPayment();
    } else {
      // 모바일 환경에서는 이 페이지로 오지 않음 (WebView에서 처리)
      hasProcessedRef.current = true;
      routerRef.current.replace('/timecapsule/info');
    }
  }, [paymentKey, orderId, amountParam, confirmPayment]); // router 제거 (useRef로 관리)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Spinner />
    </View>
  );
}
