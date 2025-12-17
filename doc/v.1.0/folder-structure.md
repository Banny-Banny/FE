# 폴더 구조 (Folder Structure)

> 업데이트: 2025-12-17
> Feature Slice Architecture 기반 구조로 재조정 완료

## 📁 전체 구조

```
root
├── .env                      # [Env] API Key, Base URL 등 민감 정보
│
├── app/                      # [Routing Layer] 오직 "주소(URL)"와 "네비게이션"만 관리
│   ├── (tabs)/               # 탭 네비게이션 진입점
│   │   ├── index.tsx         # (홈)
│   │   ├── _layout.tsx       # 탭바 설정 (아이콘, 라벨, 숨김 처리)
│   │   ├── mypage.tsx
│   │   ├── alarm.tsx
│   │   └── timecapsule/      # 탭 없는 상세 페이지 (Stack)
│   │      └── [id].tsx
│   ├── (auth)/               # 인증 관련 라우트
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   └── _layout.tsx           # 전체 Root Stack 설정 (SafeAreaProvider 등)
│
├── utils/                    # [Pure Functions] 비즈니스 로직 없는 순수 함수
│   └── README.md             # (날짜 포맷팅, 문자열 변환, 유효성 검사 등)
│
├── commons/                  # [Design System] 앱의 로직을 모르는 "순수 UI"
│   ├── layout/               # 레이아웃 컴포넌트
│   │   ├── provider/         # 전역 Provider (Theme, Auth, Navigation 등)
│   │   │   └── README.md
│   │   └── Tabs/             # 탭 레이아웃
│   │       ├── HomePage/
│   │       ├── AlarmPage/
│   │       ├── MyPage/
│   │       ├── TabLayout/
│   │       └── index.tsx
│   ├── components/           # 순수 재사용 가능한 UI 컴포넌트 (BaseButton, Card, Icon 등)
│   └── constants/            # 디자인 토큰 (Colors, Fonts, Breakpoints)
│
└── components/               # [Features] 비즈니스 로직이 포함된 "기능 단위"
      │
      ├── map/                # ⭐️ 지도 기능 (Feature Slice)
      │   │
      │   ├── index.tsx       # ⭐️ [Entry] Feature Container (조립 공장)
      │   ├── types.ts        # [Feature Types] 이 기능 전반에서 쓰는 Props
      │   │
      │   ├── hooks/          # ⭐️ [Business Logic] 지도 기능의 "뇌"
      │   │   └── useMapFeature.ts  # (위치 권한, API 호출, 전역 상태 관리)
      │   │
      │   └── components/     # [Sub-Components] 지도 화면을 구성하는 "부품들"
      │       │
      │       ├── map-view/   # 1. 실제 지도가 그려지는 부분
      │       │   ├── index.tsx       # (View) WebView 렌더링
      │       │   ├── styles.ts       # (Style) 스타일 분리
      │       │   ├── types.ts        # (Props)
      │       │   ├── kakaoMapHtml.ts # 카카오맵 HTML
      │       │   └── hooks/          # ⭐️ [UI Logic] 지도 줌/패닝 제어 로직
      │       │       └── useMapGestures.ts
      │       │
      │       └── fab-btn/    # 2. 우측 하단 플로팅 버튼 + 메뉴
      │           ├── index.tsx       # (View) FAB 버튼 UI
      │           ├── styles.ts       # (Style)
      │           └── types.ts        # (Props)
      │
      └── timecapsule/        # 타임캡슐 기능
          └── index.tsx
```

## 📖 레이어별 역할

### 1. **app/** - Routing Layer

- **역할**: URL과 네비게이션만 관리
- **규칙**:
  - 비즈니스 로직 금지
  - Feature 컴포넌트를 import하여 렌더링만 수행
  - 라우트 설정 및 네비게이션 구조 정의

### 2. **utils/** - Pure Functions

- **역할**: 순수 함수 모음
- **규칙**:
  - 앱의 도메인 로직을 알지 못함
  - 입력에 대해 항상 같은 출력
  - 사이드 이펙트 없음

### 3. **commons/** - Design System

- **역할**: 재사용 가능한 순수 UI 컴포넌트
- **규칙**:
  - 앱의 비즈니스 로직을 모름
  - 재사용성 100%
  - Props를 통해서만 제어됨

### 4. **components/** - Features

- **역할**: 비즈니스 로직이 포함된 기능 단위
- **규칙** (Feature Slice):
  - `index.tsx`: Feature Container (조립 공장)
  - `types.ts`: Feature 전반에서 사용하는 타입
  - `hooks/`: 비즈니스 로직 (Business Logic)
  - `components/`: UI 컴포넌트 (Sub-Components)
    - 각 컴포넌트는 `index.tsx`, `styles.ts`, `types.ts` 분리
    - 복잡한 UI 로직은 `hooks/`에 분리

## ✅ Feature Slice 구조 예시 (Map Feature)

```
components/map/
├── index.tsx              # Feature Container
├── types.ts               # MapFeatureProps, MapCoordinate, MapMarker 등
├── hooks/
│   └── useMapFeature.ts   # 위치 권한, API 호출, 상태 관리
└── components/
    ├── map-view/
    │   ├── index.tsx      # WebView 렌더링
    │   ├── styles.ts
    │   ├── types.ts       # MapViewProps
    │   ├── kakaoMapHtml.ts
    │   └── hooks/
    │       └── useMapGestures.ts  # 줌/패닝 UI 로직
    └── fab-btn/
        ├── index.tsx      # FAB 버튼 UI
        ├── styles.ts
        └── types.ts       # FabButtonProps
```

## 🎯 주요 변경 사항

### Before

```
commons/components/fab-button/    # ❌ 공통 컴포넌트로 분류됨
components/map/
├── index.tsx
├── styles.ts
└── webview/
    └── kakaoMapHtml.ts
```

### After

```
components/map/                   # ✅ 완벽한 Feature Slice
├── index.tsx                     # Feature Container
├── types.ts
├── hooks/
│   └── useMapFeature.ts
└── components/
    ├── map-view/                 # 지도 WebView
    └── fab-btn/                  # FAB 버튼 (map 기능의 일부)
```

## 📝 핵심 원칙

1. **Separation of Concerns**: 각 레이어는 명확한 책임을 가짐
2. **Feature Slice**: 기능 단위로 응집도 높게 구성
3. **Dependency Rule**: 상위 레이어는 하위 레이어에 의존 가능, 역방향 금지
4. **Reusability**: 공통 UI는 `commons/`, 기능 특화 UI는 `components/`

## 🔄 다음 단계

- [ ] `useMapFeature` 훅 구현 (위치 권한, API 호출)
- [ ] `useMapGestures` 훅 구현 (줌/패닝 제어)
- [ ] `utils/` 폴더에 유틸리티 함수 추가
- [ ] `commons/components/` 에 공통 UI 컴포넌트 추가
- [ ] 타임캡슐 Feature도 동일한 구조로 재구성
