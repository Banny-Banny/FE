# Research: 관리자 알림 푸시 수신

**Date**: 2025-01-27  
**Feature**: 관리자 알림 푸시 수신 (004-push-notification)

## Research Questions

### 1. 기존 푸시 알림 인프라 분석

**Question**: 현재 푸시 알림 수신 인프라는 어떻게 구성되어 있는가?

**Findings**:
- `components/notification/hooks/usePushNotifications.ts`에서 푸시 알림 초기화 및 수신 처리
- `expo-notifications` 라이브러리 사용
- 알림 수신 리스너: `Notifications.addNotificationReceivedListener`
- 알림 탭 리스너: `Notifications.addNotificationResponseReceivedListener`
- 알림 타입별 화면 이동 로직 구현됨:
  - `FRIEND_INVITE`, `FRIEND_ACCEPTED` → 마이페이지
  - `CAPSULE_OPEN`, `EASTER_EGG_VIEWED` → 홈(지도)
  - 기타 (else 분기) → 알림 화면

**Decision**: 기존 인프라를 그대로 활용하며, SYSTEM 타입은 else 분기로 처리되어 이미 알림 화면으로 이동하도록 구현되어 있음.

**Rationale**: 기존 코드 구조를 보면 알림 타입이 명시되지 않은 경우 기본적으로 알림 화면으로 이동하므로, SYSTEM 타입도 동일하게 처리됨.

**Alternatives considered**: 
- SYSTEM 타입을 명시적으로 처리하는 방법도 고려했으나, 현재 else 분기가 이미 적절한 동작을 수행하므로 추가 구현 불필요

---

### 2. 알림 타입 정의 확인

**Question**: SYSTEM 타입이 알림 타입 정의에 포함되어 있는가?

**Findings**:
- `components/notification/types.ts`에서 알림 타입 정의
- 현재 명시된 타입: `CAPSULE_OPEN`, `FRIEND_INVITE`, `FRIEND_ACCEPTED`, `EASTER_EGG_VIEWED`
- 타입 정의에 `string` 유니온 타입이 포함되어 있어 SYSTEM 타입도 허용됨

**Decision**: SYSTEM 타입을 명시적으로 타입 정의에 추가할 필요는 없으나, 타입 안정성을 위해 추가하는 것을 권장.

**Rationale**: `string` 유니온으로도 동작하지만, 명시적으로 타입을 추가하면 타입 안정성과 코드 가독성이 향상됨.

**Alternatives considered**: 
- `string` 유니온 타입만 사용: 타입 안정성 저하
- SYSTEM 타입 명시적 추가: 타입 안정성 향상 (선택)

---

### 3. 백엔드 푸시 알림 데이터 구조

**Question**: 백엔드에서 발송하는 푸시 알림의 데이터 구조는 어떻게 되는가?

**Findings**:
- API 문서에 따르면 관리자 알림 발송 API는 `POST /api/admin/notifications`
- 요청 본문: `targetType`, `userId`, `title`, `content`, `type: "SYSTEM"`
- 백엔드에서 푸시 알림을 발송할 때 이 정보를 푸시 알림 데이터에 포함해야 함

**Decision**: 백엔드에서 푸시 알림 발송 시 다음 데이터 구조를 포함해야 함:
```typescript
{
  type: "SYSTEM",
  notificationId: string, // 알림 목록과 매칭하기 위한 ID
  title: string,
  content: string
}
```

**Rationale**: 
- `type` 필드는 알림 탭 시 화면 이동 로직에서 사용
- `notificationId`는 알림 목록과 매칭하기 위해 필요
- `title`, `content`는 푸시 알림 표시에 사용

**Alternatives considered**: 
- notificationId 없이 처리: 알림 목록과 매칭 불가능
- notificationId 포함: 알림 목록과 매칭 가능 (권장)

---

### 4. 알림 목록 자동 새로고침 메커니즘

**Question**: 알림 수신 시 알림 목록이 자동으로 새로고침되는가?

**Findings**:
- `usePushNotifications.ts`에서 알림 수신 시 `notificationEvents.emit()` 호출
- `useNotifications.ts`에서 `notificationEvents.subscribe()`로 구독
- 알림 수신 시 자동으로 알림 목록 새로고침됨

**Decision**: 기존 메커니즘을 그대로 활용. SYSTEM 타입 알림도 동일하게 처리됨.

**Rationale**: 기존 이벤트 시스템이 모든 알림 타입에 대해 동일하게 작동하므로 추가 구현 불필요.

**Alternatives considered**: 
- 별도의 이벤트 시스템 구축: 불필요한 복잡도 증가
- 기존 이벤트 시스템 활용: 단순하고 효율적 (선택)

---

### 5. 푸시 알림 아이콘 처리

**Question**: SYSTEM 타입 알림의 아이콘은 어떻게 표시되는가?

**Findings**:
- `useNotifications.ts`의 `getNotificationIcon` 함수에서 알림 타입별 아이콘 매핑
- 현재 매핑: `CAPSULE_OPEN: '💊'`, `FRIEND_INVITE: '👥'`, `FRIEND_ACCEPTED: '🎉'`, `EASTER_EGG_VIEWED: '🥚'`
- 매핑되지 않은 타입은 기본 아이콘 `'🔔'` 사용

**Decision**: SYSTEM 타입은 기본 아이콘 `'🔔'`를 사용하거나, 필요시 `'📢'` (공지) 아이콘 추가 가능.

**Rationale**: 기본 아이콘으로도 충분하나, 시스템 공지임을 명확히 하기 위해 별도 아이콘 추가 고려 가능.

**Alternatives considered**: 
- 기본 아이콘 사용: 간단하고 일관성 유지
- 별도 아이콘 추가: 의미 전달 명확 (선택)

---

## Summary of Decisions

1. **기존 인프라 활용**: 추가 구현 없이 기존 푸시 알림 인프라 사용
2. **SYSTEM 타입 처리**: else 분기로 이미 알림 화면으로 이동하도록 구현됨
3. **타입 정의**: SYSTEM 타입을 명시적으로 추가하는 것을 권장 (선택사항)
4. **백엔드 데이터 구조**: type, notificationId, title, content 포함 필요
5. **알림 목록 새로고침**: 기존 이벤트 시스템 활용
6. **아이콘**: 기본 아이콘 사용 또는 별도 아이콘 추가 (선택사항)

## Unresolved Questions

없음. 모든 연구 질문이 해결되었습니다.

## Next Steps

1. 백엔드 팀과 푸시 알림 데이터 구조 확인 및 조정
2. SYSTEM 타입을 명시적으로 타입 정의에 추가 (선택)
3. SYSTEM 타입 아이콘 추가 (선택)
4. 실제 기기에서 푸시 알림 수신 테스트
