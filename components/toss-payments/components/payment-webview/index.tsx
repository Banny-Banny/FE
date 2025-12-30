/**
 * components/payment-webview/index.tsx
 * 토스페이먼츠 결제창 WebView 컴포넌트
 */

import { API_ENDPOINTS } from '@/commons/constants';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Linking, Modal, StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface PaymentWebViewProps {
  visible: boolean;
  orderId: string;
  amount: number;
  orderName: string;
  customerName?: string;
  onSuccess: (paymentKey: string, orderId: string, amount: number) => void;
  onFail: (code: string, message: string) => void;
  onClose: () => void;
}

/**
 * 토스페이먼츠 결제창을 WebView로 표시하는 컴포넌트
 */
export const PaymentWebView: React.FC<PaymentWebViewProps> = ({
  visible,
  orderId,
  amount,
  orderName,
  customerName = '고객',
  onSuccess,
  onFail,
  onClose,
}) => {
  const webViewRef = useRef<WebView>(null);
  const clientKey = process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY;

  if (!clientKey) {
    console.error('[PaymentWebView] 토스페이먼츠 클라이언트 키가 설정되지 않았습니다');
    return null;
  }

  // 결제창 HTML 생성
  console.log('📝 [PaymentWebView] HTML 생성 시작');
  
  // 토스페이먼츠 리다이렉트 URL 상수
  const successUrl = API_ENDPOINTS.PAYMENT.TOSS_SUCCESS_URL;
  const failUrl = API_ENDPOINTS.PAYMENT.TOSS_FAIL_URL;
  
  const html = `
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
    console.log('🚀 [PaymentWebView] 스크립트 시작');
    
    const clientKey = "${clientKey}";
    console.log('🔑 [PaymentWebView] 클라이언트 키:', clientKey ? '설정됨' : '없음');
    
    if (typeof TossPayments === 'undefined') {
      console.error('❌ [PaymentWebView] TossPayments SDK가 로드되지 않았습니다');
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'PAYMENT_ERROR',
        data: {
          code: 'SDK_NOT_LOADED',
          message: '토스페이먼츠 SDK가 로드되지 않았습니다'
        }
      }));
    } else {
      console.log('✅ [PaymentWebView] TossPayments SDK 로드 완료');
    }
    
    const tossPayments = TossPayments(clientKey);
    console.log('✅ [PaymentWebView] TossPayments 초기화 완료');

    const button = document.getElementById('payment-button');
    const loading = document.getElementById('loading');
    
    console.log('🔘 [PaymentWebView] 버튼 요소:', button ? '찾음' : '없음');

    if (button) {
      button.addEventListener('click', async function() {
        console.log('👆 [PaymentWebView] 결제 버튼 클릭됨');
        try {
          loading.style.display = 'block';
          button.disabled = true;
          console.log('⏳ [PaymentWebView] 결제 요청 시작...');
          
          await tossPayments.requestPayment('카드', {
            amount: ${amount},
            orderId: "${orderId}",
            orderName: "${orderName}",
            customerName: "${customerName}",
            successUrl: '${successUrl}',
            failUrl: '${failUrl}',
          });
          
          console.log('✅ [PaymentWebView] 결제 요청 완료');
        } catch (error) {
          console.error('❌ [PaymentWebView] 결제 요청 오류:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PAYMENT_ERROR',
            data: {
              code: error.code || 'UNKNOWN_ERROR',
              message: error.message || '결제 요청 중 오류가 발생했습니다'
            }
          }));
          loading.style.display = 'none';
          button.disabled = false;
        }
      });
      console.log('✅ [PaymentWebView] 버튼 이벤트 리스너 등록 완료');
    } else {
      console.error('❌ [PaymentWebView] 결제 버튼을 찾을 수 없습니다');
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
        console.log('URL 파싱:', url, error.message);
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
  
  console.log('✅ [PaymentWebView] HTML 생성 완료, 길이:', html.length);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      switch (message.type) {
        case 'WEBVIEW_READY':
          console.log('✅ [PaymentWebView] WebView 준비 완료:', message.data);
          break;

        case 'PAYMENT_SUCCESS':
          const { paymentKey, orderId, amount } = message.data;
          console.log('✅ [PaymentWebView] 결제 성공:', { paymentKey, orderId, amount });
          onSuccess(paymentKey, orderId, parseInt(amount));
          break;

        case 'PAYMENT_FAIL':
          const { code, message: errorMessage } = message.data;
          console.log('❌ [PaymentWebView] 결제 실패:', { code, message: errorMessage });
          onFail(code, errorMessage);
          break;

        case 'PAYMENT_ERROR':
          console.log('❌ [PaymentWebView] 결제 에러:', message.data);
          onFail(message.data.code, message.data.message);
          break;

        default:
          console.warn('[PaymentWebView] 알 수 없는 메시지 타입:', message.type);
      }
    } catch (error) {
      console.error('[PaymentWebView] 메시지 파싱 오류:', error);
    }
  };

  /**
   * WebView에서 외부 앱 딥링크 처리
   * 토스뱅크 카드 결제 시 토스 앱으로 이동해야 함
   */
  const handleShouldStartLoadWithRequest = (request: any) => {
    const { url, navigationType } = request;
    
    console.log('🔍 [PaymentWebView] URL 요청:', { url, navigationType });

    // 빈 URL이나 about:blank는 무시 (무한 로딩 방지)
    if (!url || url === 'about:blank' || url.trim() === '') {
      console.log('⏭️ [PaymentWebView] 빈 URL 무시');
      return false;
    }

    // 토스 앱 딥링크 감지 (supertoss://, toss://)
    if (url.startsWith('supertoss://') || url.startsWith('toss://')) {
      console.log('🔗 [PaymentWebView] 토스 앱 딥링크 감지:', url);
      
      // 즉시 처리 (WebView가 URL을 로드하기 전에 막아야 함)
      Linking.canOpenURL(url)
        .then((supported: boolean) => {
          console.log('📱 [PaymentWebView] 토스 앱 설치 여부:', supported);
          if (supported) {
            console.log('✅ [PaymentWebView] 토스 앱 열기 시도:', url);
            return Linking.openURL(url);
          } else {
            console.warn('⚠️ [PaymentWebView] 토스 앱이 설치되어 있지 않습니다');
            onFail('APP_NOT_INSTALLED', '토스 앱이 설치되어 있지 않습니다. 토스 앱을 설치해주세요.');
          }
        })
        .catch((err: Error) => {
          console.error('❌ [PaymentWebView] 딥링크 열기 실패:', err);
          onFail('DEEPLINK_ERROR', '토스 앱을 열 수 없습니다.');
        });

      // WebView에서 이 URL을 로드하지 않음 (중요!)
      return false;
    }

    // HTTP/HTTPS URL은 정상적으로 로드
    if (url.startsWith('http://') || url.startsWith('https://')) {
      console.log('✅ [PaymentWebView] HTTP/HTTPS URL 허용:', url);
      return true;
    }

    // data: URL (HTML 인라인)은 허용
    if (url.startsWith('data:')) {
      console.log('✅ [PaymentWebView] data URL 허용');
      return true;
    }

    // 기타 URL은 로드하지 않음 (무한 로딩 방지)
    console.warn('⚠️ [PaymentWebView] 알 수 없는 URL 스킴:', url);
    return false;
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    // 성공 URL 감지
    if (url.includes('/success')) {
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
      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code') || 'PAYMENT_FAILED';
      const message = urlObj.searchParams.get('message') || '결제에 실패했습니다';

      onFail(code, message);
    }
  };

  // Modal이 열릴 때 로그
  useEffect(() => {
    if (visible) {
      console.log('👁️ [PaymentWebView] Modal 표시됨');
      console.log('📊 [PaymentWebView] 결제 정보:', { orderId, amount, orderName, customerName });
    }
  }, [visible, orderId, amount, orderName, customerName]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ 
            html,
            baseUrl: 'https://timeegg.com' // baseUrl 추가 (HTML 로딩 개선)
          }}
          injectedJavaScript={`
            console.log('💉 [PaymentWebView] JavaScript 주입 완료');
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
            console.error('❌ [PaymentWebView] WebView 에러:', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('❌ [PaymentWebView] HTTP 에러:', nativeEvent.statusCode, nativeEvent.url);
          }}
          onLoadStart={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('🚀 [PaymentWebView] 로딩 시작:', nativeEvent.url);
          }}
          onLoadEnd={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('✅ [PaymentWebView] 로딩 완료:', nativeEvent.url);
          }}
          onLoadProgress={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('⏳ [PaymentWebView] 로딩 진행:', Math.round(nativeEvent.progress * 100) + '%');
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
    backgroundColor: '#f8f9fa',
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

