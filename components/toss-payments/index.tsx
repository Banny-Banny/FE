/**
 * toss-payments/index.tsx
 * 토스페이먼츠 결제 Feature Container (WebView 기반)
 */

import { useModal } from '@/commons/components/modal/hooks/useModal';
import ConfirmModal from '@/components/timecapsule-create/components/confirm-modal';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PaymentError } from './api/types/types';
import { AgreementDetailModal } from './components/agreement-detail-modal';
import { AgreementsCard } from './components/agreements-card';
import { OrderSummaryCard } from './components/order-summary-card';
import { PaymentFooter } from './components/payment-footer';
import { PaymentWebView } from './components/payment-webview';
import { TEXTS } from './constants';
import { useOrderSummary } from './hooks/useOrderSummary';
import { usePaymentValidation } from './hooks/usePaymentValidation';
import { useTossPayment } from './hooks/useTossPayment';
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

  // ============================================
  // 핸들러
  // ============================================
  const handlePaymentCompleteConfirm = useCallback(() => {
    closeModal();
    if (onSubmit) {
      onSubmit(orderSummary);
    }
  }, [closeModal, onSubmit, orderSummary]);

  // ============================================
  // WebView 결제 핸들러
  // ============================================
  const handleSubmitPress = useCallback(() => {
    if (!isPaymentEnabled) {
      Alert.alert('알림', TEXTS.alerts.agreementRequired);
      return;
    }
    setShowPaymentWebView(true);
  }, [isPaymentEnabled]);

  const handlePaymentSuccess = useCallback(
    async (paymentKey: string, orderId: string, amount: number) => {
      try {
        setShowPaymentWebView(false);

        // ⚠️ 보안 검증: 토스페이먼츠 문서 권장사항
        // 1. orderId 검증: 백엔드에서 생성한 주문 ID와 일치하는지 확인
        if (orderId !== orderData.order_id) {
          Alert.alert('결제 오류', '주문 정보가 일치하지 않습니다.');
          console.error('❌ [TossPayment] orderId 불일치:', { orderId, expected: orderData.order_id });
          return;
        }

        // 2. amount 검증: 클라이언트에서 금액 조작 방지
        // ⚠️ 중요: 쿼리 파라미터의 amount와 결제 요청 시 보낸 amount가 같은지 반드시 확인
        if (amount !== orderData.total_amount) {
          Alert.alert('결제 오류', `결제 금액이 일치하지 않습니다.\n결제 금액: ${amount}원\n주문 금액: ${orderData.total_amount}원`);
          console.error('❌ [TossPayment] amount 불일치:', { amount, expected: orderData.total_amount });
          return;
        }

        // 3. paymentKey 검증: 필수 값 확인
        if (!paymentKey || paymentKey.trim() === '') {
          Alert.alert('결제 오류', '결제 정보가 올바르지 않습니다.');
          console.error('❌ [TossPayment] paymentKey 없음');
          return;
        }

        // 결제 승인 API 호출
        const paymentData = await confirmPayment(paymentKey, orderId, amount);

        // 결제 완료 모달 표시
        openModal({
          width: 344,
          height: 'auto',
          closeOnBackdropPress: true,
          children: <ConfirmModal type="PAYMENT_COMPLETE" onConfirm={handlePaymentCompleteConfirm} />,
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
    [confirmPayment, openModal, onPaymentSuccess, orderData.order_id, orderData.total_amount, handlePaymentCompleteConfirm],
  );

  const handlePaymentFail = useCallback((code: string, message: string) => {
    setShowPaymentWebView(false);
    Alert.alert('결제 실패', message || '결제 처리 중 오류가 발생했습니다.');
  }, []);

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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
        <AgreementsCard
          allAgreed={allAgreed}
          agreements={agreements}
          onAllAgreeToggle={handleAllAgreeToggle}
          onAgreementToggle={handleAgreementToggle}
          onAgreementDetailPress={handleAgreementDetailPress}
        />
      </ScrollView>

      {/* 하단 결제 버튼 */}
      <PaymentFooter
        isLoading={isLoading}
        isPaymentEnabled={isPaymentEnabled}
        onSubmit={handleSubmitPress}
      />

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
        onSuccess={handlePaymentSuccess}
        onFail={handlePaymentFail}
        onClose={() => setShowPaymentWebView(false)}
      />
    </SafeAreaView>
  );
}
