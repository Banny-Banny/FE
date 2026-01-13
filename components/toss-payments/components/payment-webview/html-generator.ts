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
        // 실제 결제 로직
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
        
        // 성공 URL 확인
        const paymentKey = urlObj.searchParams.get('paymentKey');
        const orderIdParam = urlObj.searchParams.get('orderId');
        const amountParam = urlObj.searchParams.get('amount');
        
        if (paymentKey && orderIdParam && amountParam) {
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
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PAYMENT_FAIL',
            data: {
              code: code || 'PAYMENT_FAILED',
              message: message || '결제에 실패했습니다'
            }
          }));
        }
      } catch (error) {
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
  `;
}
