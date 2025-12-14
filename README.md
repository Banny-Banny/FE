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
  - Drawer Navigation
  - Stack Navigation
  - Bottom Tabs (planned)
```

### Styling & Animation

```
• NativeWind 4.2 (Tailwind CSS for React Native)
• Tailwind CSS 3.4
• React Native Reanimated 4.1
```

### UI/UX Libraries

```
• @expo/vector-icons - 아이콘
• react-native-gesture-handler - 제스처 처리
• expo-haptics - 햅틱 피드백
• expo-image - 이미지 최적화
```

### Backend & Database (Planned)

```
- 수정예정
```

### Code Quality

```
• ESLint 9.25
• Prettier
• eslint-plugin-simple-import-sort (자동 import 정렬)
```

<br/>

## 📁 프로젝트 구조

```
TimeEgg/FE/
├── app/                          # 페이지 & 라우팅 (Expo Router)
│   ├── _layout.tsx               # 최상위 레이아웃
│   ├── (app)/                    # 메인 앱 (로그인 후)
│   │   ├── _layout.tsx           # Drawer 레이아웃
│   │   ├── index.tsx             # 홈 (지도)
│   │   ├── payments.tsx          # 결제
│   │   └── settings.tsx          # 설정
│   └── (auth)/                   # 인증 (로그인 전)
│       ├── _layout.tsx           # Auth Stack 레이아웃
│       └── login.tsx             # 로그인
│
├── components/                   # 재사용 컴포넌트
│   └── map/                      # 지도 컴포넌트
│
├── commons/                      # 공통 모듈
│   └── layout/                   # 레이아웃 컴포넌트
│       └── Drawer/               # Drawer 관련
│
├── hooks/                        # 커스텀 훅 (예정)
├── services/                     # API 호출 (예정)
├── types/                        # TypeScript 타입 (예정)
├── constants/                    # 상수 및 설정 (예정)
├── assets/                       # 이미지 및 폰트
├── scripts/                      # 유틸리티 스크립트
├── doc/v.1.0/                    # 프로젝트 문서
│
├── .cursor/rules/                # AI 코딩 규칙
├── .vscode/                      # VSCode 설정
├── .gitignore
├── .prettierrc.js                # Prettier 설정
├── eslint.config.js              # ESLint 설정
├── babel.config.js               # Babel 설정
├── metro.config.js               # Metro 번들러 설정
├── tailwind.config.js            # Tailwind 설정
├── tsconfig.json                 # TypeScript 설정
├── app.json                      # Expo 설정
└── package.json                  # 의존성 관리
```

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

### 환경 변수 설정 (예정)

`.env` 파일을 루트 디렉토리에 생성:

```bash
EXPO_PUBLIC_API_BASE_URL=your_api_url
EXPO_PEXPO_PUBLIC_KAKAO_API_KEY=your_kakao_key
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
