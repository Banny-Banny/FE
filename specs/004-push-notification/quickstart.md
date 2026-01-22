# Quick Start: 관리자 알림 푸시 수신

**Date**: 2025-01-27  
**Feature**: 관리자 알림 푸시 수신 (004-push-notification)

## 개요

이 기능은 관리자가 웹에서 발송한 알림을 앱에서 푸시 알림으로 수신하는 기능입니다. 기존 푸시 알림 인프라를 활용하므로 추가 구현이 최소화됩니다.

## 사전 요구사항

1. **백엔드 확인 사항**:
   - 관리자 알림 발송 API (`POST /api/admin/notifications`)가 구현되어 있어야 함
   - 백엔드에서 푸시 알림 발송 시 다음 데이터 구조를 포함해야 함:
     ```json
     {
       "type": "SYSTEM",
       "notificationId": "알림 ID",
       "title": "알림 제목",
       "content": "알림 내용"
     }
     ```

2. **앱 환경**:
   - 푸시 알림 권한이 허용되어 있어야 함
   - 사용자의 푸시 토큰이 백엔드에 등록되어 있어야 함

## 구현 단계

### 1. 타입 정의 업데이트 (선택사항)

`components/notification/types.ts`에 SYSTEM 타입을 명시적으로 추가:

```typescript
export type NotificationType =
  | 'CAPSULE_OPEN'
  | 'FRIEND_INVITE'
  | 'FRIEND_ACCEPTED'
  | 'EASTER_EGG_VIEWED'
  | 'SYSTEM'  // 추가
  | string;
```

**참고**: `string` 유니온 타입이 이미 포함되어 있어 SYSTEM 타입도 동작하지만, 타입 안정성을 위해 명시적으로 추가하는 것을 권장합니다.

### 2. 아이콘 매핑 업데이트 (선택사항)

`components/notification/hooks/useNotifications.ts`의 `getNotificationIcon` 함수에 SYSTEM 타입 아이콘 추가:

```typescript
const getNotificationIcon = (type: NotificationType): string => {
  const iconMap: Record<string, string> = {
    CAPSULE_OPEN: '💊',
    FRIEND_INVITE: '👥',
    FRIEND_ACCEPTED: '🎉',
    EASTER_EGG_VIEWED: '🥚',
    SYSTEM: '📢',  // 추가 (선택사항)
  };
  return iconMap[type] || '🔔';
};
```

**참고**: 아이콘을 추가하지 않으면 기본 아이콘 `'🔔'`가 사용됩니다.

### 3. 기존 코드 확인

다음 파일들이 이미 올바르게 구현되어 있는지 확인:

- `components/notification/hooks/usePushNotifications.ts`:
  - 알림 탭 리스너의 else 분기가 알림 화면으로 이동하도록 구현되어 있음
  - SYSTEM 타입은 else 분기로 처리되어 알림 화면으로 이동함

- `components/notification/hooks/useNotifications.ts`:
  - 알림 목록 조회 기능이 구현되어 있음
  - 알림 수신 시 자동 새로고침 기능이 구현되어 있음

**참고**: 기존 코드가 이미 올바르게 구현되어 있으므로 추가 수정이 필요하지 않을 수 있습니다.

## 테스트 방법

### 1. 푸시 알림 수신 테스트

1. **앱 실행**:
   ```bash
   npm start
   # 또는
   expo start
   ```

2. **실제 기기에서 테스트**:
   - iOS: `expo run:ios`
   - Android: `expo run:android`

3. **관리자 알림 발송**:
   - 어드민 페이지에서 알림 발송
   - 대상 사용자로 설정된 계정의 앱에서 푸시 알림 수신 확인

4. **앱 상태별 테스트**:
   - 포그라운드: 앱이 실행 중일 때 알림 수신
   - 백그라운드: 앱을 백그라운드로 보낸 후 알림 수신
   - 종료: 앱을 완전히 종료한 후 알림 수신

### 2. 알림 목록 표시 테스트

1. **알림 수신 후**:
   - 알림 목록 화면(`/(tabs)/alarm`)으로 이동
   - 관리자 알림이 목록에 표시되는지 확인
   - 알림 제목과 내용이 올바르게 표시되는지 확인

2. **알림 탭 테스트**:
   - 푸시 알림을 탭하여 앱이 열리고 알림 화면으로 이동하는지 확인

### 3. 자동 새로고침 테스트

1. **알림 수신 시**:
   - 알림 목록 화면이 열려있는 상태에서 알림 수신
   - 알림 목록이 자동으로 새로고침되는지 확인

## 문제 해결

### 푸시 알림이 수신되지 않는 경우

1. **푸시 토큰 확인**:
   - 사용자의 푸시 토큰이 백엔드에 등록되어 있는지 확인
   - 앱 재시작 후 토큰 재등록 시도

2. **권한 확인**:
   - 기기 설정에서 알림 권한이 허용되어 있는지 확인
   - 앱 내에서 알림 권한 상태 확인

3. **백엔드 확인**:
   - 백엔드에서 푸시 알림 발송 로그 확인
   - 푸시 알림 서비스(Expo Push Notification Service) 상태 확인

### 알림 목록에 표시되지 않는 경우

1. **API 확인**:
   - `GET /api/me/notifications` API 응답 확인
   - 알림이 API 응답에 포함되어 있는지 확인

2. **알림 ID 확인**:
   - 푸시 알림의 `notificationId`와 알림 목록의 `id`가 일치하는지 확인

3. **수동 새로고침**:
   - 알림 목록 화면에서 수동으로 새로고침 시도

## 다음 단계

1. 백엔드 팀과 푸시 알림 데이터 구조 확인 및 조정
2. 실제 기기에서 종합 테스트
3. 프로덕션 배포 전 스테이징 환경에서 테스트

## 참고 자료

- [스펙 문서](./spec.md)
- [연구 문서](./research.md)
- [데이터 모델](./data-model.md)
- [API 계약서](./contracts/push-notification.yaml)
