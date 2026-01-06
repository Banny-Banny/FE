# 타임캡슐 생성 플로우 및 API 엔드포인트 가이드

타임캡슐 생성 과정에서 사용되는 모든 API 엔드포인트와 데이터 흐름을 단계별로 설명합니다.

---

## 📋 전체 플로우 개요

```
1단계: 정보 입력 → 2단계: 결제 → 3단계: 대기실
  ↓              ↓              ↓
주문 생성      결제 승인      대기실 생성
```

---

## 1단계: 타임캡슐 정보 입력 (StepInfo)

### 사용 위치

- **컴포넌트**: `components/timecapsule-create/components/step-info/`
- **Hook**: `useCreateOrder.ts`

### API 호출

#### `POST /api/orders` - 주문 생성

**사용 위치**: `components/timecapsule-create/components/step-info/api/orders.ts`

**요청 데이터**:

```typescript
{
  product_id: string,        // 상품 ID (환경변수에서 가져옴)
  time_option: '1_WEEK' | '1_MONTH' | '1_YEAR' | 'CUSTOM',
  custom_open_at?: string,   // ISO 8601 형식 (time_option이 CUSTOM일 때만)
  headcount: number,         // 참여 인원수
  photo_count: number,       // 사진 개수
  add_music: boolean,        // 음악 파일 추가 여부
  add_video: boolean         // 영상 추가 여부
}
```

**반환 데이터**:

```typescript
{
  order_id: string,          // ⭐ 다음 단계로 전달되는 주문 ID
  total_amount: number,      // 총 결제 금액
  customer_key: string,      // 고객 키
  created_at: string,        // 생성 시간
  capsule_id?: string,       // 캡슐 ID (선택적)
  image_amount: number,      // 이미지 추가 금액
  audio_amount: number,      // 오디오 추가 금액
  video_amount: number,      // 비디오 추가 금액
  time_option_amount: number, // 시간 옵션 금액
  time_option: string,       // 선택한 시간 옵션
  custom_open_at: string | null, // 커스텀 개봉일
  headcount: number,         // 참여 인원수
  photo_count: number,       // 사진 개수
  add_music: boolean,        // 음악 파일 추가 여부
  add_video: boolean,        // 영상 추가 여부
  status: 'PENDING_PAYMENT' // 주문 상태
}
```

**반환값 사용처**:

- `order_id` → **2단계 결제**에서 사용
- `total_amount` → **2단계 결제**에서 사용
- 전체 `orderData` → **3단계 대기실**로 전달

---

## 2단계: 결제 (TossPayment)

### 사용 위치

- **컴포넌트**: `components/toss-payments/index.tsx`
- **Hook**: `useTossPayment.ts`

### API 호출

#### `POST /api/payments/toss/confirm` - 토스페이먼츠 결제 승인

**사용 위치**: `components/toss-payments/hooks/useTossPayment.ts`

**요청 데이터**:

```typescript
{
  paymentKey: string,        // 토스페이먼츠에서 받은 결제 키
  orderId: string,           // ⭐ 1단계에서 받은 order_id
  amount: number             // ⭐ 1단계에서 받은 total_amount
}
```

**반환 데이터**:

```typescript
{
  order_id: string,
  payment_key: string,
  status: 'DONE',
  amount: number,
  approved_at: string,
  capsule_id: string,
  receipt_url: string
}
```

**반환값 사용처**:

- 결제 완료 확인 후 다음 단계로 진행

---

#### `POST /api/orders/:orderId/status` - 주문 상태 변경

**사용 위치**: `components/toss-payments/index.tsx` (결제 성공 후)

**요청 데이터**:

```typescript
{
  status: 'PAID'; // 주문 상태를 PAID로 변경
}
```

**반환 데이터**:

```typescript
{
  order_id: string,
  order_status: 'PAID',
  payment_status: boolean,
  updated_at: string
}
```

**반환값 사용처**:

- 주문 상태 확인 (결제 완료 확인)

---

## 3단계: 대기실 (StepRoom)

### 사용 위치

- **컴포넌트**: `components/timecapsule-create/components/step-room/index.tsx`
- **Hook**: `useRoomData.ts`, `useParticipants.ts`, `useRoomSubmit.ts`

### API 호출

#### `POST /api/capsules/step-rooms/create` - 대기실 생성 및 설정값 조회

**사용 위치**: `components/timecapsule-create/components/step-room/api/capsule.ts`

**요청 데이터**:

```typescript
{
  order_id: string; // ⭐ 1단계에서 받은 order_id (또는 2단계에서 전달받은 order_id)
}
```

**반환 데이터**:

```typescript
{
  capsule_id: string,        // ⭐ 다음 API 호출에 사용되는 캡슐 ID
  invite_code: string,       // 6자리 초대 코드
  title: string,             // 캡슐 제목
  open_date: string,         // 개봉일 (ISO 8601)
  max_participants: number,  // 최대 참여 인원수
  current_participants: number, // 현재 참여 인원수
  deadline: string,         // 작성 마감 시간 (ISO 8601)
  created_at: string         // 생성 시간
}
```

**반환값 사용처**:

- `capsule_id` → **다음 API 호출**에 사용
- `invite_code` → **친구 초대**에 사용
- `open_date`, `max_participants` → **UI 표시**에 사용

---

#### `GET /api/capsules/step-rooms/:capsuleId/settings` - 대기실 설정값 조회 (필수)

**사용 위치**: `components/timecapsule-create/components/step-room/api/capsule.ts`

**요청 파라미터**:

- `capsuleId`: 위에서 받은 `capsule_id` ⭐ 필수

**반환 데이터**:

```typescript
{
  room_id: string,           // 캡슐 ID
  capsule_name: string,      // 캡슐 이름 (orders에서 설정한 정확한 제목)
  open_date: string,         // 개봉일 (YYYY-MM-DD)
  max_participants: number,  // 최대 참여 인원수
  max_images_per_person: number, // 인원당 최대 이미지 개수
  has_music: boolean,        // 음악 파일 허용 여부
  has_video: boolean         // 영상 허용 여부
}
```

**반환값 사용처**:

- ⭐ **UI에 캡슐 정보 표시** (캡슐 이름, 개봉일, 참여자 수 등)
- ⭐ **참여자 작성 제한 설정 확인** (최대 이미지 개수, 음악/영상 허용 여부)
- `useRoomData` Hook에서 `roomSettings` 상태로 저장되어 UI 전체에 사용됨

**호출 흐름**:

1. `POST /api/capsules/step-rooms/create` → `capsule_id` 받음
2. `GET /api/capsules/step-rooms/:capsuleId/settings` → 설정값 조회 (필수)
3. 두 응답을 병합하여 `roomSettings` 상태에 저장
4. UI 컴포넌트에서 `roomSettings.capsule_name`, `roomSettings.open_date` 등 사용

---

#### `GET /api/capsules/step-rooms/:capsuleId` - 대기실 상세 조회 (참여자 슬롯 정보)

**사용 위치**: `components/timecapsule-create/components/step-room/hooks/useParticipants.ts`

**요청 파라미터**:

- `capsuleId`: 위에서 받은 `capsule_id`

**반환 데이터**:

```typescript
{
  capsule_id: string,
  title: string,
  open_date: string,
  max_participants: number,
  current_participants: number,
  slots: [
    {
      user_id: string,       // 참여자 사용자 ID
      nickname: string,      // 참여자 닉네임
      is_host: boolean,      // 방장 여부
      status: 'ACCEPTED' | 'PENDING' | 'WAITING' // 슬롯 상태
    }
  ]
}
```

**반환값 사용처**:

- `slots` 배열 → **참여자 목록 UI**에 표시
- 각 참여자의 작성 상태 확인

---

#### `GET /api/capsules/step-rooms?invite_code={code}` - 초대 코드로 대기실 조회

**사용 위치**: `components/timecapsule-create/components/step-room/api/capsule.ts`

**요청 파라미터**:

- `invite_code`: 6자리 영숫자 초대 코드

**반환 데이터**:

```typescript
{
  capsule_id: string,
  title: string,
  open_date: string,
  max_participants: number,
  current_participants: number,
  invite_code: string
}
```

**반환값 사용처**:

- 초대 코드 입력 시 대기실 정보 확인
- 게스트 입장 시 사용

---

## 🔄 데이터 흐름 요약

### 1단계 → 2단계

```
StepInfo (정보 입력)
  ↓
POST /api/orders
  ↓
order_id, total_amount 반환
  ↓
TossPayment (결제)
```

### 2단계 → 3단계

```
TossPayment (결제 완료)
  ↓
POST /api/payments/toss/confirm
  ↓
POST /api/orders/:orderId/status (PAID로 변경)
  ↓
order_id 전달
  ↓
StepRoom (대기실)
```

### 3단계 내부 흐름

```
StepRoom 초기화
  ↓
POST /api/capsules/step-rooms/create (order_id 사용)
  ↓
capsule_id 반환
  ↓
GET /api/capsules/step-rooms/:capsuleId/settings (선택)
  ↓
GET /api/capsules/step-rooms/:capsuleId (참여자 슬롯 정보)
  ↓
참여자들이 콘텐츠 작성
  ↓
호스트가 최종 제출 (현재는 Mock)
```

---

## 📝 주요 ID 전달 체인

```
order_id (1단계)
  ↓
order_id (2단계 결제에 사용)
  ↓
order_id (3단계 대기실 생성에 사용)
  ↓
capsule_id (3단계 참여자 조회에 사용)
```

---

## ⚠️ 주의사항

1. **order_id는 1단계에서 생성되어 2단계, 3단계까지 전달됩니다.**
2. **capsule_id는 3단계에서 대기실 생성 후 받아서 참여자 조회에 사용됩니다.**
3. **결제 승인 후 반드시 주문 상태를 PAID로 변경해야 합니다.**
4. **참여자 콘텐츠 저장 API는 현재 Mock 상태입니다.**
5. **타임캡슐 최종 제출 API는 현재 Mock 상태입니다.**

---

## 🔗 관련 파일

- **1단계**: `components/timecapsule-create/components/step-info/`
- **2단계**: `components/toss-payments/`
- **3단계**: `components/timecapsule-create/components/step-room/`
- **API 엔드포인트 정의**: `commons/constants/endpoints.ts`
- **API 클라이언트**: `utils/apiClient.ts`
