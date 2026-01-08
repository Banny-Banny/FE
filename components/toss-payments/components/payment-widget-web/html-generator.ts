/**
 * payment-widget-web/html-generator.ts
 * PaymentWidgetWeb HTML 생성 함수 (웹 환경 전용)
 */

import { PaymentMethod } from '../payment-webview';

interface GenerateWidgetContainerParams {
  orderId: string;
  amount: number;
  orderName: string;
  paymentMethod: PaymentMethod;
}

/**
 * 결제 위젯 컨테이너 HTML 생성
 * @description 웹 환경에서 사용되는 결제 정보 표시용 HTML
 */
export function generateWidgetContainer(params: GenerateWidgetContainerParams): string {
  const { orderId, amount, orderName, paymentMethod } = params;

  return `
    <div class="payment-info-container">
      <div class="payment-info-card">
        <div class="payment-info-item">
          <span class="payment-info-label">주문명</span>
          <span class="payment-info-value">${orderName}</span>
        </div>
        <div class="payment-info-item">
          <span class="payment-info-label">주문번호</span>
          <span class="payment-info-value">${orderId}</span>
        </div>
        <div class="payment-info-item">
          <span class="payment-info-label">결제금액</span>
          <span class="payment-info-value">${amount.toLocaleString()}원</span>
        </div>
        <div class="payment-info-item">
          <span class="payment-info-label">결제수단</span>
          <span class="payment-info-value">${getPaymentMethodLabel(paymentMethod)}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * 결제 수단 라벨 변환
 */
function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    카드: '카드',
    간편결제: '간편결제',
    카카오페이: '카카오페이',
  };
  return labels[method] || method;
}
