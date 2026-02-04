/**
 * toss-payments/index.tsx
 * 토스페이먼츠 결제 Feature Container (WebView 기반)
 */

import { TimeCapsuleHeader } from '@/commons/components/timecapsule-header';
import type { CreateOrderResponse } from '@/components/timecapsule-create/components/step-info/api/types/order';
import { apiClient } from '@/utils';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, View } from 'react-native';
import { updateOrderStatus } from './api/payment';
import { PaymentError } from './api/types/types';
import { AgreementDetailModal } from './components/agreement-detail-modal';
import { AgreementsCard } from './components/agreements-card';
import { OrderSummaryCard } from './components/order-summary-card';
import { PaymentFooter } from './components/payment-footer';
import { PaymentMethodSelector } from './components/payment-method-selector';
import { PaymentMethod, PaymentWebView } from './components/payment-webview';
import { TEXTS } from './constants';
import { useOrderSummary } from './hooks/useOrderSummary';
import { usePaymentValidation } from './hooks/usePaymentValidation';
import { SKIP_PAYMENT, useTossPayment } from './hooks/useTossPayment';
import { styles } from './styles';
import { TossPaymentProps } from './types';

export default function TossPayment({
  formData,
  orderData,
  onSubmit,
  onBack,
  onPaymentSuccess,
}: TossPaymentProps) {
  // ============================================
  // Hooks
  // ============================================
  const { allAgreed, agreements, isPaymentEnabled, handleAllAgreeToggle, handleAgreementToggle } =
    usePaymentValidation();
  const orderSummary = useOrderSummary(orderData);
  const { isLoading, confirmPayment } = useTossPayment();
  const [selectedAgreementIndex, setSelectedAgreementIndex] = useState<number | null>(null);
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('간편결제');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); // 결제 처리 중 플래그

  // ============================================
  // 디버깅: 결제 금액 확인
  // ============================================
  useEffect(() => {
  }, [orderData]);

  // ============================================
  // 웹 환경: 페이지 로드 시 URL 파라미터 확인 (결제 완료 후 리다이렉트 처리)
  // ============================================
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const checkUrlParams = async () => {
      try {
        const urlObj = new URL(window.location.href);
        const paymentKey = urlObj.searchParams.get('paymentKey');
        const orderIdParam = urlObj.searchParams.get('orderId');
        const amountParam = urlObj.searchParams.get('amount');

        // 토스페이먼츠 리다이렉트 파라미터 확인
        if (paymentKey && orderIdParam && amountParam) {
          // URL 파라미터 제거 (중복 처리 방지)
          window.history.replaceState({}, '', window.location.pathname);

          // 결제 성공 처리 (API 호출 후 자동으로 step 3으로 이동)
          await handlePaymentSuccess(paymentKey, orderIdParam, parseInt(amountParam));
        }
      } catch (error) {
      }
    };

    checkUrlParams();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // ============================================
  // 핸들러
  // ============================================
  const handlePaymentSuccess = useCallback(
    async (paymentKey: string, orderId: string, amount: number) => {
      // 중복 호출 방지: 이미 처리 중인 경우 무시
      if (isProcessingPayment) {
        return;
      }
      setIsProcessingPayment(true); // 플래그 설정

      try {
        // ⚠️ 결제 승인 성공 시에만 모달을 닫음 (에러 발생 시 재시도 가능하도록)
        // setShowPaymentWebView(false); // 아래로 이동

        // ⚠️ 보안 검증: 토스페이먼츠 문서 권장사항
        // 1. orderId 검증: 백엔드에서 생성한 주문 ID와 일치하는지 확인
        if (orderId !== orderData.order_id) {
          Alert.alert('결제 오류', '주문 정보가 일치하지 않습니다.');
          return;
        }

        // 2. amount 검증: 클라이언트에서 금액 조작 방지
        // ⚠️ 중요: 쿼리 파라미터의 amount와 결제 요청 시 보낸 amount가 같은지 반드시 확인
        if (amount !== orderData.total_amount) {
          Alert.alert(
            '결제 오류',
            `결제 금액이 일치하지 않습니다.\n결제 금액: ${amount}원\n주문 금액: ${orderData.total_amount}원`,
          );
          return;
        }

        // 3. paymentKey 검증: 필수 값 확인
        if (!paymentKey || paymentKey.trim() === '') {
          Alert.alert('결제 오류', '결제 정보가 올바르지 않습니다.');
          return;
        }

        // ============================================
        // 결제 승인 API 호출 (모든 환경)
        // ⚠️ 결제 승인 실패 시 주문 상태를 변경하지 않음
        // ============================================
        let paymentData;
        try {
          paymentData = await confirmPayment(paymentKey, orderId, amount);
          // 결제 승인 성공 시 모달 닫기
          setShowPaymentWebView(false);
        } catch (confirmError: any) {
          // 결제 승인 실패 시 에러 처리
          // 결제 시간 만료 에러의 경우 사용자가 다시 결제를 시도할 수 있도록 모달 유지
          const isPaymentExpired =
            confirmError.message?.includes('결제 시간이 만료') ||
            confirmError.message?.includes('NOT_FOUND_PAYMENT_SESSION');

          if (isPaymentExpired) {
            // 결제 시간 만료: 모달을 유지하고 사용자에게 안내
            Alert.alert(
              '결제 시간 만료',
              '결제 시간이 만료되었습니다.\n\n결제창을 닫고 다시 결제를 시도해주세요.',
              [
                {
                  text: '확인',
                  onPress: () => {
                    // 모달을 닫고 사용자가 다시 결제 버튼을 클릭할 수 있도록 함
                    setShowPaymentWebView(false);
                  },
                },
              ],
            );
          } else {
            // 기타 에러: 모달을 닫고 에러 표시
            setShowPaymentWebView(false);
            Alert.alert(
              '결제 승인 실패',
              confirmError.message || '결제 승인에 실패했습니다. 다시 시도해주세요.',
            );
          }

          throw confirmError; // 에러를 다시 throw하여 catch 블록으로 전달
        }

        // ============================================
        // 주문 상태 변경 API 호출 (POST /api/orders/:orderId/status)
        // ⚠️ 결제 승인이 성공한 경우에만 실행됨
        // ============================================
        try {
          const orderStatusResponse = await updateOrderStatus(orderId, 'PAID');

          // 응답 데이터에서 주문 상태 확인
          if (orderStatusResponse.order_status) {
          }
          if (orderStatusResponse.order_id) {
          }
          if (orderStatusResponse.payment_status !== undefined) {
          }
          if (orderStatusResponse.updated_at) {
          }

          // 주문 상태가 PAID로 변경되었는지 확인
          if (orderStatusResponse.order_status === 'PAID') {
          } else {
          }
        } catch (err: any) {
          if (err.response) {
          }
          // 주문 상태 변경 실패는 경고만 표시하고 결제 플로우는 계속 진행
        }

        // ⚠️ 먼저 step 3으로 이동 (대기실)
        // 모달은 대기실 페이지에서 표시됨
        if (onSubmit) {
          onSubmit(orderSummary);
        }

        if (onPaymentSuccess) {
          onPaymentSuccess(paymentData);
        }
      } catch (err) {
        const errorMessage =
          err && typeof err === 'object' && 'message' in err
            ? (err as PaymentError).message
            : '결제 승인에 실패했습니다';
        Alert.alert('결제 승인 실패', errorMessage);
      } finally {
        // 처리 완료 후 플래그 해제 (성공/실패 관계없이)
        setIsProcessingPayment(false);
      }
    },
    [
      confirmPayment,
      onSubmit,
      onPaymentSuccess,
      orderData.order_id,
      orderData.total_amount,
      orderSummary,
      setShowPaymentWebView,
      isProcessingPayment,
    ],
  );

  const handlePaymentFail = useCallback((code: string, message: string) => {
    setShowPaymentWebView(false);
    Alert.alert('결제 실패', message || '결제 처리 중 오류가 발생했습니다.');
  }, []);

  // ============================================
  // WebView 결제 핸들러
  // ============================================
  const handleSubmitPress = useCallback(async () => {
    if (!isPaymentEnabled) {
      Alert.alert('알림', TEXTS.alerts.agreementRequired);
      return;
    }

    // ============================================
    // 개발 모드: 결제 자동 건너뛰기
    // ============================================
    if (SKIP_PAYMENT) {
      // Mock 결제 데이터로 즉시 성공 처리
      const mockPaymentKey = 'mock-payment-key-' + Date.now();
      handlePaymentSuccess(mockPaymentKey, orderData.order_id, orderData.total_amount);
      return;
    }

    // ============================================
    // ⚠️ 중요: 결제 직전에 주문 데이터를 다시 조회하여 최신 정보 사용
    // 결제 세션 만료 방지를 위해 주문을 갱신
    // ============================================
    try {
      // 주문 데이터 다시 조회 (결제 세션 갱신)
      // 백엔드 API 응답 구조에 따라 조정 필요
      const response = await apiClient.get<{ order: CreateOrderResponse } | CreateOrderResponse>(
        `/api/orders/${orderData.order_id}`,
      );

      // 응답 구조에 따라 데이터 추출
      const latestOrderData = 'order' in response.data ? response.data.order : response.data;
      // 최신 주문 데이터로 업데이트 (결제 세션 갱신)
      // orderData는 props이므로 직접 수정할 수 없지만,
      // PaymentWebView/PaymentWidgetWeb에 최신 데이터를 전달할 수 있도록 함
      // 현재는 orderData를 그대로 사용하되, 백엔드에서 주문 조회 시 세션이 갱신될 것으로 예상

      setShowPaymentWebView(true);
    } catch (error: any) {
      Alert.alert('주문 조회 실패', '주문 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
      return;
    }
  }, [isPaymentEnabled, handlePaymentSuccess, orderData.order_id, orderData.total_amount]);

  const handleBackPress = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  const handleAgreementDetailPress = useCallback((index: number) => {
    setSelectedAgreementIndex(index);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedAgreementIndex(null);
  }, []);

  // ============================================
  // 렌더링
  // ============================================
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <TimeCapsuleHeader title={TEXTS.header.title} onBack={handleBackPress} titleAlign="left" />
      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <OrderSummaryCard orderSummary={orderSummary} />
        <PaymentMethodSelector
          selectedMethod={selectedPaymentMethod}
          onSelectMethod={setSelectedPaymentMethod}
        />
        <AgreementsCard
          allAgreed={allAgreed}
          agreements={agreements}
          onAllAgreeToggle={handleAllAgreeToggle}
          onAgreementToggle={handleAgreementToggle}
          onAgreementDetailPress={handleAgreementDetailPress}
        />

        {/* 결제 버튼 */}
        <PaymentFooter
          isLoading={isLoading}
          isPaymentEnabled={isPaymentEnabled}
          onSubmit={handleSubmitPress}
        />
      </ScrollView>

      {/* 약관 상세 모달 */}
      <AgreementDetailModal
        visible={selectedAgreementIndex !== null}
        selectedIndex={selectedAgreementIndex}
        onClose={handleModalClose}
      />

      {/* 결제창 WebView (백엔드 금액 사용!) */}
      <PaymentWebView
        visible={showPaymentWebView}
        orderId={orderData.order_id}
        amount={orderData.total_amount}
        orderName="타임캡슐 생성"
        customerName={formData.capsuleName}
        paymentMethod={selectedPaymentMethod}
        onSuccess={handlePaymentSuccess}
        onFail={handlePaymentFail}
        onClose={() => {
          setShowPaymentWebView(false);
          setIsProcessingPayment(false); // 웹뷰 닫을 때 플래그 초기화
        }}
      />
    </View>
  );
}
