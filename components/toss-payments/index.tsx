/**
 * toss-payments/index.tsx
 * 토스페이먼츠 결제 Feature Container
 */

import { useModal } from '@/commons/components/modal/hooks/useModal';
import ConfirmModal from '@/components/timecapsule-create/components/confirm-modal';
import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AgreementDetailModal } from './components/agreement-detail-modal';
import { AgreementsCard } from './components/agreements-card';
import { OrderSummaryCard } from './components/order-summary-card';
import { PaymentFooter } from './components/payment-footer';
import { TEXTS } from './constants';
import { useOrderSummary } from './hooks/useOrderSummary';
import { useDeepLinkHandler, usePaymentHandlers } from './hooks/usePaymentHandlers';
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
  const { isLoading, requestPayment, confirmPayment } = useTossPayment();
  const [selectedAgreementIndex, setSelectedAgreementIndex] = useState<number | null>(null);

  // ============================================
  // 핸들러
  // ============================================
  const handlePaymentCompleteConfirm = useCallback(() => {
    closeModal();
    if (onSubmit) {
      onSubmit(orderSummary);
    }
  }, [closeModal, onSubmit, orderSummary]);

  const { handleBackPress, handleSubmitPress, handlePaymentSuccess } = usePaymentHandlers({
    isPaymentEnabled,
    orderData,
    formData,
    orderSummary,
    requestPayment,
    confirmPayment,
    openModal: (config) => {
      openModal({
        ...config,
        children: <ConfirmModal type="PAYMENT_COMPLETE" onConfirm={handlePaymentCompleteConfirm} />,
      });
    },
    closeModal,
    onBack,
    onSubmit,
    onPaymentSuccess,
    handlePaymentCompleteConfirm,
  });

  const handleAgreementDetailPress = useCallback((index: number) => {
    setSelectedAgreementIndex(index);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedAgreementIndex(null);
  }, []);

  // 딥링크 처리
  useDeepLinkHandler(handlePaymentSuccess);

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
    </SafeAreaView>
  );
}
