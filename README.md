# 🥚 TimeEgg

> 위치 기반 타임캡슐 소셜 애플리케이션

지도 위에 추억을 심고, 시간이 지나면 다시 열어보는 감성적인 타임캡슐 서비스입니다.

<br/>

## 📱 주요 기능

### 🔐 인증 & 사용자 관리

- **소셜 로그인**: 간편한 소셜 계정 연동
- **위치/연락처 동의**: 사용자 권한 관리
- **토큰 관리**: 안전한 인증 토큰 관리
- **프로필/차단**: 사용자 프로필 및 차단 기능

### 🗺️ 지도 & 위치 기반 기능

- **지도 홈**: 메인 지도 화면
- **마커 표시**: 타임캡슐 위치 표시
- **마커 상세**: 타임캡슐 미리보기

### 🥚 타임캡슐 (에그) 기능

- **에그 심기**: 타임캡슐 생성 및 위치 설정
- **선착순 설정**: 타임캡슐 획득 조건 설정
- **획득 시도**: 타임캡슐 열기 시도
- **결과 처리**: 타임캡슐 열기 성공/실패 처리
- **이스터에그(발견)**: 숨겨진 타임캡슐 발견
- **이스터에그(작성)**: 특별한 타임캡슐 작성

### 📝 콘텐츠 & 미디어

- **정보 입력**: 타임캡슐 내용 작성
- **미디어**: 사진/영상 첨부
- **신고하기**: 부적절한 콘텐츠 신고

### 👥 소셜 & 공유

- **친구 초대**: 친구 초대 기능
- **타임 캡슐**: 개인 타임캡슐 목록
- **타임 캡슐(상세)**: 타임캡슐 상세 정보
- **동기화**: 데이터 동기화

### 🎯 관리 & 제어

- **대시보드**: 타임캡슐 관리 대시보드
- **시간 마감**: 시간 기반 자동 마감
- **방장 마감**: 수동 마감 기능
- **개봉(Open)**: 타임캡슐 공개

### 💳 결제 & 구매

- **결제 진행**: 인앱 결제 처리
- **구매 내역**: 결제 이력 조회

### ⚙️ 기타

- **마이페이지**: 사용자 정보 및 활동 내역
- **설정**: 앱 설정 및 환경설정
- **스플래시**: 앱 시작 화면

<br/>

## 🛠 기술 스택

### Core

```
• Framework: Expo SDK 54
• Language: TypeScript 5.9
• Runtime: React 19.1.0
• Native: React Native 0.81.5
• Routing: Expo Router 6.0
```

### Navigation

```
• React Navigation 7.x
  - Bottom Tabs Navigation
  - Stack Navigation
• Expo Router 6.0 (파일 기반 라우팅)
```

### Styling & Animation

```
• NativeWind 4.2 (Tailwind CSS for React Native)
• Tailwind CSS 3.4
• React Native Reanimated 4.1
• React Native Gesture Handler 2.28
```

### UI/UX Libraries

```
• @expo/vector-icons - 벡터 아이콘
• react-native-remix-icon - Remix Icon
• react-native-svg - SVG 렌더링
• react-native-calendars - 캘린더 컴포넌트
• react-native-webview - 웹뷰 컴포넌트
• react-native-gesture-handler - 제스처 처리
• expo-haptics - 햅틱 피드백
• expo-image - 이미지 최적화
```

### Data Fetching & State Management

```
• @tanstack/react-query 5.90 - 서버 상태 관리
• axios 1.13 - HTTP 클라이언트
• @react-native-async-storage/async-storage - 로컬 스토리지
```

### Form Management

```
• react-hook-form 7.68 - 폼 상태 관리 및 검증
```

### Payment

```
• @tosspayments/payment-sdk-react-native - 토스페이먼츠 결제 SDK
```

### Media & File Management

```
• expo-image-picker - 이미지 선택
• expo-document-picker - 문서/파일 선택
• expo-video-thumbnails - 동영상 썸네일
• expo-av - 오디오/비디오 재생
```

### Location

```
• expo-location - 위치 권한 및 현재 위치
```

### Utilities

```
• dayjs - 날짜/시간 처리
```

### Code Quality

```
• ESLint 9.25
• TypeScript 5.9
• eslint-config-expo
```

<br/>

## 📁 프로젝트 구조 (Feature-Sliced Design)

```
TimeEgg/FE/
├── app/                          # [Routing Layer] 오직 라우팅만 담당
│   ├── _layout.tsx               # Root Layout (RootProvider)
│   ├── (tabs)/                   # 탭 네비게이션
│   │   ├── _layout.tsx           # Bottom Tabs 설정
│   │   ├── index.tsx             # 홈 (HomePage)
│   │   ├── alarm.tsx             # 알람
│   │   ├── mypage.tsx            # 마이페이지
│   │   └── timecapsule/          # 타임캡슐 Stack
│   │       ├── index.tsx         # 목록
│   │       └── create.tsx        # 생성
│   ├── (auth)/                   # 인증
│   │   ├── _layout.tsx           # Auth Stack
│   │   ├── login.tsx             # 로그인
│   │   └── auth/
│   │       └── callback.tsx      # 인증 콜백
│   ├── api/                      # API Routes
│   │   └── auth/
│   │       └── kakao/
│   │           └── callback.tsx  # 카카오 인증 콜백
│   └── component-gallery.tsx     # 컴포넌트 갤러리
│
├── utils/                        # [Pure Functions] 순수 함수
│   ├── api.ts                    # API 유틸리티
│   ├── apiClient.ts              # API 클라이언트
│   ├── auth.ts                   # 인증 유틸리티
│   ├── date-price.ts             # 날짜/가격 계산
│   ├── format.ts                 # 포맷팅 함수
│   ├── mediaType.ts              # 미디어 타입
│   ├── mediaUpload.ts            # 미디어 업로드
│   ├── mediaUrl.ts               # 미디어 URL
│   └── index.ts
│
├── commons/                      # [Design System] 순수 UI
│   ├── layout/                   # 레이아웃
│   │   ├── provider/             # 전역 Provider
│   │   │   ├── RootProvider.tsx  # 루트 Provider
│   │   │   ├── auth/             # 인증 Provider
│   │   │   ├── modal/            # 모달 Provider
│   │   │   ├── react-query/      # React Query Provider
│   │   │   └── safe-area/        # Safe Area Provider
│   │   └── Tabs/                 # 탭 레이아웃
│   │       ├── TabLayout.tsx     # 탭 레이아웃 컴포넌트
│   │       ├── HomePage/         # 홈 페이지
│   │       ├── AlarmPage/        # 알람 페이지
│   │       └── MyPage/           # 마이페이지
│   ├── components/               # 재사용 UI 컴포넌트
│   │   ├── bottom-sheet/         # 바텀시트
│   │   ├── button/               # 버튼
│   │   ├── dual-button/          # 듀얼 버튼
│   │   └── modal/                # 모달
│   ├── constants/                # 디자인 토큰
│   │   ├── borderRadius.ts       # 테두리 반경
│   │   ├── color.ts              # 색상
│   │   ├── endpoints.ts          # API 엔드포인트
│   │   ├── fonts.ts              # 폰트
│   │   ├── media.ts              # 미디어 상수
│   │   ├── routes.ts             # 라우트 상수
│   │   ├── spacing.ts            # 간격
│   │   ├── storage.ts            # 스토리지 키
│   │   ├── typography.ts         # 타이포그래피
│   │   └── index.ts
│   └── hooks/                    # 공통 훅
│       ├── useMapGestures.ts     # 지도 제스처
│       ├── useMediaUpload.ts     # 미디어 업로드
│       └── useNavigation.ts      # 네비게이션
│
└── components/                   # [Features] 기능 단위
    ├── login/                    # 로그인 기능
    │   ├── index.tsx             # Feature Container
    │   ├── types.ts              # Feature Types
    │   ├── hooks/                # Business Logic
    │   │   └── useKakaoLogin.ts
    │   └── components/           # Sub-Components
    │       └── login-form/       # 로그인 폼
    │
    ├── map/                      # 지도 기능
    │   ├── index.tsx             # Feature Container
    │   ├── types.ts              # Feature Types
    │   ├── styles.ts             # Feature Styles
    │   ├── hooks/                # Business Logic
    │   │   ├── useMapFeature.ts
    │   │   └── useEggForm.ts
    │   └── components/           # Sub-Components
    │       ├── map-view/         # 지도 뷰
    │       ├── fab-btn/          # 플로팅 버튼
    │       ├── egg-form/         # 에그 폼
    │       ├── egg-detail/       # 에그 상세
    │       ├── egg-slot/         # 에그 슬롯
    │       ├── egg-slot-modal/   # 에그 슬롯 모달
    │       ├── current-location/ # 현재 위치
    │       ├── current-location-button/ # 현재 위치 버튼
    │       ├── current-location-marker/  # 현재 위치 마커
    │       └── reset-egg-slot/   # 에그 슬롯 리셋
    │
    ├── mypage/                   # 마이페이지 기능
    │   ├── index.tsx             # Feature Container
    │   ├── types.ts              # Feature Types
    │   ├── styles.ts             # Feature Styles
    │   ├── hooks/                # Business Logic
    │   │   ├── useUserInfo.ts
    │   │   └── useLogout.ts
    │   └── components/           # Sub-Components
    │       ├── profile-section/  # 프로필 섹션
    │       ├── activity-stats/   # 활동 통계
    │       ├── menu-list/        # 메뉴 리스트
    │       └── logout-button/    # 로그아웃 버튼
    │
    ├── timecapsule-create/       # 타임캡슐 생성 기능
    │   ├── index.tsx             # Feature Container
    │   ├── types.ts              # Feature Types
    │   └── components/           # Sub-Components
    │       ├── step-info/        # 1단계: 정보 입력
    │       ├── step-room/        # 2단계: 방 설정
    │       ├── write-bottomsheet/ # 작성 바텀시트
    │       └── confirm-modal/    # 확인 모달
    │
    └── toss-payments/            # 토스페이먼츠 결제 기능
        ├── index.tsx             # Feature Container
        ├── types.ts              # Feature Types
        ├── styles.ts             # Feature Styles
        ├── api/                  # API 호출
        ├── components/           # Sub-Components
        │   ├── payment-method-selector/ # 결제 수단 선택
        │   ├── order-summary-card/     # 주문 요약 카드
        │   ├── agreements-card/        # 약관 동의 카드
        │   ├── agreement-detail-modal/  # 약관 상세 모달
        │   ├── payment-footer/         # 결제 푸터
        │   └── payment-webview/        # 결제 웹뷰
        ├── hooks/                # Business Logic
        │   ├── useTossPayment.ts
        │   ├── usePaymentHandlers.ts
        │   ├── usePaymentValidation.ts
        │   └── useOrderSummary.ts
        └── constants/            # 상수
```

> 📖 상세한 아키텍처 설명은 [folder-structure.md](./doc/v.1.0/folder-structure.md)를 참고하세요.

<br/>

## 🚀 시작하기

### 사전 요구사항

```bash
• Node.js 18+ (LTS 권장)
• npm 또는 yarn
• Expo CLI
• iOS Simulator (Mac) 또는 Android Studio (선택)
• Expo Go 앱 (모바일 기기 테스트용)
```

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone <repository-url>
cd FE

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run start

# 4. 플랫폼별 실행
npm run ios        # iOS Simulator
npm run android    # Android Emulator
npm run web        # 웹 브라우저
```

### 환경 변수 설정

`.env` 파일을 루트 디렉토리에 생성:

```bash
EXPO_PUBLIC_API_BASE_URL=your_api_url
EXPO_PUBLIC_KAKAO_API_KEY=your_kakao_key
EXPO_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_key
EXPO_PUBLIC_KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

<br/>

## 🎨 디자인 시스템

### Color Palette

```
작성 예정
```

### Spacing Tokens

```
작성 예정
```

### Border Radius

```
작성 예정
```

### Typography

```
작성 예정
```

<br/>

## 📝 개발 규칙

### 코딩 컨벤션

#### 1. 컴포넌트 작성

```typescript
// ✅ Good: Arrow Function + TypeScript
interface Props {
  title: string;
  onPress: () => void;
}

export const Component: React.FC<Props> = ({ title, onPress }) => {
  return <View>...</View>;
};
```

#### 2. 파일 명명

```
✅ components/EggCard.tsx        (PascalCase)
✅ hooks/useAuth.ts              (camelCase, use 접두어)
✅ services/egg.service.ts       (camelCase, .service 접미어)
✅ types/egg.types.ts            (camelCase, .types 접미어)
```

#### 3. Import 순서 (자동 정렬)

```typescript
// 1. React & React Native
import React from 'react';
import { View, Text } from 'react-native';

// 2. Third-party
import { useRouter } from 'expo-router';

// 3. 절대 경로 (@/)
import { useAuth } from '@/hooks/useAuth';

// 4. 상대 경로
import { styles } from './styles';
```

### Git 컨벤션

#### 브랜치 전략

```
main          # 프로덕션 (배포용)
dev           # 개발 메인
feat/*        # 기능 개발 (예: feat/egg-creation)
fix/*         # 버그 수정 (예: fix/login-error)
refactor/*    # 리팩토링
```

#### 커밋 메시지

```bash
feat: 타임캡슐 생성 기능 구현
fix: 지도 마커 위치 오류 수정
design: 로그인 버튼 스타일 개선
refactor: useAuth 훅 로직 개선
chore: ESLint 규칙 업데이트
docs: README 환경 설정 추가
```

<br/>

## 📚 문서

- [개발 문서](./doc/v.1.0/implementation.md) - 상세 개발 가이드
- [폴더 구조](./doc/v.1.0/folder-structure.md) - 프로젝트 구조 상세 설명
- [Git 협업 가이드](./doc/v.1.0/git-convention.md) - Git & GitHub 컨벤션
- [패키지 관리](./doc/v.1.0/package.md) - 의존성 관리 가이드

<br/>

## 🗺 로드맵

### Phase 1: MVP (핵심 기능) ⏳

- [ ] 백엔드 연동
- [ ] 소셜 로그인 구현
- [ ] 지도 기능 구현
- [ ] 타임캡슐 생성/조회
- [ ] 위치 기반 검색

### Phase 2: 디테일 & 인터랙션

- [ ] 타임캡슐 열기 로직
- [ ] 마이페이지
- [ ] 소셜 기능 (댓글, 좋아요)
- [ ] 푸시 알림

### Phase 3: 고도화 & 배포

- [ ] 친구 기능
- [ ] 결제 시스템
- [ ] 앱 스토어 배포
- [ ] 성능 최적화

### Phase 4: 장기 로드맵

- [ ] AR 기능
- [ ] 음성/비디오 타임캡슐
- [ ] 그룹 타임캡슐
- [ ] 웹 버전

<br/>

## 🧪 테스트

```bash
# 린트 검사
npm run lint

# 프로젝트 리셋 (초기화)
npm run reset-project
```

<br/>

## 🤝 기여하기

1. `dev` 브랜치에서 새 브랜치 생성
2. 기능 개발 또는 버그 수정
3. 커밋 메시지 컨벤션 준수
4. `dev` 브랜치로 Pull Request 생성

<br/>

## 📄 라이선스

This project is private and proprietary.

<br/>

## 📞 문의

프로젝트 관련 문의사항이나 제안사항이 있으시면 이슈를 등록해주세요.

---

<div align="center">

**TimeEgg** - 추억을 심고, 시간이 지나면 다시 만나는 특별한 경험 🥚⏰

_Made with ❤️ by TimeEgg Team_

</div>
