# 토스페이먼츠 결제 기능 문서

## 개요

타임캡슐 생성 시 토스페이먼츠 **WebView 기반 결제**를 제공합니다.

> **⚠️ 중요**: React Native에서는 토스페이먼츠 SDK가 아닌 **WebView 방식**을 사용합니다.

## 결제 플로우

### 1. 주문 생성 (Order Creation)

```
[Client] → POST /api/orders → [Backend]
```

- **위치**: `components/timecapsule-create/components/step-info/api/order.ts`
- **요청 데이터**: `CreateOrderRequest`
  - `product_id`: 상품 ID (UUID)
  - `time_option`: 개봉 시간 옵션 ('1_WEEK' | '1_MONTH' | '1_YEAR' | 'CUSTOM')
  - `custom_open_at`: 직접 선택한 개봉일 (ISO 8601 형식, CUSTOM일 경우 필수)
  - `headcount`: 인원 수 (1~10)
  - `photo_count`: 이미지 슬롯 수 (0 이상, headcount * 5 이하)
  - `add_music`: 음악 파일 추가 여부
  - `add_video`: 영상 추가 여부
- **응답 데이터**: `CreateOrderResponse`
  - `order_id`: 생성된 주문 ID (UUID)
  - `total_amount`: 총 결제 금액
  - `image_amount`: 이미지 추가 금액
  - `audio_amount`: 음악 추가 금액
  - `video_amount`: 영상 추가 금액
  - `time_option_amount`: 개봉일 옵션 추가 금액
  - `status`: 주문 상태 ('PENDING_PAYMENT' | 'COMPLETED' | 'CANCELLED')

### 2. 결제 요청 (Payment Request - WebView)

```
[Client] → WebView (TossPayments JS SDK) → [Toss Payment Gateway]
```

- **위치**: `components/toss-payments/components/payment-webview/index.tsx`
- **컴포넌트**: `PaymentWebView`
- **동작**:
  1. 결제하기 버튼 클릭 시 WebView 모달 열기
  2. WebView 내부에서 토스페이먼츠 JS SDK 로드
  3. 사용자가 결제 정보 입력 및 인증
  4. 성공 시 `postMessage`로 React Native에 결과 전달
  5. 실패 시 `postMessage`로 에러 정보 전달

**postMessage 통신**:
```javascript
// 성공
{ type: 'PAYMENT_SUCCESS', data: { paymentKey, orderId, amount } }

// 실패
{ type: 'PAYMENT_FAIL', data: { code, message } }

// 에러
{ type: 'PAYMENT_ERROR', data: { code, message } }
```

### 3. 결제 승인 (Payment Confirmation)

```
[Client] → POST /api/payments/toss/confirm → [Backend] → [Toss API]
```

- **위치**: `components/toss-payments/api/payment.ts`
- **함수**: `confirmTossPayment(paymentKey, orderId, amount)`
- **요청 데이터**: `TossPaymentConfirmRequest`
  - `paymentKey`: 토스페이먼츠에서 발급한 결제 키
  - `orderId`: 주문 ID (백엔드에서 생성한 order_id)
  - `amount`: 결제 금액
- **응답 데이터**: `TossPaymentConfirmResponse`
  - `order_id`: 주문 ID
  - `payment_key`: 결제 키
  - `status`: 결제 상태 (예: "PAID")
  - `amount`: 결제 금액
  - `approved_at`: 승인 일시 (ISO 8601)
  - `capsule_id`: 생성된 타임캡슐 ID
  - `receipt_url`: 영수증 URL

**에러 처리**:
- `400`: 검증 실패/상태 불일치
  - `AMOUNT_MISMATCH`: 결제 금액 불일치
  - `ORDER_ALREADY_PAID`: 이미 결제 완료된 주문
  - `TOSS_SECRET_KEY_REQUIRED`: 결제 시스템 설정 오류
  - `TOSS_CONFIRM_FAILED`: 토스 API 승인 실패
- `401`: 인증 실패
  - `ORDER_NOT_OWNED`: 다른 사용자의 주문
- `404`: 주문 또는 상품 정보 없음
  - `ORDER_NOT_FOUND`: 주문 정보 없음
  - `PRODUCT_NOT_FOUND_OR_INVALID`: 상품 정보 유효하지 않음

### 4. 결제 완료 처리

- **위치**: `components/toss-payments/index.tsx`
- **함수**: `handlePaymentSuccess(paymentKey, orderId, amount)`
- **동작**:
  1. WebView에서 postMessage로 전달받은 데이터 검증 (orderId, amount 일치 확인)
  2. 결제 승인 API 호출
  3. 결제 완료 모달 표시
  4. `onPaymentSuccess` 콜백 호출 (결제 데이터 전달)

## 주요 컴포넌트

### TossPayment (Container)

- **파일**: `components/toss-payments/index.tsx`
- **Props**:
  - `formData`: 이전 단계(step-info)에서 전달받은 폼 데이터
  - `orderData`: 백엔드에서 받은 주문 데이터 (`CreateOrderResponse`)
  - `onBack`: 뒤로가기 핸들러
  - `onSubmit`: 결제하기 핸들러 (주문 요약 정보 전달)
  - `onPaymentSuccess`: 결제 성공 핸들러 (결제 승인 응답 전달)

### Hooks

#### useTossPayment

- **파일**: `components/toss-payments/hooks/useTossPayment.ts`
- **기능**: 토스페이먼츠 결제 상태 관리 및 승인 처리
- **반환값**:
  - `isLoading`: 로딩 상태
  - `error`: 에러 정보
  - `paymentData`: 결제 요청 데이터
  - `setPaymentData`: 결제 데이터 설정 함수
  - `confirmPayment`: 결제 승인 함수
  - `clearError`: 에러 초기화 함수

### 컴포넌트

#### PaymentWebView

- **파일**: `components/toss-payments/components/payment-webview/index.tsx`
- **기능**: 토스페이먼츠 결제창을 WebView로 표시
- **Props**:
  - `visible`: WebView 표시 여부
  - `orderId`: 주문 ID
  - `amount`: 결제 금액
  - `orderName`: 주문명
  - `customerName`: 고객명 (선택)
  - `onSuccess`: 결제 성공 콜백 `(paymentKey, orderId, amount) => void`
  - `onFail`: 결제 실패 콜백 `(code, message) => void`
  - `onClose`: WebView 닫기 콜백
- **특징**:
  - 토스페이먼츠 JS SDK (`https://js.tosspayments.com/v1/payment`) 사용
  - `postMessage`로 React Native와 통신
  - 결제 성공/실패 URL 변경 감지

## 환경 변수

### 필수 환경 변수

```env
# 토스페이먼츠 클라이언트 키 (테스트 또는 라이브)
EXPO_PUBLIC_TOSS_CLIENT_KEY=test_ck_XXXXXXXXXX

# 백엔드 API Base URL
EXPO_PUBLIC_API_BASE_URL=https://your-backend-api.com
```

## 테스트 가이드

### 테스트 환경

토스페이먼츠는 테스트 환경을 제공하며, 실제 결제 정보를 입력해도 결제가 가상으로 승인됩니다.

**테스트 키 사용 시**:
- 유효한 카드 번호로 테스트해도 실제 결제되지 않음
- 가상계좌는 앞에 'X'가 붙음
- 테스트 결제내역은 개발자센터에서 확인 가능

### 테스트 시나리오

1. **정상 결제 플로우**
   - 주문 생성 → 결제 요청 → 카드 정보 입력 → 결제 승인 → 완료
   
2. **결제 취소 (사용자)**
   - 결제창에서 취소 버튼 클릭 → `PAY_PROCESS_CANCELED` 에러 → failUrl 리다이렉트

3. **결제 실패 (카드사)**
   - 잘못된 카드 정보 입력 → `REJECT_CARD_COMPANY` 에러 → failUrl 리다이렉트

4. **금액 불일치**
   - 결제 요청 금액과 승인 요청 금액이 다를 경우 → `AMOUNT_MISMATCH` 에러

5. **중복 결제 방지**
   - 이미 결제 완료된 주문으로 재승인 시도 → `ORDER_ALREADY_PAID` 에러

## 보안 고려사항

### 1. 데이터 무결성 검증

- **결제 요청 전**: 주문 정보를 서버에 저장 (`orderId`, `amount`)
- **결제 승인 전**: 딥링크로 받은 데이터와 저장된 데이터 비교
  ```typescript
  if (orderId !== expectedOrderId || amount !== expectedAmount) {
    Alert.alert('결제 오류', '주문 정보가 일치하지 않습니다.');
    return;
  }
  ```

### 2. 클라이언트 키 vs 시크릿 키

- **클라이언트 키**: 프론트엔드에서 사용 (결제창 열기)
- **시크릿 키**: 백엔드에서만 사용 (결제 승인 API 호출)
- ⚠️ **시크릿 키를 프론트엔드에 노출하지 말 것**

### 3. HTTPS 통신

- 모든 API 통신은 HTTPS를 사용해야 함
- 백엔드 API Base URL은 반드시 `https://`로 시작

## 문제 해결 (Troubleshooting)

### 1. 결제창이 열리지 않음

**원인**: WebView 로딩 실패 또는 클라이언트 키 오류
**해결**:
- `EXPO_PUBLIC_TOSS_CLIENT_KEY` 환경 변수 확인
- `react-native-webview` 패키지 설치 확인
- 개발 서버 재시작

### 2. postMessage가 작동하지 않음

**원인**: WebView와 React Native 간 통신 오류
**해결**:
- WebView의 `javaScriptEnabled={true}` 확인
- `window.ReactNativeWebView.postMessage` 사용 확인
- 메시지 형식이 JSON 문자열인지 확인

### 3. 결제 승인 실패 (400 에러)

**원인**: 금액 불일치 또는 주문 상태 오류
**해결**:
- 결제 요청 시 전달한 `amount`와 승인 요청 시 전달한 `amount` 일치 확인
- 주문 상태가 `PENDING_PAYMENT`인지 확인
- 백엔드 로그 확인

### 4. 네트워크 에러

**원인**: API Base URL 미설정 또는 네트워크 연결 문제
**해결**:
- `EXPO_PUBLIC_API_BASE_URL` 환경 변수 확인
- 네트워크 연결 상태 확인
- 백엔드 서버 상태 확인

## 참고 자료

- [토스페이먼츠 개발자 문서](https://docs.tosspayments.com/)
- [토스페이먼츠 React Native SDK](https://github.com/tosspayments/payment-sdk-react-native)
- [결제 흐름 이해하기](https://docs.tosspayments.com/guides/payment-flow)
- [에러 코드](https://docs.tosspayments.com/reference/error-codes)

## 변경 이력

| 버전  | 날짜     | 변경 내용                                                                                | 작성자 |
| ----- | -------- | ---------------------------------------------------------------------------------------- | ------ |
| 1.0.0 | 25-12-29 | 초기 문서 작성 (토스페이먼츠 결제 기능 통합 완료)                                       | Cursor |
| 2.0.0 | 25-12-29 | WebView 기반 결제로 전환 (SDK 방식에서 WebView + postMessage 방식으로 변경, 안정성 개선) | Cursor |

