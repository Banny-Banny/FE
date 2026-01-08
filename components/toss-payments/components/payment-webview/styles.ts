/**
 * payment-webview/styles.ts
 * PaymentWebView 스타일 정의
 */

/**
 * 결제 WebView용 CSS 스타일 반환
 */
export function getPaymentStyles(): string {
  return `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    #payment-button {
      width: 100%;
      max-width: 400px;
      padding: 16px;
      margin-top: 20px;
      background-color: #0064FF;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    #payment-button:active {
      background-color: #0052CC;
    }
    #payment-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    .info {
      background: white;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
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
      font-size: 14px;
    }
  </style>
  `;
}
