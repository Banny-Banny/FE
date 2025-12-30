/**
 * hooks/usePaymentHandlers.ts
 * 결제 화면 이벤트 핸들러 Hook
 */

import { useCallback, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import type { PaymentError, TossPaymentConfirmResponse } from '../api/types/types';
import { TEXTS } from '../constants';
import type { OrderSummary } from '../types';

interface UsePaymentHandlersProps {
  isPaymentEnabled: boolean;
  orderData: {
    order_id: string;
  };
  formData: {
    capsuleName: string;
  };
  orderSummary: OrderSummary;
  confirmPayment: (
    paymentKey: string,
    orderId: string,
    amount: number,
  ) => Promise<TossPaymentConfirmResponse>;
  openModal: (config: any) => void;
  closeModal: () => void;
  onBack?: () => void;
  onSubmit?: (orderSummary: OrderSummary) => void;
  onPaymentSuccess?: (paymentData: TossPaymentConfirmResponse) => void;
  handlePaymentCompleteConfirm: () => void;
}

interface UsePaymentHandlersReturn {
  handleBackPress: () => void;
  handleSubmitPress: () => void;
  handlePaymentSuccess: (paymentKey: string, orderId: string, amount: number) => Promise<void>;
}

export const usePaymentHandlers = ({
  isPaymentEnabled,
  orderData,
  formData,
  orderSummary,
  confirmPayment,
  openModal,
  closeModal,
  onBack,
  onSubmit,
  onPaymentSuccess,
  handlePaymentCompleteConfirm,
}: UsePaymentHandlersProps): UsePaymentHandlersReturn => {
  /** 뒤로가기 버튼 핸들러 */
  const handleBackPress = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  /** 결제하기 버튼 핸들러 (WebView 열기) */
  const handleSubmitPress = useCallback(() => {
    if (!isPaymentEnabled) {
      Alert.alert('알림', TEXTS.alerts.agreementRequired);
      return;
    }

    // WebView를 열기 위해 결제 데이터 설정
    // 실제 결제는 PaymentWebView 컴포넌트에서 처리됩니다
  }, [isPaymentEnabled]);

  /** 결제 성공 처리 핸들러 (앱 복귀 시 호출) */
  const handlePaymentSuccess = useCallback(
    async (paymentKey: string, orderId: string, amount: number) => {
      try {
        // 딥링크 데이터 검증: 요청한 주문/금액과 불일치 시 승인 중단
        const expectedOrderId = orderData.order_id;
        const expectedAmount = orderSummary.totalPrice;

        if (orderId !== expectedOrderId || amount !== expectedAmount) {
          Alert.alert('결제 오류', '주문 정보가 일치하지 않습니다. 다시 시도해주세요.');
          return;
        }

        const paymentData = await confirmPayment(paymentKey, orderId, amount);

        // 결제 완료 모달 표시
        openModal({
          width: 344,
          height: 'auto',
          closeOnBackdropPress: true,
          children: null, // 부모에서 전달
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
    [confirmPayment, openModal, onPaymentSuccess, orderData.order_id, orderSummary.totalPrice],
  );

  return {
    handleBackPress,
    handleSubmitPress,
    handlePaymentSuccess,
  };
};

/**
 * 딥링크 처리 Hook
 */
export const useDeepLinkHandler = (
  handlePaymentSuccess: (paymentKey: string, orderId: string, amount: number) => Promise<void>,
) => {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      const urlObj = new URL(url);
      const path = urlObj.pathname;

      if (path.includes('/pay/toss/success')) {
        const paymentKey = urlObj.searchParams.get('paymentKey');
        const orderId = urlObj.searchParams.get('orderId');
        const amount = urlObj.searchParams.get('amount');

        if (paymentKey && orderId && amount) {
          handlePaymentSuccess(paymentKey, orderId, parseInt(amount, 10));
        } else {
          Alert.alert('결제 오류', '결제 정보가 올바르지 않습니다.');
        }
      } else if (path.includes('/pay/toss/fail')) {
        const message = urlObj.searchParams.get('message');
        Alert.alert('결제 실패', message || '결제 처리 중 오류가 발생했습니다.');
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [handlePaymentSuccess]);
};

