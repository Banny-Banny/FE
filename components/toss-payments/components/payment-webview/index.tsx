/**
 * components/payment-webview/index.tsx
 * 토스페이먼츠 결제창 WebView 컴포넌트
 * 웹 환경에서는 PaymentWidgetWeb을 사용하고, 모바일 환경에서는 WebView를 사용합니다.
 */

import { API_ENDPOINTS } from '@/commons/constants';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Modal, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { PaymentWidgetWeb } from '../payment-widget-web';
import { generatePaymentHtml } from './html-generator';

export type PaymentMethod = '카드' | '간편결제' | '카카오페이';

interface PaymentWebViewProps {
  visible: boolean;
  orderId: string;
  amount: number;
  orderName: string;
  customerName?: string;
  paymentMethod?: PaymentMethod; // 결제 수단 선택 (기본값: '간편결제')
  onSuccess: (paymentKey: string, orderId: string, amount: number) => void;
  onFail: (code: string, message: string) => void;
  onClose: () => void;
}

/**
 * 토스페이먼츠 결제창을 WebView로 표시하는 컴포넌트
 * 웹 환경에서는 PaymentWidgetWeb을 사용하고, 모바일 환경에서는 WebView를 사용합니다.
 */
export const PaymentWebView: React.FC<PaymentWebViewProps> = ({
  visible,
  orderId,
  amount,
  orderName,
  customerName = '고객',
  paymentMethod = '간편결제', // 기본값: 간편결제 (카카오페이 포함)
  onSuccess,
  onFail,
  onClose,
}) => {
  // 웹 환경에서는 PaymentWidgetWeb 사용
  if (Platform.OS === 'web') {
    return (
      <PaymentWidgetWeb
        visible={visible}
        orderId={orderId}
        amount={amount}
        orderName={orderName}
        customerName={customerName}
        paymentMethod={paymentMethod}
        onSuccess={onSuccess}
        onFail={onFail}
        onClose={onClose}
      />
    );
  }

  // 모바일 환경에서는 기존 WebView 사용
  const webViewRef = useRef<WebView>(null);
  const clientKey = process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY;
  const [isSimulator, setIsSimulator] = useState(false);
  const convertedUrlsRef = useRef<Set<string>>(new Set()); // 이미 변환한 URL 추적
  const paymentProcessedRef = useRef<boolean>(false); // 결제 처리 완료 플래그 (중복 호출 방지)

  if (!clientKey) {
    return null;
  }

  // 시뮬레이터 환경 감지
  useEffect(() => {
    const checkSimulator = async () => {
      try {
        // iOS 시뮬레이터 감지: 시뮬레이터에서는 앱 딥링크가 작동하지 않음
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          // 시뮬레이터에서는 토스 앱 딥링크를 열 수 없음
          const testUrl = 'supertoss://test';
          const canOpen = await Linking.canOpenURL(testUrl);
          const isSimulatorEnv = !canOpen;
          setIsSimulator(isSimulatorEnv);
          if (isSimulatorEnv) {
          }
        }
      } catch (error: any) {
        // iOS에서 LSApplicationQueriesSchemes에 등록되지 않은 스킴을 확인하면 에러 발생
        // 이 경우 시뮬레이터이거나 실제 기기일 수 있지만, 에러 메시지로 판단
        const errorMessage = error?.message || '';
        if (
          errorMessage.includes('LSApplicationQueriesSchemes') ||
          errorMessage.includes('Unable to open URL')
        ) {
          // iOS 시뮬레이터에서는 앱 스킴이 등록되어 있어도 앱이 없으면 false 반환
          // 에러가 발생하면 시뮬레이터일 가능성이 높으므로 시뮬레이터로 간주
          setIsSimulator(true);
        } else {
          // 기타 에러는 실제 기기로 간주
          setIsSimulator(false);
        }
      }
    };

    if (visible) {
      checkSimulator();
      // Modal이 열릴 때 초기화
      convertedUrlsRef.current.clear();
      paymentProcessedRef.current = false; // 결제 처리 플래그 초기화
    } else {
      // Modal이 닫힐 때 초기화
      convertedUrlsRef.current.clear();
      paymentProcessedRef.current = false; // 결제 처리 플래그 초기화
    }
  }, [visible]);

  // 결제창 HTML 생성
  const successUrl = API_ENDPOINTS.PAYMENT.TOSS_SUCCESS_URL;
  const failUrl = API_ENDPOINTS.PAYMENT.TOSS_FAIL_URL;

  const html = generatePaymentHtml({
    clientKey,
    orderId,
    amount,
    orderName,
    customerName,
    paymentMethod,
    successUrl,
    failUrl,
  });

  // 기존 HTML 코드는 html-generator.ts로 이동됨

  /*
  const html_old = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>토스페이먼츠 결제</title>
  <script src="https://js.tosspayments.com/v1/payment"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8f9fa;
      padding: 20px;
    }
    #payment-button {
      width: 100%;
      padding: 16px;
      margin-top: 20px;
      background-color: #0064FF;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }
    #payment-button:active {
      background-color: #0052CC;
    }
    .info {
      background: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-item:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #666;
      font-size: 14px;
    }
    .info-value {
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }
    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="info">
    <div class="info-item">
      <span class="info-label">주문명</span>
      <span class="info-value">${orderName}</span>
    </div>
    <div class="info-item">
      <span class="info-label">주문번호</span>
      <span class="info-value">${orderId}</span>
    </div>
    <div class="info-item">
      <span class="info-label">결제금액</span>
      <span class="info-value">${amount.toLocaleString()}원</span>
    </div>
  </div>
  
  <button id="payment-button">결제하기</button>
  <div id="loading" class="loading" style="display: none;">결제창을 여는 중...</div>

  <script>
    const clientKey = "${clientKey}";
    if (typeof TossPayments === 'undefined') {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'PAYMENT_ERROR',
        data: {
          code: 'SDK_NOT_LOADED',
          message: '토스페이먼츠 SDK가 로드되지 않았습니다'
        }
      }));
    } else {
    }
    
    const tossPayments = TossPayments(clientKey);
    const button = document.getElementById('payment-button');
    const loading = document.getElementById('loading');
    
    if (button) {
      button.addEventListener('click', async function() {
        // ============================================
        // 실제 결제 로직
        // ============================================
        try {
          loading.style.display = 'block';
          button.disabled = true;
          // 결제수단 코드 변환 ('간편결제'는 '카드'로 변환)
          const paymentMethodCode = '${paymentMethod}' === '간편결제' ? '카드' : '${paymentMethod}';
          
          await tossPayments.requestPayment(paymentMethodCode, {
            amount: ${amount},
            orderId: "${orderId}",
            orderName: "${orderName}",
            customerName: "${customerName}",
            successUrl: '${successUrl}',
            failUrl: '${failUrl}',
          });
          
          // successUrl로 리다이렉트되므로 여기서는 처리하지 않음
          // 리다이렉트 후 URL 변경 감지로 처리됨
        } catch (error) {
          loading.style.display = 'none';
          button.disabled = false;
          
          // 사용자가 결제를 취소한 경우 (PAY_PROCESS_CANCELED)
          if (error.code === 'PAY_PROCESS_CANCELED') {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'PAYMENT_FAIL',
              data: {
                code: 'PAY_PROCESS_CANCELED',
                message: '결제가 취소되었습니다'
              }
            }));
            return;
          }
          
          // 기타 에러
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PAYMENT_ERROR',
            data: {
              code: error.code || 'UNKNOWN_ERROR',
              message: error.message || '결제 요청 중 오류가 발생했습니다'
            }
          }));
        }
      });
    } else {
    }

    // URL 변경 감지 (성공/실패 처리)
    window.addEventListener('popstate', function() {
      handleUrlChange(window.location.href);
    });

    function handleUrlChange(url) {
      try {
        // 빈 URL이나 about:blank는 무시 (무한 로딩 방지)
        if (!url || url === 'about:blank' || url.trim() === '') {
          return;
        }

        const urlObj = new URL(url);
        const pathname = urlObj.pathname;

        if (pathname.includes('/success')) {
          const paymentKey = urlObj.searchParams.get('paymentKey');
          const orderId = urlObj.searchParams.get('orderId');
          const amount = urlObj.searchParams.get('amount');

          if (paymentKey && orderId && amount) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'PAYMENT_SUCCESS',
              data: { paymentKey, orderId, amount: parseInt(amount) }
            }));
          }
        } else if (pathname.includes('/fail')) {
          const code = urlObj.searchParams.get('code');
          const message = urlObj.searchParams.get('message');

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PAYMENT_FAIL',
            data: { code, message }
          }));
        }
      } catch (error) {
        // URL 파싱 실패는 무시 (초기 로드 시 정상)
      }
    }

    // 초기 로드 시 URL 확인 (안전하게 처리)
    if (window.location && window.location.href) {
      try {
        handleUrlChange(window.location.href);
      } catch (e) {
        // 초기 로드 실패는 무시
      }
    }
  </script>
</body>
</html>
  `;
  */

  // HTML 생성 완료 (generatePaymentHtml 함수로 처리됨)

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      switch (message.type) {
        case 'WEBVIEW_READY':
          break;

        case 'PAYMENT_SUCCESS':
          // 중복 호출 방지: 이미 처리된 경우 무시
          if (paymentProcessedRef.current) {
            return;
          }
          paymentProcessedRef.current = true; // 플래그 설정

          const { paymentKey, orderId, amount } = message.data;
          onSuccess(paymentKey, orderId, parseInt(amount));
          break;

        case 'PAYMENT_FAIL':
          const { code, message: errorMessage } = message.data;
          onFail(code, errorMessage);
          break;

        case 'PAYMENT_ERROR':
          onFail(message.data.code, message.data.message);
          break;

        default:
      }
    } catch (error) {
    }
  };

  /**
   * WebView에서 외부 앱 딥링크 처리
   * 토스뱅크 카드 결제 시 토스 앱으로 이동해야 함
   */
  const handleShouldStartLoadWithRequest = (request: any) => {
    const { url, navigationType, mainDocumentURL } = request;

    // 빈 URL이나 about:blank는 무시 (무한 로딩 방지)
    if (!url || url === 'about:blank' || url.trim() === '') {
      return false;
    }

    // ⚠️ 성공/실패 URL로의 이동을 차단하고 직접 처리 (404 페이지가 보이지 않도록)
    if (url.includes('/payment/success') || url.includes('/payment/fail')) {
      // 성공 URL 처리
      if (url.includes('/success')) {
        // 중복 호출 방지
        if (paymentProcessedRef.current) {
          return false;
        }
        paymentProcessedRef.current = true;

        try {
          const urlObj = new URL(url);
          const paymentKey = urlObj.searchParams.get('paymentKey');
          const orderId = urlObj.searchParams.get('orderId');
          const amount = urlObj.searchParams.get('amount');

          if (paymentKey && orderId && amount) {
            // 비동기 처리를 위해 setTimeout 사용
            setTimeout(() => {
              onSuccess(paymentKey, orderId, parseInt(amount));
            }, 0);
          }
        } catch (error) {
        }
      }
      // 실패 URL 처리
      else if (url.includes('/fail')) {
        try {
          const urlObj = new URL(url);
          const code = urlObj.searchParams.get('code') || 'PAYMENT_FAILED';
          const message = urlObj.searchParams.get('message') || '결제에 실패했습니다';

          // 비동기 처리를 위해 setTimeout 사용
          setTimeout(() => {
            onFail(code, message);
          }, 0);
        } catch (error) {
        }
      }

      // 페이지 로드를 차단하여 404 페이지가 보이지 않도록 함
      return false;
    }

    // 토스 앱 딥링크 감지 (supertoss://, toss://)
    if (url.startsWith('supertoss://') || url.startsWith('toss://')) {
      // 시뮬레이터/에뮬레이터 환경에서는 WebView 내에서 직접 결제 진행
      if (isSimulator) {
        // 시뮬레이터에서는 토스 앱이 없으므로 딥링크를 무시하고 테스트 모드로 진행
        // 딥링크는 무시하고 WebView 내에서 테스트 모드로 진행
        return false;
      }

      // 실제 기기: 앱 딥링크 시도 (비동기 처리)
      // handleShouldStartLoadWithRequest는 동기적으로 반환해야 하므로
      // 앱을 열려고 시도하고, 실패하면 WebView에서 진행하도록 처리
      Linking.canOpenURL(url)
        .then((supported: boolean) => {
          if (supported) {
            Linking.openURL(url).catch((err: Error) => {
              // 앱 열기 실패 시 WebView에서 진행하도록 URL 다시 로드
              webViewRef.current?.injectJavaScript(`
                window.location.href = "${url}";
              `);
            });
          } else {
            // 앱이 설치되어 있지 않으면 WebView 내에서 진행
            webViewRef.current?.injectJavaScript(`
              window.location.href = "${url}";
            `);
          }
        })
        .catch((err: Error) => {
          // 딥링크 확인 실패 시 WebView 내에서 진행
          webViewRef.current?.injectJavaScript(`
            window.location.href = "${url}";
          `);
        });

      // 실제 기기에서 앱을 열려고 시도하므로 일단 WebView에서 로드하지 않음
      // 앱이 없거나 실패하면 위에서 WebView로 다시 로드
      return false;
    }

    // 카카오페이/카카오뱅크 앱 딥링크 감지 (kakaotalk://, kakaopay://, kakaobank://)
    if (
      url.startsWith('kakaotalk://') ||
      url.startsWith('kakaopay://') ||
      url.startsWith('kakaolink://') ||
      url.startsWith('kakaobank://')
    ) {
      // 시뮬레이터/에뮬레이터 환경에서는 WebView 내에서 직접 결제 진행
      if (isSimulator) {
        // 카카오페이 딥링크에서 payweb_url 파라미터 추출
        // kakaotalk:// 스킴은 표준 URL 파싱이 어려우므로 수동 파싱
        try {
          // URL에서 payweb_url 파라미터 추출 (정규식 사용)
          const paywebUrlMatch = url.match(/payweb_url=([^&]+)/);
          const urlMatch = url.match(/[&?]url=([^&]+)/);

          if (paywebUrlMatch && paywebUrlMatch[1]) {
            // payweb_url이 있으면 디코딩하여 WebView에서 로드
            const decodedPaywebUrl = decodeURIComponent(paywebUrlMatch[1]);
            // WebView에서 웹 URL로 리다이렉트
            setTimeout(() => {
              webViewRef.current?.injectJavaScript(`
                window.location.href = "${decodedPaywebUrl}";
              `);
            }, 100);
            // 딥링크 URL은 로드하지 않음
            return false;
          } else if (urlMatch && urlMatch[1]) {
            // payweb_url이 없으면 url 파라미터 확인
            const fallbackUrl = decodeURIComponent(urlMatch[1]);
            if (fallbackUrl.startsWith('http://') || fallbackUrl.startsWith('https://')) {
              setTimeout(() => {
                webViewRef.current?.injectJavaScript(`
                  window.location.href = "${fallbackUrl}";
                `);
              }, 100);
              return false;
            }
          }
        } catch (error) {
        }

        // payweb_url이 없으면 WebView가 해당 URL을 로드하도록 허용 (에러 발생하지만 무시)
        return true;
      }

      // 실제 기기: 앱 딥링크 시도 (비동기 처리)
      // handleShouldStartLoadWithRequest는 동기적으로 반환해야 하므로
      // 앱을 열려고 시도하고, 실패하면 WebView에서 진행하도록 처리
      Linking.canOpenURL(url)
        .then((supported: boolean) => {
          if (supported) {
            Linking.openURL(url).catch((err: Error) => {
              // 앱 열기 실패 시 WebView에서 진행하도록 URL 다시 로드
              webViewRef.current?.injectJavaScript(`
                window.location.href = "${url}";
              `);
            });
          } else {
            // 앱이 설치되어 있지 않으면 WebView 내에서 진행
            webViewRef.current?.injectJavaScript(`
              window.location.href = "${url}";
            `);
          }
        })
        .catch((err: Error) => {
          // 딥링크 확인 실패 시 WebView 내에서 진행
          webViewRef.current?.injectJavaScript(`
            window.location.href = "${url}";
          `);
        });

      // 실제 기기에서 앱을 열려고 시도하므로 일단 WebView에서 로드하지 않음
      // 앱이 없거나 실패하면 위에서 WebView로 다시 로드
      return false;
    }

    // 카드사 앱 딥링크 감지 (시뮬레이터에서는 WebView 내에서 처리)
    // 주요 카드사 앱 스킴: kb-acp, nhappcardansimclick, lottesmartpay, mpocket.online.ansimclick 등
    const cardAppSchemes = [
      'kb-acp://',
      'liivbank://',
      'newliiv://',
      'kbbank://', // KB카드
      'nhappcardansimclick://',
      'nhallonepayansimclick://',
      'nonghyupcardansimclick://', // 농협카드
      'lottesmartpay://',
      'lotteappcard://', // 롯데카드
      'mpocket.online.ansimclick://',
      'mpocket.ansimclick.cert://',
      'samsungpay://', // 삼성카드
      'shinhan-sr-ansimclick://',
      'smshinhanansimclick://', // 신한카드
      'com.wooricard.wcard://',
      'newsmartpib://', // 우리카드
      'citispay://',
      'citicardappkr://',
      'citimobileapp://', // 씨티카드
      'cloudpay://',
      'hanawalletmembers://', // 하나카드
      'hdcardappcardansimclick://',
      'smhyundaiansimclick://', // 현대카드
      'ispmobile://', // ISP
    ];

    const isCardAppScheme = cardAppSchemes.some((scheme) =>
      url.toLowerCase().startsWith(scheme.toLowerCase()),
    );

    if (isCardAppScheme) {
      // 시뮬레이터/에뮬레이터 환경에서는 WebView 내에서 직접 결제 진행
      if (isSimulator) {
        // WebView가 해당 URL을 로드하도록 허용 (시뮬레이터에서는 앱이 없으므로 WebView에서 처리)
        return true;
      }

      // 실제 기기: 카드사 앱 딥링크 시도
      Linking.canOpenURL(url)
        .then((supported: boolean) => {
          if (supported) {
            Linking.openURL(url).catch((err: Error) => {
              // 앱 열기 실패 시 WebView에서 진행하도록 URL 다시 로드
              webViewRef.current?.injectJavaScript(`
                window.location.href = "${url}";
              `);
            });
          } else {
            // 앱이 설치되어 있지 않으면 WebView 내에서 진행
            webViewRef.current?.injectJavaScript(`
              window.location.href = "${url}";
            `);
          }
        })
        .catch((err: Error) => {
          webViewRef.current?.injectJavaScript(`
            window.location.href = "${url}";
          `);
        });

      // 실제 기기에서 앱을 열려고 시도하므로 일단 WebView에서 로드하지 않음
      return false;
    }

    // HTTP/HTTPS URL은 정상적으로 로드
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }

    // data: URL (HTML 인라인)은 허용
    if (url.startsWith('data:')) {
      return true;
    }

    // 기타 URL은 로드하지 않음 (무한 로딩 방지)
    return false;
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url, loading } = navState;

    // URL이 없거나 유효하지 않으면 무시
    if (!url || url === 'about:blank') {
      return;
    }

    try {
      // 성공 URL 감지
      if (url.includes('/success')) {
        // 중복 호출 방지: 이미 처리된 경우 무시
        if (paymentProcessedRef.current) {
          return;
        }
        paymentProcessedRef.current = true; // 플래그 설정

        // WebView 로딩 즉시 중단 (404 페이지가 보이지 않도록)
        if (loading && webViewRef.current) {
          webViewRef.current.stopLoading();
        }

        const urlObj = new URL(url);
        const paymentKey = urlObj.searchParams.get('paymentKey');
        const orderId = urlObj.searchParams.get('orderId');
        const amount = urlObj.searchParams.get('amount');

        if (paymentKey && orderId && amount) {
          onSuccess(paymentKey, orderId, parseInt(amount));
        }
      }
      // 실패 URL 감지
      else if (url.includes('/fail')) {
        // WebView 로딩 즉시 중단 (404 페이지가 보이지 않도록)
        if (loading && webViewRef.current) {
          webViewRef.current.stopLoading();
        }

        const urlObj = new URL(url);
        const code = urlObj.searchParams.get('code') || 'PAYMENT_FAILED';
        const message = urlObj.searchParams.get('message') || '결제에 실패했습니다';

        onFail(code, message);
      }
    } catch (error) {
      // URL 파싱 에러는 무시 (404 페이지 등)
    }
  };

  // Modal이 열릴 때 로그
  useEffect(() => {
    if (visible) {
    }
  }, [visible, orderId, amount, orderName, customerName]);

  // StatusBar 높이 가져오기 (iOS는 동적으로, Android는 StatusBar.currentHeight 사용)
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <View style={[styles.container, { paddingTop: statusBarHeight }]}>
        <WebView
          ref={webViewRef}
          source={{
            html,
            baseUrl: 'https://timeegg.com', // baseUrl 추가 (HTML 로딩 개선)
          }}
          injectedJavaScript={`
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'WEBVIEW_READY',
              data: { message: 'WebView 준비 완료' }
            }));
            true; // 반드시 true 반환
          `}
          onMessage={handleMessage}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onNavigationStateChange={handleNavigationStateChange}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            const errorDescription = nativeEvent.description || '';
            const errorUrl = nativeEvent.url || '';

            // 시뮬레이터 환경에서 발생하는 딥링크 관련 에러는 경고로만 처리
            if (isSimulator) {
              // 카드사 앱 딥링크 리다이렉트 에러
              if (errorDescription.includes('scheme that is not HTTP(S)')) {
                return;
              }

              // 카카오페이 관련 unsupported URL 에러
              if (
                (errorDescription.includes('unsupported URL') ||
                  errorDescription.includes('NSURLErrorDomain')) &&
                (errorUrl.includes('kakaopay.com') ||
                  errorUrl.includes('online-payment.kakaopay.com'))
              ) {
                return;
              }
            }

          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            const { statusCode, url } = nativeEvent;

            // successUrl과 failUrl의 404 에러는 정상 동작 (WebView에서 URL만 감지하면 됨)
            if (statusCode === 404 && (url.includes('/payment/success') || url.includes('/payment/fail'))) {
              return; // 에러 로그 출력하지 않음
            }

            // 기타 HTTP 에러는 로그 출력
          }}
          onLoadStart={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
          }}
          onLoadEnd={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
          }}
          onLoadProgress={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
          }}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0064FF" />
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
