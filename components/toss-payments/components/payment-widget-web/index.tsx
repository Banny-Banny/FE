/**
 * components/payment-widget-web/index.tsx
 * 웹 환경용 토스페이먼츠 결제 위젯 컴포넌트
 * 웹 환경에서는 토스페이먼츠 JS SDK를 직접 사용합니다.
 */

import { API_ENDPOINTS } from '@/commons/constants';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PaymentMethod } from '../payment-webview';

interface PaymentWidgetWebProps {
  visible: boolean;
  orderId: string;
  amount: number;
  orderName: string;
  customerName?: string;
  paymentMethod?: PaymentMethod;
  onSuccess: (paymentKey: string, orderId: string, amount: number) => void;
  onFail: (code: string, message: string) => void;
  onClose: () => void;
}

/**
 * 웹 환경용 토스페이먼츠 결제 위젯
 * 토스페이먼츠 JS SDK를 직접 사용하여 결제창을 표시합니다.
 */
export const PaymentWidgetWeb: React.FC<PaymentWidgetWebProps> = ({
  visible,
  orderId,
  amount,
  orderName,
  customerName = '고객',
  paymentMethod = '간편결제',
  onSuccess,
  onFail,
  onClose,
}) => {
  const widgetRef = useRef<any>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clientKey = process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY;

  // 웹 환경에서는 현재 페이지의 쿼리 파라미터로 처리
  const getCurrentUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.origin + window.location.pathname;
  };

  // successUrl과 failUrl을 현재 페이지의 쿼리 파라미터로 설정
  const successUrl =
    typeof window !== 'undefined'
      ? `${getCurrentUrl()}?payment=success`
      : API_ENDPOINTS.PAYMENT.TOSS_SUCCESS_URL;
  const failUrl =
    typeof window !== 'undefined'
      ? `${getCurrentUrl()}?payment=fail`
      : API_ENDPOINTS.PAYMENT.TOSS_FAIL_URL;

  useEffect(() => {
    console.log('🔄 [PaymentWidgetWeb] useEffect 실행:', { visible, clientKey: !!clientKey });

    // 모달이 닫히면 상태 초기화
    if (!visible) {
      console.log('🚪 [PaymentWidgetWeb] 모달이 닫혔습니다 - 상태 초기화');
      setIsWidgetReady(false);
      setIsRequesting(false);
      setErrorMessage(null);
      widgetRef.current = null;
      return;
    }

    console.log('✅ [PaymentWidgetWeb] 모달이 열렸습니다 - SDK 로드 시작');

    if (!clientKey) {
      console.error('❌ [PaymentWidgetWeb] 클라이언트 키가 없습니다');
      setErrorMessage('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.');
      return;
    }

    console.log('🔑 [PaymentWidgetWeb] 클라이언트 키 확인됨:', clientKey.substring(0, 10) + '...');

    // 토스페이먼츠 JS SDK 로드
    const loadTossPayments = async () => {
      try {
        console.log('🔄 [PaymentWidgetWeb] SDK 로드 시작');

        // 이미 로드되어 있는지 확인
        if (typeof window !== 'undefined' && (window as any).TossPayments) {
          console.log('✅ [PaymentWidgetWeb] TossPayments SDK 이미 로드됨');
          // 약간의 지연 후 초기화 (SDK가 완전히 준비될 때까지 대기)
          setTimeout(() => {
            initializeWidget();
          }, 100);
          return;
        }

        // SDK 스크립트가 이미 추가되어 있는지 확인 (v1)
        const existingScript = document.querySelector(
          'script[src="https://js.tosspayments.com/v1/payment"]',
        );
        if (existingScript) {
          console.log('⏳ [PaymentWidgetWeb] SDK 스크립트가 이미 추가됨, 로드 대기 중...');
          // 스크립트가 로드될 때까지 대기
          const checkInterval = setInterval(() => {
            if ((window as any).TossPayments) {
              clearInterval(checkInterval);
              console.log('✅ [PaymentWidgetWeb] TossPayments SDK 로드 완료 (대기 후)');
              initializeWidget();
            }
          }, 100);

          // 10초 후 타임아웃
          setTimeout(() => {
            clearInterval(checkInterval);
            if (!(window as any).TossPayments) {
              console.error('❌ [PaymentWidgetWeb] SDK 로드 타임아웃');
              setErrorMessage('토스페이먼츠 SDK 로드에 실패했습니다. 페이지를 새로고침해주세요.');
              onFail('SDK_LOAD_TIMEOUT', '토스페이먼츠 SDK 로드에 시간이 너무 오래 걸립니다.');
            }
          }, 10000);
          return;
        }

        // SDK 스크립트 동적 로드 (v1 사용 - 서버 API 방식)
        console.log('📥 [PaymentWidgetWeb] SDK 스크립트 추가 중...');
        const script = document.createElement('script');
        script.src = 'https://js.tosspayments.com/v1/payment';
        script.async = true;
        script.onload = () => {
          console.log('✅ [PaymentWidgetWeb] TossPayments SDK 로드 완료');
          // 약간의 지연 후 초기화
          setTimeout(() => {
            initializeWidget();
          }, 100);
        };
        script.onerror = (error) => {
          console.error('❌ [PaymentWidgetWeb] TossPayments SDK 로드 실패:', error);
          setErrorMessage('토스페이먼츠 SDK를 로드할 수 없습니다. 네트워크 연결을 확인해주세요.');
          onFail('SDK_LOAD_ERROR', '토스페이먼츠 SDK를 로드할 수 없습니다.');
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('❌ [PaymentWidgetWeb] SDK 로드 중 오류:', error);
        setErrorMessage('토스페이먼츠 SDK 로드 중 오류가 발생했습니다.');
        onFail('SDK_LOAD_ERROR', '토스페이먼츠 SDK를 로드할 수 없습니다.');
      }
    };

    const initializeWidget = () => {
      try {
        console.log('🔄 [PaymentWidgetWeb] 위젯 초기화 시작');

        if (typeof window === 'undefined') {
          console.error('❌ [PaymentWidgetWeb] window 객체가 없습니다');
          setErrorMessage('브라우저 환경이 아닙니다.');
          return;
        }

        if (!(window as any).TossPayments) {
          console.error('❌ [PaymentWidgetWeb] TossPayments SDK가 없습니다');
          setErrorMessage('토스페이먼츠 SDK가 로드되지 않았습니다.');
          return;
        }

        const TossPayments = (window as any).TossPayments;
        console.log('✅ [PaymentWidgetWeb] TossPayments 객체 확인됨:', typeof TossPayments);

        if (!clientKey) {
          console.error('❌ [PaymentWidgetWeb] 클라이언트 키가 없습니다');
          setErrorMessage('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.');
          return;
        }

        // v1 SDK: TossPayments 초기화 (서버 API 방식 - 결제위젯 없이 직접 결제창 열기)
        const tossPayments = TossPayments(clientKey);
        console.log('✅ [PaymentWidgetWeb] TossPayments 인스턴스 생성 완료 (v1)');

        console.log('📊 [PaymentWidgetWeb] 결제 정보:', {
          orderId,
          amount,
          orderName,
          customerName,
          paymentMethod,
          clientKey: clientKey.substring(0, 10) + '...', // 보안을 위해 일부만 표시
        });

        widgetRef.current = tossPayments;
        setIsWidgetReady(true);
        setErrorMessage(null); // 에러 메시지 초기화
        console.log('✅ [PaymentWidgetWeb] 위젯 초기화 완료 - 결제 버튼 클릭 대기 중');
      } catch (error: any) {
        console.error('❌ [PaymentWidgetWeb] 위젯 초기화 실패:', error);
        console.error('❌ [PaymentWidgetWeb] 에러 상세:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        const errorMsg = error.message || '결제 위젯 초기화에 실패했습니다.';
        setErrorMessage(errorMsg);
        onFail('INIT_ERROR', errorMsg);
      }
    };

    // URL 변경 감지 (결제 성공/실패 처리)
    const handleUrlChange = () => {
      if (typeof window === 'undefined') return;

      try {
        const url = window.location.href;
        const urlObj = new URL(url);

        // 성공 URL 처리 (토스페이먼츠가 리다이렉트한 경우)
        const paymentKey = urlObj.searchParams.get('paymentKey');
        const orderIdParam = urlObj.searchParams.get('orderId');
        const amountParam = urlObj.searchParams.get('amount');
        const paymentStatus = urlObj.searchParams.get('payment');

        // 토스페이먼츠가 리다이렉트한 경우 (paymentKey가 있는 경우)
        if (paymentKey && orderIdParam && amountParam) {
          console.log('✅ [PaymentWidgetWeb] 결제 성공 (리다이렉트):', {
            paymentKey,
            orderId: orderIdParam,
            amount: parseInt(amountParam),
          });
          console.log(
            '🔄 [PaymentWidgetWeb] 부모 컴포넌트의 handlePaymentSuccess 호출 - API 호출 시작',
          );
          console.log('  - confirmPayment API 호출 예정');
          console.log('  - updateOrderStatus API 호출 예정');

          // 부모 컴포넌트의 handlePaymentSuccess 호출
          // 이 함수에서 confirmPayment와 updateOrderStatus API를 호출함
          onSuccess(paymentKey, orderIdParam, parseInt(amountParam));

          console.log(
            '✅ [PaymentWidgetWeb] onSuccess 콜백 호출 완료 - API 호출은 부모 컴포넌트에서 처리됨',
          );
          onClose();
          // URL에서 쿼리 파라미터 제거 (뒤로가기 시 중복 처리 방지)
          window.history.replaceState({}, '', window.location.pathname);
          return;
        }

        // 실패 URL 처리 (토스페이먼츠가 리다이렉트한 경우)
        const code = urlObj.searchParams.get('code');
        const message = urlObj.searchParams.get('message');

        if (code || message || paymentStatus === 'fail') {
          const errorCode = code || 'PAYMENT_FAILED';
          const errorMessage = message || '결제에 실패했습니다';

          console.log('❌ [PaymentWidgetWeb] 결제 실패 (리다이렉트):', {
            code: errorCode,
            message: errorMessage,
          });
          onFail(errorCode, errorMessage);
          onClose();
          // URL에서 쿼리 파라미터 제거
          window.history.replaceState({}, '', window.location.pathname);
          return;
        }
      } catch (error) {
        // URL 파싱 실패는 무시
        console.log('⚠️ [PaymentWidgetWeb] URL 파싱 실패:', error);
      }
    };

    // SDK 로드 시작 (모달이 열릴 때만)
    if (visible) {
      loadTossPayments();
    }

    // 초기 URL 확인 및 리스너 설정 (모달이 열릴 때)
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (visible) {
      // 약간의 지연 후 URL 확인 (리다이렉트 완료 대기)
      timeoutId = setTimeout(() => {
        handleUrlChange();
      }, 100);

      // popstate 이벤트 리스너 (뒤로가기/앞으로가기)
      window.addEventListener('popstate', handleUrlChange);
      // hashchange 이벤트 리스너 (해시 변경)
      window.addEventListener('hashchange', handleUrlChange);
      // 주기적으로 URL 확인 (리다이렉트 감지)
      intervalId = setInterval(() => {
        handleUrlChange();
      }, 500);
    }

    // cleanup 함수
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [
    visible,
    orderId,
    amount,
    orderName,
    customerName,
    paymentMethod,
    clientKey,
    successUrl,
    failUrl,
    onSuccess,
    onFail,
    onClose,
  ]);

  // 결제 요청 핸들러 (사용자 버튼 클릭 시 호출)
  const handleRequestPayment = async () => {
    if (!widgetRef.current) {
      console.error('❌ [PaymentWidgetWeb] 위젯이 초기화되지 않았습니다');
      onFail('WIDGET_NOT_READY', '결제 위젯이 준비되지 않았습니다.');
      return;
    }

    try {
      setIsRequesting(true);

      console.log('💳 [PaymentWidgetWeb] 결제 요청 시작:', {
        amount,
        orderId,
        orderName,
        customerName,
        successUrl,
        failUrl,
      });

      // v1 SDK: requestPayment 메서드 사용 (서버 API 방식)
      // 결제수단을 직접 지정하여 결제창 열기
      // '간편결제'는 토스페이먼츠에서 지원하지 않으므로 '카드'로 기본 설정
      const paymentMethodCode = paymentMethod === '간편결제' ? '카드' : paymentMethod;

      console.log('💳 [PaymentWidgetWeb] 결제 요청 시작 (v1):', {
        paymentMethod: paymentMethodCode,
        amount,
        orderId,
        orderName,
      });

      await widgetRef.current.requestPayment(paymentMethodCode, {
        amount,
        orderId,
        orderName,
        customerName,
        successUrl,
        failUrl,
      });

      console.log('✅ [PaymentWidgetWeb] 결제 요청 완료');
      // successUrl로 리다이렉트되므로 여기서는 처리하지 않음
      // 리다이렉트 후 URL 변경 감지로 처리됨
    } catch (error: any) {
      console.error('❌ [PaymentWidgetWeb] 결제 요청 실패:', error);
      setIsRequesting(false);

      // 사용자가 결제를 취소한 경우 (PAY_PROCESS_CANCELED)
      if (error.code === 'PAY_PROCESS_CANCELED') {
        onClose();
        return;
      }
      onFail(error.code || 'PAYMENT_ERROR', error.message || '결제 요청에 실패했습니다.');
    }
  };

  if (!clientKey) {
    console.error('[PaymentWidgetWeb] 토스페이먼츠 클라이언트 키가 설정되지 않았습니다');
    return null;
  }

  if (!visible) {
    return null;
  }

  console.log('🎨 [PaymentWidgetWeb] 컴포넌트 렌더링:', {
    visible,
    isWidgetReady,
    isRequesting,
    hasClientKey: !!clientKey,
    orderId,
    amount,
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelText}>주문명</Text>
              <Text style={styles.infoValueText}>{orderName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelText}>주문번호</Text>
              <Text style={styles.infoValueText}>{orderId}</Text>
            </View>
            <View style={[styles.infoItem, styles.infoItemLast]}>
              <Text style={styles.infoLabelText}>결제금액</Text>
              <Text style={styles.infoValueTextLarge}>{amount.toLocaleString()}원</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.paymentButton,
              (isRequesting || !isWidgetReady) && styles.paymentButtonDisabled,
            ]}
            onPress={handleRequestPayment}
            disabled={isRequesting || !isWidgetReady}
            activeOpacity={0.7}>
            {isRequesting ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.paymentButtonText}>결제창을 여는 중...</Text>
              </View>
            ) : !isWidgetReady ? (
              <Text style={styles.paymentButtonText}>준비 중...</Text>
            ) : (
              <Text style={styles.paymentButtonText}>결제하기</Text>
            )}
          </TouchableOpacity>
          {!isWidgetReady && !errorMessage && (
            <Text style={styles.helperText}>결제 위젯을 초기화하는 중입니다...</Text>
          )}
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setErrorMessage(null);
                  setIsWidgetReady(false);
                  widgetRef.current = null;
                  // SDK 재로드
                  if (typeof window !== 'undefined') {
                    const script = document.querySelector(
                      'script[src="https://js.tosspayments.com/v2/standard"]',
                    );
                    if (script) {
                      script.remove();
                    }
                    // useEffect가 다시 실행되도록 visible을 토글
                    // 하지만 이건 부모 컴포넌트에서 해야 함
                  }
                }}>
                <Text style={styles.retryButtonText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    // 웹 환경에서만 boxShadow 적용
    ...(typeof window !== 'undefined' && {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }),
  },
  infoItem: {
    marginBottom: 16,
  },
  infoItemLast: {
    marginBottom: 0,
  },
  infoLabelText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  infoValueText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  infoValueTextLarge: {
    color: '#333',
    fontSize: 20,
    fontWeight: '700',
  },
  paymentButton: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#0064FF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  paymentButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  errorContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  errorText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '600',
  },
});
