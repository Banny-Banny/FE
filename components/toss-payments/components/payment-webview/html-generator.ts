/**
 * payment-webview/html-generator.ts
 * PaymentWebView HTML 생성 함수
 */

import { PaymentMethod } from './index';
import { getPaymentStyles } from './styles';

interface GeneratePaymentHtmlParams {
  clientKey: string;
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  paymentMethod: PaymentMethod;
  successUrl: string;
  failUrl: string;
}

/**
 * 결제 WebView용 HTML 생성
 */
export function generatePaymentHtml(params: GeneratePaymentHtmlParams): string {
  const {
    clientKey,
    orderId,
    amount,
    orderName,
    customerName,
    paymentMethod,
    successUrl,
    failUrl,
  } = params;

  console.log('📝 [PaymentWebView] HTML 생성 시작');

  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>결제</title>
  <script src="https://js.tosspayments.com/v1/payment"></script>
  ${getPaymentStyles()}
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
    ${generatePaymentScript({
      clientKey,
      orderId,
      amount,
      orderName,
      customerName,
      paymentMethod,
      successUrl,
      failUrl,
    })}
  </script>
</body>
</html>
  `;

  console.log('✅ [PaymentWebView] HTML 생성 완료, 길이:', html.length);
  return html;
}

/**
 * 결제 스크립트 생성
 */
function generatePaymentScript(params: GeneratePaymentHtmlParams): string {
  const {
    clientKey,
    orderId,
    amount,
    orderName,
    customerName,
    paymentMethod,
    successUrl,
    failUrl,
  } = params;

  return `
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
        
        // 실제 결제 로직
        try {
          loading.style.display = 'block';
          button.disabled = true;
          console.log('⏳ [PaymentWebView] 결제 요청 시작...');
          console.log('  - paymentMethod:', '${paymentMethod}');
          console.log('  - amount:', ${amount});
          console.log('  - orderId:', "${orderId}");
          console.log('  - orderName:', "${orderName}");
          console.log('  - customerName:', "${customerName}");
          console.log('  - successUrl:', '${successUrl}');
          console.log('  - failUrl:', '${failUrl}');
          
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
          
          console.log('✅ [PaymentWebView] 결제 요청 완료');
          // successUrl로 리다이렉트되므로 여기서는 처리하지 않음
          // 리다이렉트 후 URL 변경 감지로 처리됨
        } catch (error) {
          console.error('❌ [PaymentWebView] 결제 요청 오류:', error);
          loading.style.display = 'none';
          button.disabled = false;
          
          // 사용자가 결제를 취소한 경우 (PAY_PROCESS_CANCELED)
          if (error.code === 'PAY_PROCESS_CANCELED') {
            console.log('⚠️ [PaymentWebView] 사용자가 결제를 취소했습니다');
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
        
        // 성공 URL 확인
        const paymentKey = urlObj.searchParams.get('paymentKey');
        const orderIdParam = urlObj.searchParams.get('orderId');
        const amountParam = urlObj.searchParams.get('amount');
        
        if (paymentKey && orderIdParam && amountParam) {
          console.log('✅ [PaymentWebView] 결제 성공:', {
            paymentKey,
            orderId: orderIdParam,
            amount: parseInt(amountParam)
          });
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PAYMENT_SUCCESS',
            data: {
              paymentKey,
              orderId: orderIdParam,
              amount: parseInt(amountParam)
            }
          }));
          return;
        }
        
        // 실패 URL 확인
        const code = urlObj.searchParams.get('code');
        const message = urlObj.searchParams.get('message');
        
        if (code || message) {
          console.log('❌ [PaymentWebView] 결제 실패:', {
            code,
            message
          });
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PAYMENT_FAIL',
            data: {
              code: code || 'PAYMENT_FAILED',
              message: message || '결제에 실패했습니다'
            }
          }));
        }
      } catch (error) {
        console.error('❌ [PaymentWebView] URL 변경 처리 오류:', error);
      }
    }
    
    // 초기 URL 확인 (페이지 로드 시)
    setTimeout(() => {
      handleUrlChange(window.location.href);
    }, 100);
    
    // WebView 준비 완료 알림
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'READY',
      data: {
        message: 'WebView 준비 완료'
      }
    }));
    console.log('✅ [PaymentWebView] WebView 준비 완료');
  `;
}
