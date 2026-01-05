/**
 * toss-payments/index.tsx
 * 토스페이먼츠 결제 Feature Container (WebView 기반)
 */

import { useModal } from '@/commons/components/modal/hooks/useModal';
import ConfirmModal from '@/components/timecapsule-create/components/confirm-modal';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
  const { openModal, closeModal } = useModal();
  const { allAgreed, agreements, isPaymentEnabled, handleAllAgreeToggle, handleAgreementToggle } =
    usePaymentValidation();
  const orderSummary = useOrderSummary(orderData);
  const { isLoading, confirmPayment } = useTossPayment();
  const [selectedAgreementIndex, setSelectedAgreementIndex] = useState<number | null>(null);
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('간편결제');

  // ============================================
  // 디버깅: 결제 금액 확인
  // ============================================
  useEffect(() => {
    console.log('💰 [TossPayment] 결제 금액 확인:');
    console.log('  - orderData.total_amount:', orderData.total_amount);
    console.log('  - orderData 전체:', JSON.stringify(orderData, null, 2));
  }, [orderData]);

  // ============================================
  // 핸들러
  // ============================================
  const handlePaymentCompleteConfirm = useCallback(() => {
    closeModal();
    if (onSubmit) {
      onSubmit(orderSummary);
    }
  }, [closeModal, onSubmit, orderSummary]);

  const handlePaymentSuccess = useCallback(
    async (paymentKey: string, orderId: string, amount: number) => {
      try {
        setShowPaymentWebView(false);

        // ⚠️ 보안 검증: 토스페이먼츠 문서 권장사항
        // 1. orderId 검증: 백엔드에서 생성한 주문 ID와 일치하는지 확인
        if (orderId !== orderData.order_id) {
          Alert.alert('결제 오류', '주문 정보가 일치하지 않습니다.');
          console.error('❌ [TossPayment] orderId 불일치:', {
            orderId,
            expected: orderData.order_id,
          });
          return;
        }

        // 2. amount 검증: 클라이언트에서 금액 조작 방지
        // ⚠️ 중요: 쿼리 파라미터의 amount와 결제 요청 시 보낸 amount가 같은지 반드시 확인
        if (amount !== orderData.total_amount) {
          Alert.alert(
            '결제 오류',
            `결제 금액이 일치하지 않습니다.\n결제 금액: ${amount}원\n주문 금액: ${orderData.total_amount}원`,
          );
          console.error('❌ [TossPayment] amount 불일치:', {
            amount,
            expected: orderData.total_amount,
          });
          return;
        }

        // 3. paymentKey 검증: 필수 값 확인
        if (!paymentKey || paymentKey.trim() === '') {
          Alert.alert('결제 오류', '결제 정보가 올바르지 않습니다.');
          console.error('❌ [TossPayment] paymentKey 없음');
          return;
        }

        // ============================================
        // 테스트 결제 모드: 임의의 paymentKey로 백엔드 API 호출
        // ============================================
        const isTestPaymentKey =
          paymentKey.startsWith('test_payment_key_') || paymentKey.startsWith('test-payment-key-');

        let paymentData;
        if (isTestPaymentKey) {
          console.log('🧪 [TossPayment] 테스트 결제 모드: 백엔드 API 호출');
          console.log('  - paymentKey:', paymentKey);
          console.log('  - orderId:', orderId);
          console.log('  - amount:', amount);

          // 테스트 paymentKey로 백엔드 API 호출 시도
          // 백엔드에서 테스트 paymentKey를 지원하지 않을 수 있으므로 에러 처리
          try {
            paymentData = await confirmPayment(paymentKey, orderId, amount);
            console.log('✅ [TossPayment] 결제 승인 API 호출 성공');
          } catch (err: any) {
            // 백엔드에서 테스트 paymentKey를 거부하는 경우 (500 에러 등)
            console.warn('⚠️ [TossPayment] 백엔드 결제 승인 API 호출 실패:', err);
            console.warn(
              '⚠️ [TossPayment] 테스트 paymentKey를 백엔드에서 지원하지 않을 수 있습니다.',
            );
            console.warn('⚠️ [TossPayment] Mock 데이터로 진행합니다.');

            // Mock 데이터 생성 (결제 플로우는 계속 진행)
            paymentData = {
              order_id: orderId,
              payment_key: paymentKey,
              status: 'DONE',
              amount: amount,
              approved_at: new Date().toISOString(),
              capsule_id: '',
              receipt_url: '',
            };
          }
        } else {
          // 실제 결제 승인 API 호출
          paymentData = await confirmPayment(paymentKey, orderId, amount);
        }

        // ============================================
        // 주문 상태 변경 API 호출 (POST /api/orders/:orderId/status)
        // ============================================
        try {
          console.log('🔄 [TossPayment] 주문 상태 변경 API 호출');
          console.log('  - orderId:', orderId);
          console.log('  - status: PAID');
          console.log('  - method: POST');
          console.log('  - endpoint: /api/orders/:orderId/status');

          const orderStatusResponse = await updateOrderStatus(orderId, 'PAID');

          // 응답 데이터에서 주문 상태 확인
          if (orderStatusResponse.order_status) {
            console.log('  - 변경된 주문 상태:', orderStatusResponse.order_status);
          }
          if (orderStatusResponse.order_id) {
            console.log('  - 주문 ID:', orderStatusResponse.order_id);
          }
          if (orderStatusResponse.payment_status !== undefined) {
            console.log('  - 결제 상태:', orderStatusResponse.payment_status);
          }
          if (orderStatusResponse.updated_at) {
            console.log('  - 업데이트 시간:', orderStatusResponse.updated_at);
          }

          // 주문 상태가 PAID로 변경되었는지 확인
          if (orderStatusResponse.order_status === 'PAID') {
            console.log('✅ [TossPayment] 주문 상태가 PAID로 성공적으로 변경되었습니다.');
          } else {
            console.warn(
              '⚠️ [TossPayment] 주문 상태가 예상과 다릅니다. 예상: PAID, 실제:',
              orderStatusResponse.order_status,
            );
          }
        } catch (err: any) {
          console.error('❌ [TossPayment] 주문 상태 변경 실패:', err);
          if (err.response) {
            console.error('  - 응답 상태:', err.response.status);
            console.error('  - 응답 데이터:', err.response.data);
          }
          // 주문 상태 변경 실패는 경고만 표시하고 결제 플로우는 계속 진행
          console.warn('⚠️ [TossPayment] 주문 상태 변경 실패했지만 결제는 완료되었습니다.');
        }

        // ============================================
        // 실제 결제 로직 (주석처리)
        // ============================================
        /*
        // 결제 승인 API 호출 (실제 서버에 저장)
        const paymentData = await confirmPayment(paymentKey, orderId, amount);
        */

        // 결제 완료 모달 표시
        openModal({
          width: 344,
          height: 242,
          closeOnBackdropPress: true,
          children: (
            <ConfirmModal type="PAYMENT_COMPLETE" onConfirm={handlePaymentCompleteConfirm} />
          ),
        });

        if (onPaymentSuccess) {
          onPaymentSuccess(paymentData);
        }
      } catch (err) {
        const errorMessage =
          err && typeof err === 'object' && 'message' in err
            ? (err as PaymentError).message
            : '결제 승인에 실패했습니다';
        console.error('❌ [TossPayment] 결제 승인 실패:', errorMessage);
        Alert.alert('결제 승인 실패', errorMessage);
      }
    },
    [
      confirmPayment,
      openModal,
      onPaymentSuccess,
      orderData.order_id,
      orderData.total_amount,
      handlePaymentCompleteConfirm,
    ],
  );

  const handlePaymentFail = useCallback((code: string, message: string) => {
    setShowPaymentWebView(false);
    Alert.alert('결제 실패', message || '결제 처리 중 오류가 발생했습니다.');
  }, []);

  // ============================================
  // WebView 결제 핸들러
  // ============================================
  const handleSubmitPress = useCallback(() => {
    if (!isPaymentEnabled) {
      Alert.alert('알림', TEXTS.alerts.agreementRequired);
      return;
    }

    // ============================================
    // 개발 모드: 결제 자동 건너뛰기
    // ============================================
    if (SKIP_PAYMENT) {
      console.log('🔧 [개발 모드] 결제 WebView 건너뛰기 - 자동으로 결제 성공 처리');
      // Mock 결제 데이터로 즉시 성공 처리
      const mockPaymentKey = 'mock-payment-key-' + Date.now();
      handlePaymentSuccess(mockPaymentKey, orderData.order_id, orderData.total_amount);
      return;
    }

    setShowPaymentWebView(true);
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
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="뒤로가기">
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{TEXTS.header.title}</Text>
        </View>
        <View style={styles.headerBorder} />
      </View>

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
        onClose={() => setShowPaymentWebView(false)}
      />
    </View>
  );
}
