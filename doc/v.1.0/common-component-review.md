# 공통 컴포넌트 조건 재검토 결과

## 📋 검토 기준

공통 컴포넌트(`commons/components/`)로 이동 가능한 조건:
1. ✅ **비즈니스 로직 없음**: 앱의 도메인 로직을 모름
2. ✅ **순수 UI**: Props를 통해서만 제어됨
3. ✅ **재사용 가능**: 여러 Feature에서 사용 가능
4. ✅ **의존성 없음**: `components/`나 비즈니스 로직에 의존하지 않음

## 🔍 검토 대상 컴포넌트

### 1. ZoomControl (`components/map/components/zoom-control/`)

**현재 위치**: `components/map/components/zoom-control/`

**분석**:
- ✅ 비즈니스 로직 없음
- ✅ Props로만 제어됨 (`onZoomIn`, `onZoomOut`, `onReset`)
- ✅ 순수 UI 컴포넌트
- ❌ 지도 기능에서만 사용됨 (다른 feature에서 재사용되지 않음)
- ❌ 지도 특화 컴포넌트 (줌 인/아웃은 지도 전용 기능)

**결론**: ❌ **현재 위치 유지**
- 지도 특화 컴포넌트이므로 `components/map/components/`에 유지

---

### 2. CurrentLocationButton (`components/map/components/current-location-button/`)

**현재 위치**: `components/map/components/current-location-button/`

**분석**:
- ❌ `sendMoveCameraMessage`를 직접 import (지도 특화 로직)
- ❌ WebView ref를 받아서 사용 (지도 특화)
- ❌ Platform 분기 로직 포함 (웹/네이티브)
- ❌ 지도 특화 로직이 포함되어 있음

**결론**: ❌ **현재 위치 유지**
- 지도 특화 로직이 포함되어 있으므로 `components/map/components/`에 유지

---

### 3. EggSlot (`components/map/components/egg-slot/`)

**현재 위치**: `components/map/components/egg-slot/`

**분석**:
- ❌ `useEggSlotData` hook을 사용하여 API 호출 (비즈니스 로직)
- ❌ 슬롯 데이터를 직접 조회함
- ❌ 비즈니스 로직 포함

**결론**: ❌ **현재 위치 유지**
- 비즈니스 로직(API 호출)이 포함되어 있으므로 `components/map/components/`에 유지

---

### 4. CurrentLocation (`components/map/components/current-location/`)

**현재 위치**: `components/map/components/current-location/`

**분석**:
- ✅ 비즈니스 로직 없음 (좌표를 props로 받음)
- ✅ 순수 UI 컴포넌트
- ❌ 지도 기능에서만 사용됨
- ❌ 지도 특화 컴포넌트 (위치 표시는 지도 전용)

**결론**: ❌ **현재 위치 유지**
- 지도 특화 컴포넌트이므로 `components/map/components/`에 유지

---

### 5. CurrentLocationMarker (`components/map/components/current-location-marker/`)

**현재 위치**: `components/map/components/current-location-marker/`

**분석**:
- ❌ WebView ref를 받아서 사용 (지도 특화)
- ❌ 지도 마커 표시 로직 포함
- ❌ 지도 특화 컴포넌트

**결론**: ❌ **현재 위치 유지**
- 지도 특화 로직이 포함되어 있으므로 `components/map/components/`에 유지

---

## ✅ 현재 `commons/components/`에 있는 컴포넌트 검증

### Button
- ✅ 순수 UI, 재사용 가능
- ✅ 비즈니스 로직 없음
- ✅ 올바른 위치

### DualButton
- ✅ 순수 UI, 재사용 가능
- ✅ 비즈니스 로직 없음
- ✅ 올바른 위치

### Modal
- ✅ 순수 UI, 재사용 가능
- ✅ 비즈니스 로직 없음
- ✅ 올바른 위치

### BottomSheet
- ✅ 순수 UI, 재사용 가능
- ✅ 비즈니스 로직 없음
- ✅ 올바른 위치

### TimeCapsuleHeader
- ⚠️ 타임캡슐 특화 컴포넌트
- ⚠️ 비즈니스 로직 포함 가능성
- ⚠️ 재검토 필요 (별도 검토 권장)

---

## 📝 최종 결론

### 이동할 컴포넌트 없음

모든 지도 관련 컴포넌트는 다음 중 하나의 이유로 현재 위치를 유지해야 합니다:

1. **지도 특화 로직 포함**: WebView, 카카오맵 API 등 지도 전용 기능 사용
2. **비즈니스 로직 포함**: API 호출, 상태 관리 등
3. **지도 기능에서만 사용**: 다른 feature에서 재사용되지 않음

### 권장 사항

1. **ZoomControl**: 지도 특화이므로 현재 위치 유지 ✅
2. **CurrentLocationButton**: 지도 특화 로직 포함이므로 현재 위치 유지 ✅
3. **EggSlot**: 비즈니스 로직 포함이므로 현재 위치 유지 ✅
4. **TimeCapsuleHeader**: 별도 검토 권장 (타임캡슐 feature로 이동 고려)

---

## 🎯 공통 컴포넌트 판단 기준 요약

| 조건 | 설명 | 예시 |
|------|------|------|
| ✅ 순수 UI | Props로만 제어, 비즈니스 로직 없음 | Button, Modal |
| ✅ 재사용 가능 | 여러 Feature에서 사용 가능 | BottomSheet |
| ✅ 의존성 없음 | `components/`에 의존하지 않음 | DualButton |
| ❌ Feature 특화 | 특정 기능에서만 사용 | ZoomControl, EggSlot |
| ❌ 비즈니스 로직 | API 호출, 상태 관리 포함 | EggSlot (useEggSlotData) |
| ❌ 특화 로직 | WebView, 지도 API 등 | CurrentLocationButton |

