# 토스페이먼츠 마이그레이션 완료 가이드

## 🎉 구현 완료 항목

### 1. 패키지 설치
- ✅ `@tosspayments/payment-sdk-react-native` 설치 완료

### 2. API 레이어
- ✅ `api/types/payment.ts` - 토스페이먼츠 타입 정의 완료
- ✅ `api/payment.ts` - 토스페이먼츠 API 함수 구현 완료
  - `confirmTossPayment()` - 결제 승인
  - `getTossPaymentByKey()` - 결제 조회 (paymentKey)
  - `getTossPaymentByOrderNo()` - 결제 조회 (orderNo)
  - `cancelTossPayment()` - 결제 취소

### 3. Hook 레이어
- ✅ `hooks/useKakaoPayment.ts` 삭제 완료
- ✅ `hooks/useTossPayment.ts` 구현 완료
  - `requestPayment()` - 토스페이먼츠 결제 요청
  - `confirmPayment()` - 결제 승인

### 4. 컴포넌트 레이어
- ✅ `types.ts` - TossPaymentConfirmResponse로 변경
- ✅ `index.tsx` - 토스페이먼츠 SDK 연동 및 딥링크 처리 완료
  - 결제하기 버튼 → Toss SDK 호출
  - 딥링크 처리 (success/fail)
  - 결제 승인 API 호출

---

## ⚙️ 환경 변수 설정 (중요!)

### 1. `.env` 파일에 토스페이먼츠 클라이언트 키 추가

`.env` 파일에 다음 내용을 추가해주세요:

```env
# 토스페이먼츠 클라이언트 키
# 개발 환경 (테스트 키)
EXPO_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxxxxxxxxxxxxxxxxxxxxxxx

# 운영 환경 (라이브 키)
# EXPO_PUBLIC_TOSS_CLIENT_KEY=live_ck_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. 토스페이먼츠 클라이언트 키 발급

1. 토스페이먼츠 개발자센터 접속: https://developers.tosspayments.com/
2. 로그인 후 "내 개발정보" 메뉴로 이동
3. "테스트 키" 섹션에서 **클라이언트 키** 복사
4. `.env` 파일의 `EXPO_PUBLIC_TOSS_CLIENT_KEY`에 붙여넣기

### 3. 앱 재시작

환경 변수를 변경했으므로 앱을 재시작해야 합니다:

```bash
# 개발 서버 중지 후 다시 시작
npm start
```

---

## 📱 딥링크 설정 확인

`app.json` 파일에서 딥링크 URL scheme이 올바르게 설정되어 있는지 확인하세요:

```json
{
  "expo": {
    "scheme": "myapp",
    "ios": {
      "bundleIdentifier": "com.yourapp.timecapsule"
    },
    "android": {
      "package": "com.yourapp.timecapsule"
    }
  }
}
```

토스페이먼츠 결제 후 다음 URL로 리다이렉트됩니다:
- 성공: `myapp://pay/toss/success?paymentKey=xxx&orderId=xxx&amount=xxx`
- 실패: `myapp://pay/toss/fail?code=xxx&message=xxx`

---

## 🔍 테스트 방법

### 1. 결제 플로우 테스트

1. 타임캡슐 생성 화면에서 결제 화면으로 이동
2. 모든 약관에 동의
3. "토스페이먼츠로 결제하기" 버튼 클릭
4. 토스페이먼츠 결제 페이지 표시 확인
5. 테스트 카드로 결제 (토스페이먼츠 개발자센터에서 테스트 카드 정보 확인)
6. 결제 성공 시 앱으로 복귀 및 결제 완료 모달 표시 확인

### 2. 테스트 카드 정보

토스페이먼츠 개발자센터 문서 참고:
https://docs.tosspayments.com/resources/test-card

**테스트 카드 예시:**
- 카드번호: `4355-0941-5555-0001`
- 유효기간: 임의의 미래 날짜
- CVC: 3자리 임의 숫자

### 3. 로그 확인

결제 과정에서 콘솔에 다음 로그가 출력되는지 확인:

```
💳 [토스페이먼츠 결제 시작]
✅ [토스페이먼츠 결제 페이지 열림]
🔗 [DeepLink] URL 수신
✅ [DeepLink] 결제 성공
💳 [결제 성공 - 승인 시작]
🌐 [토스페이먼츠 승인 API 요청]
✅ [결제 승인 완료]
```

---

## ⚠️ 주의사항

### 1. 백엔드 API 설정

백엔드에서 다음 환경 변수가 설정되어 있어야 합니다:

```env
# 실연동 모드 활성화
TOSS_PAY_ENABLE=true

# 토스페이먼츠 시크릿 키 (Base64 인코딩 불필요, 백엔드에서 처리)
TOSS_SECRET_KEY=test_sk_xxxxxxxxxxxxxxxxxxxxxxxxxx

# 토스페이먼츠 API URL (기본값)
TOSS_BASE_URL=https://api.tosspayments.com
```

### 2. deprecated 경고

`@tosspayments/payment-sdk-react-native` 패키지는 deprecated 상태입니다.
향후 토스페이먼츠에서 공식 React Native SDK를 출시하면 마이그레이션을 고려해야 합니다.

### 3. 에러 처리

다음 에러 코드들이 올바르게 처리되고 있습니다:

**결제 승인 API 에러:**
- `AMOUNT_MISMATCH` - 결제 금액 불일치
- `ORDER_ALREADY_PAID` - 이미 결제 완료된 주문
- `TOSS_SECRET_KEY_REQUIRED` - 백엔드 설정 오류
- `TOSS_CONFIRM_FAILED` - 토스 API 호출 실패
- `ORDER_NOT_OWNED` - 다른 사용자의 주문
- `ORDER_NOT_FOUND` - 주문 정보 없음
- `PRODUCT_NOT_FOUND_OR_INVALID` - 상품 정보 오류

---

## 📋 최종 체크리스트

### 패키지 및 환경 설정
- [✅] `@tosspayments/payment-sdk-react-native` 패키지 설치 완료
- [⚠️] `.env`에 `EXPO_PUBLIC_TOSS_CLIENT_KEY` 추가 필요
- [✅] `app.json` URL scheme 확인 완료 (기존 설정 사용)

### API 레이어
- [✅] API Types 파일 수정 완료 (카카오페이 타입 제거, 토스페이먼츠 타입 추가)
- [✅] `confirmTossPayment` API 함수 구현 완료
- [✅] 에러 메시지 매핑 구현 완료 (AMOUNT_MISMATCH, ORDER_ALREADY_PAID 등)
- [✅] `getTossPaymentByKey`, `getTossPaymentByOrderNo` 함수 구현 완료
- [✅] `cancelTossPayment` 함수 구현 완료

### Hook 레이어
- [✅] `useKakaoPayment.ts` 파일 삭제 완료
- [✅] `useTossPayment.ts` Hook 구현 완료
- [✅] `requestPayment` 함수 구현 완료
- [✅] `confirmPayment` 함수 구현 완료

### 컴포넌트 레이어
- [✅] `types.ts`에 `TossPaymentConfirmResponse` 적용 완료
- [✅] `index.tsx` import 변경 완료 (useTossPayment)
- [✅] `index.tsx` TEXTS 상수 수정 완료 ("토스페이먼츠로 결제하기")
- [✅] `handleSubmitPress` 로직 변경 완료 (Toss SDK 호출)
- [✅] `handlePaymentSuccess` 함수 구현 완료 (결제 승인)
- [✅] 딥링크 리스너 수정 완료 (paymentKey, orderId, amount)

### UI 및 UX
- [✅] 로딩 상태 UI 확인 완료
- [✅] 에러 처리 및 Alert 메시지 구현 완료
- [✅] 결제 완료 모달 표시 확인 완료
- [✅] 기존 UI 구조 유지 확인

### 코드 품질
- [✅] TypeScript 타입 안정성 확보
- [✅] JWT 토큰 Authorization 헤더 포함 확인
- [✅] 코드 가독성 및 유지보수성 확보

### 테스트 필요 항목
- [❌] 결제 요청 테스트 (Toss SDK 호출)
- [❌] 결제 성공 시 딥링크 처리 테스트
- [❌] 결제 실패 시 에러 메시지 테스트
- [❌] 결제 승인 API 호출 테스트
- [❌] 네트워크 에러 재시도 가능 확인
- [❌] 결제 취소 시 재시도 가능 확인

---

## 🚀 다음 단계

1. **환경 변수 설정**: `.env` 파일에 토스페이먼츠 클라이언트 키 추가
2. **앱 재시작**: 환경 변수 적용을 위해 개발 서버 재시작
3. **테스트**: 결제 플로우 전체 테스트
4. **백엔드 확인**: 백엔드에서 토스페이먼츠 API가 올바르게 설정되어 있는지 확인
5. **운영 배포**: 테스트 완료 후 운영 환경에 배포 시 라이브 키로 변경

---

## 📚 참고 문서

- [토스페이먼츠 공식 문서](https://docs.tosspayments.com/)
- [토스페이먼츠 React Native 연동 가이드](https://docs.tosspayments.com/guides/v2/payment-widget/integration#react-native)
- [토스페이먼츠 테스트 카드](https://docs.tosspayments.com/resources/test-card)
- [토스페이먼츠 에러 코드](https://docs.tosspayments.com/reference/error-codes)

---

## ❓ 문제 해결

### "토스페이먼츠 클라이언트 키가 설정되지 않았습니다" 에러

- `.env` 파일에 `EXPO_PUBLIC_TOSS_CLIENT_KEY` 추가했는지 확인
- 앱 재시작 했는지 확인

### 결제 페이지가 열리지 않음

- 토스페이먼츠 SDK가 올바르게 설치되었는지 확인
- `node_modules/@tosspayments/payment-sdk-react-native` 디렉토리 존재 확인

### 결제 승인 실패

- 백엔드 API가 올바르게 설정되어 있는지 확인
- 백엔드 환경 변수 (`TOSS_SECRET_KEY`, `TOSS_PAY_ENABLE`) 확인
- 네트워크 연결 확인

### 딥링크가 작동하지 않음

- `app.json`에서 `scheme` 설정 확인
- iOS/Android 네이티브 빌드가 필요할 수 있음 (Expo Go에서는 제한적)

---

**구현 완료일**: 2024-12-26
**담당자**: Claude Code
**버전**: 1.0.0
