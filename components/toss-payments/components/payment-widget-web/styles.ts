/**
 * payment-widget-web/styles.ts
 * PaymentWidgetWeb 스타일 정의 (웹 환경 전용)
 */

/**
 * 결제 위젯용 CSS 스타일 반환
 */
export function getWidgetStyles(): string {
  return `
    .payment-info-container {
      width: 100%;
      padding: 20px;
    }
    
    .payment-info-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
    
    .payment-info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .payment-info-item:last-child {
      border-bottom: none;
    }
    
    .payment-info-label {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }
    
    .payment-info-value {
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }
  `;
}
