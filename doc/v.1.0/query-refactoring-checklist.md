# Query Key Factory 및 의존성 무효화 리팩토링 체크리스트

## ✅ 완료된 작업

### 1. Query Key Factory 생성

- [x] `commons/constants/queryKeys.ts` 파일 생성
- [x] `queryKeys` Factory 객체 구현
  - `userInfo()`: 사용자 정보 조회
  - `capsuleDetail({ capsuleId, lat, lng })`: 캡슐 상세 정보 조회
  - `capsules({ lat, lng, ... })`: 캡슐 목록 조회 (추후 마이그레이션용)
  - `eggSlotData()`: 슬롯 정보 조회 (추후 마이그레이션용)
- [x] `commons/constants/index.ts`에 `queryKeys` export 추가

### 2. Query Key Factory 적용

- [x] `useCapsuleDetail`: Query Key Factory 사용
- [x] `useCapsuleViewer`: Query Key Factory 사용
- [x] `useUserInfo`: Query Key Factory 사용

### 3. Mutation 로직 개선

- [x] `useEggForm`: `useMutation`으로 리팩토링
  - 기존: 직접 `axios.post` 호출
  - 변경: `useMutation` 사용하여 사이드 이펙트 관리
- [x] `useResetEggSlot`: 이미 `useMutation` 사용 중 (유지)
- [x] `useCapsuleViewer`: 이미 `useMutation` 사용 중 (유지)

### 4. 의존성 있는 쿼리 무효화 추가

#### 4.1 캡슐 생성 (POST /api/capsules)

**파일**: `components/map/components/egg-form/hooks/useEggForm.ts`

- [x] `queryKeys.capsules()` 무효화 추가
  - 이유: 새로운 캡슐이 추가되어 목록이 변경됨
- [x] `queryKeys.eggSlotData()` 무효화 추가
  - 이유: 슬롯 사용량이 변경됨

#### 4.2 슬롯 초기화 (POST /api/capsules/slots/reset)

**파일**: `components/map/components/reset-egg-slot/hooks/useResetEggSlot.ts`

- [x] `queryKeys.eggSlotData()` 무효화 추가
  - 이유: 슬롯 정보가 초기화되어 사용량이 변경됨

#### 4.3 뷰어 등록 (POST /api/capsules/:id/viewers)

**파일**: `components/map/components/egg-detail-find/hooks/useCapsuleViewer.ts`

- [x] `queryKeys.capsuleDetail()` 무효화 유지
  - 이유: 해당 캡슐의 viewers 정보가 변경됨
- [x] `queryKeys.capsules()` 무효화 추가
  - 이유: 캡슐 목록에서도 viewers 정보가 표시될 수 있음

### 5. 문서화

- [x] `doc/v.1.0/query-dependencies.md` 생성
  - Mutation API별 무효화 대상 Query Keys 명시
  - 각 Mutation의 상세 설명 및 구현 위치 기록
  - Query Key Factory 사용 규칙 문서화

## 📋 변경된 파일 목록

1. **신규 파일**

   - `commons/constants/queryKeys.ts`: Query Key Factory 객체
   - `doc/v.1.0/query-dependencies.md`: 의존성 관계 문서
   - `doc/v.1.0/query-refactoring-checklist.md`: 이 체크리스트

2. **수정된 파일**
   - `commons/constants/index.ts`: `queryKeys` export 추가
   - `components/map/components/egg-detail-owner/hooks/useCapsuleDetail.ts`: Query Key Factory 사용
   - `components/map/components/egg-detail-find/hooks/useCapsuleViewer.ts`: Query Key Factory 사용 및 의존성 쿼리 무효화 추가
   - `components/map/components/egg-form/hooks/useEggForm.ts`: `useMutation`으로 리팩토링 및 의존성 쿼리 무효화 추가
   - `components/map/components/reset-egg-slot/hooks/useResetEggSlot.ts`: 의존성 쿼리 무효화 추가
   - `components/mypage/hooks/useUserInfo.ts`: Query Key Factory 사용

## 🔍 검증 항목

### Query Key Factory 사용 확인

- [x] 모든 Query Key가 Factory 객체를 통해 생성되는지 확인
- [x] 문자열 직접 사용이 없는지 확인

### 의존성 무효화 확인

- [x] 캡슐 생성 후 관련 쿼리 무효화 확인
- [x] 슬롯 초기화 후 관련 쿼리 무효화 확인
- [x] 뷰어 등록 후 관련 쿼리 무효화 확인

### 마이그레이션 확인

- [x] useCapsules가 react-query로 마이그레이션되었는지 확인
- [x] useEggSlotData가 react-query로 마이그레이션되었는지 확인
- [x] Query Key Factory 사용 확인

### Optimistic Update 확인

- [x] 뷰어 등록에 Optimistic Update 적용 확인
- [x] 실패 시 롤백 로직 확인

### Mutation 로직 확인

- [x] 모든 Mutation이 Custom Hook으로 분리되어 있는지 확인
- [x] 사이드 이펙트가 Hook 내부에서 관리되는지 확인

## ✅ 추가 완료 작업

### 1. useCapsules 마이그레이션

- [x] `useCapsules`를 `react-query`의 `useQuery`로 마이그레이션
- [x] `queryKeys.capsules()` 사용하도록 변경
- [x] `useState` 및 `useEffect` 제거, `useQuery`로 대체

### 2. useEggSlotData 마이그레이션

- [x] `useEggSlotData`를 `react-query`의 `useQuery`로 마이그레이션
- [x] `queryKeys.eggSlotData()` 사용하도록 변경
- [x] `useState` 및 `useEffect` 제거, `useQuery`로 대체

### 3. Optimistic Update 적용

- [x] 뷰어 등록에 Optimistic Update 적용
  - 캡슐 상세의 viewers 배열에 임시 뷰어 추가
  - view_count 즉시 증가
  - 실패 시 롤백 처리
- [x] 캡슐 생성은 `invalidateQueries` 사용 (FormData 사용 및 응답 데이터 제한으로 Optimistic Update 비적용)

## 🎯 리팩토링 원칙 준수 확인

- [x] ✅ 모든 Query Key는 Factory 객체를 통해서만 생성 (문자열 금지)
- [x] ✅ 의존성이 있는 테이블 리스트를 공유 문서에 명시 (`query-dependencies.md`)
- [x] ✅ Mutation 로직은 Custom Hook으로 분리하여 사이드 이펙트 관리
- [x] ✅ 데이터 무결성이 중요한 경우 `invalidateQueries` 적용
