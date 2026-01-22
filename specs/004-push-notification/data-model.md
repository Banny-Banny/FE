# Data Model: 관리자 알림 푸시 수신

**Date**: 2025-01-27  
**Feature**: 관리자 알림 푸시 수신 (004-push-notification)

## Entities

### 1. Admin Notification (관리자 알림)

관리자가 웹에서 발송한 알림을 나타내는 엔티티입니다.

**Attributes**:
- `id` (string, required): 알림 고유 식별자
- `title` (string, required): 알림 제목
- `content` (string, required): 알림 내용
- `type` (string, required): 알림 타입, 값은 "SYSTEM"
- `targetType` (string, required): 알림 대상 유형 ("USER" 또는 "ALL")
- `userId` (string, optional): 특정 사용자 대상일 경우 사용자 ID
- `createdAt` (string, required): 알림 생성 시각 (ISO 8601 형식)
- `isRead` (boolean, required): 읽음 여부

**Relationships**:
- 알림은 사용자(user)와 연결됨 (userId를 통해)
- 알림은 알림 목록(NotificationList)에 포함됨

**Validation Rules**:
- `title`은 비어있을 수 없음
- `content`는 비어있을 수 없음
- `type`은 반드시 "SYSTEM"이어야 함
- `targetType`이 "USER"인 경우 `userId`는 필수
- `targetType`이 "ALL"인 경우 `userId`는 불필요

**State Transitions**:
- 생성됨 → 읽지 않음 (isRead: false)
- 읽음 처리 → 읽음 (isRead: true)

---

### 2. Push Notification (푸시 알림)

기기로 전송되는 푸시 알림 메시지를 나타내는 엔티티입니다.

**Attributes**:
- `title` (string, required): 알림 제목
- `body` (string, required): 알림 본문
- `data` (object, required): 알림 데이터
  - `type` (string, required): 알림 타입 ("SYSTEM")
  - `notificationId` (string, required): 알림 목록과 매칭하기 위한 ID
  - `title` (string, optional): 알림 제목 (중복 가능)
  - `content` (string, optional): 알림 내용 (중복 가능)

**Relationships**:
- 푸시 알림은 관리자 알림(Admin Notification)과 연결됨 (notificationId를 통해)

**Validation Rules**:
- `title`은 비어있을 수 없음
- `body`는 비어있을 수 없음
- `data.type`은 반드시 "SYSTEM"이어야 함
- `data.notificationId`는 필수이며 유효한 알림 ID여야 함

---

### 3. Notification List (알림 목록)

사용자가 받은 알림들의 컬렉션입니다.

**Attributes**:
- `items` (array<Notification>, required): 알림 목록
- `total` (number, optional): 전체 알림 개수
- `limit` (number, optional): 페이지당 항목 수
- `offset` (number, optional): 페이지 오프셋

**Relationships**:
- 알림 목록은 여러 알림(Notification)을 포함함
- 알림 목록은 사용자(user)와 연결됨

**Validation Rules**:
- `items`는 배열이어야 함
- `limit`는 양수여야 함
- `offset`은 0 이상이어야 함

---

## Data Flow

### 1. 관리자 알림 발송 → 푸시 알림 수신

```
[관리자 웹] 
  → POST /api/admin/notifications
  → [백엔드] 알림 생성 및 푸시 알림 발송
  → [푸시 알림 서비스] 기기로 푸시 알림 전송
  → [앱] 푸시 알림 수신
  → [앱] 알림 목록 자동 새로고침
```

### 2. 푸시 알림 탭 → 알림 화면 이동

```
[사용자] 푸시 알림 탭
  → [앱] 알림 데이터에서 type 확인
  → [앱] type이 "SYSTEM"이면 알림 화면으로 이동
  → [앱] 알림 목록 표시
```

### 3. 알림 목록 조회

```
[앱] GET /api/me/notifications
  → [백엔드] 사용자의 알림 목록 반환
  → [앱] 알림 목록 표시
```

---

## Type Definitions

### TypeScript Interfaces

```typescript
// 관리자 알림 발송 요청 (백엔드 API)
interface AdminNotificationRequest {
  targetType: 'USER' | 'ALL';
  userId?: string; // targetType이 'USER'일 때 필수
  title: string;
  content: string;
  type: 'SYSTEM';
}

// 푸시 알림 데이터 구조
interface PushNotificationData {
  type: 'SYSTEM';
  notificationId: string;
  title?: string;
  content?: string;
}

// 알림 API 응답 (기존 구조 활용)
interface NotificationApiResponse {
  id: string;
  title: string;
  content: string;
  type: 'SYSTEM' | 'CAPSULE_OPEN' | 'FRIEND_INVITE' | 'FRIEND_ACCEPTED' | 'EASTER_EGG_VIEWED';
  isRead: boolean;
  createdAt: string;
}

// 알림 목록 API 응답
interface NotificationsListResponse {
  items: NotificationApiResponse[];
}
```

---

## Notes

- 기존 알림 타입 정의에 SYSTEM 타입을 추가하는 것을 권장 (선택사항)
- 푸시 알림 데이터 구조는 백엔드와 협의하여 확정 필요
- 알림 ID는 푸시 알림과 알림 목록을 매칭하기 위해 필수
