# Query 의존성 관계 문서

이 문서는 React Query를 사용하는 API 호출 시, Mutation 후 무효화해야 하는 Query Key 목록을 관리합니다.

## 📋 의존성 관계 테이블

| Mutation API                                     | 무효화 대상 Query Keys                                                          | 이유                                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **POST /api/capsules** (캡슐 생성)               | `queryKeys.capsulesAll()`<br>`queryKeys.eggSlotData()`                          | 새로운 캡슐이 추가되어 목록이 변경됨<br>슬롯 사용량이 변경됨                   |
| **POST /api/capsules/slots/reset** (슬롯 초기화) | `queryKeys.eggSlotData()`                                                       | 슬롯 정보가 초기화됨                                                           |
| **POST /api/capsules/:id/viewers** (뷰어 등록)   | `queryKeys.capsuleDetail({ capsuleId, lat, lng })`<br>`queryKeys.capsulesAll()` | 해당 캡슐의 viewers 정보가 변경됨<br>캡슐 목록의 viewers 정보도 변경될 수 있음 |

## 🔍 상세 설명

### 1. 캡슐 생성 (POST /api/capsules)

**위치**: `components/map/components/egg-form/hooks/useEggForm.ts`

**무효화 대상**:

- `queryKeys.capsulesAll()`: 새로운 캡슐이 생성되어 목록에 추가됨 (모든 캡슐 목록 쿼리 무효화)
- `queryKeys.eggSlotData()`: 슬롯 사용량이 증가함

**구현 위치**: `useEggForm`의 `createCapsuleMutation.onSuccess`

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.capsulesAll(),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.eggSlotData(),
  });
};
```

### 2. 슬롯 초기화 (POST /api/capsules/slots/reset)

**위치**: `components/map/components/reset-egg-slot/hooks/useResetEggSlot.ts`

**무효화 대상**:

- `queryKeys.eggSlotData()`: 슬롯 정보가 초기화되어 사용량이 변경됨

**구현 위치**: `useResetEggSlot`의 `mutation.onSuccess`

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.eggSlotData(),
  });
};
```

### 3. 뷰어 등록 (POST /api/capsules/:id/viewers)

**위치**: `components/map/components/egg-detail-find/hooks/useCapsuleViewer.ts`

**무효화 대상**:

- `queryKeys.capsuleDetail({ capsuleId, lat, lng })`: 해당 캡슐의 viewers 배열이 변경됨
- `queryKeys.capsulesAll()`: 캡슐 목록에서도 viewers 정보가 표시될 수 있음 (모든 캡슐 목록 쿼리 무효화)

**구현 위치**: `useCapsuleViewer`의 `mutation.onSuccess`

```typescript
onSuccess: (_, variables) => {
  queryClient.invalidateQueries({
    queryKey: queryKeys.capsuleDetail({
      capsuleId: variables.capsuleId,
      lat: variables.location.lat,
      lng: variables.location.lng,
    }),
  });
  queryClient.invalidateQueries({
    queryKey: queryKeys.capsulesAll(),
  });
};
```

## 📝 Query Key Factory 사용 규칙

모든 Query Key는 `commons/constants/queryKeys.ts`의 Factory 객체를 통해서만 생성합니다.

**✅ 올바른 사용**:

```typescript
import { queryKeys } from '@/commons/constants';

// 단일 쿼리
queryKey: queryKeys.userInfo();

// 파라미터 쿼리
queryKey: queryKeys.capsuleDetail({ capsuleId: '123', lat: 37.5, lng: 127.0 });
```

**❌ 잘못된 사용**:

```typescript
// 문자열 직접 사용 금지
queryKey: ['userInfo'];
queryKey: ['capsuleDetail', capsuleId, lat, lng];
```

## 🎯 Optimistic Update 적용

### 뷰어 등록 (POST /api/capsules/:id/viewers)

**위치**: `components/map/components/egg-detail-find/hooks/useCapsuleViewer.ts`

**적용 이유**: 사용자 경험이 중요함. 뷰어 등록 시 즉시 UI에 반영되어 더 빠른 피드백 제공

**구현 방식**:

- `onMutate`: 캡슐 상세의 viewers 배열에 임시 뷰어 추가 및 view_count 증가
- `onError`: 실패 시 이전 데이터로 롤백
- `onSuccess`: 서버 데이터로 확정 (invalidateQueries)

**캡슐 생성은 Optimistic Update 미적용**:

- FormData 사용 및 응답 데이터 제한으로 인해 안전하지 않음
- 대신 즉시 `invalidateQueries`를 호출하여 최신 데이터를 가져옴
