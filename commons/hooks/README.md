# Commons Hooks

재사용 가능한 커스텀 훅 모음입니다.

## useNavigation

Expo Router 기반 페이지 이동을 위한 커스텀 훅입니다.

### 기본 사용법

```tsx
import { ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';

function MyComponent() {
  const navigation = useNavigation();

  // 페이지 이동
  const handleNavigate = () => {
    navigation.push(ROUTES.TIMECAPSULE_CREATE);
  };

  return <Button onPress={handleNavigate}>타임캡슐 생성</Button>;
}
```

### API

#### `push(path: string, params?: NavigationParams)`

특정 페이지로 이동합니다 (히스토리 스택에 추가).

```tsx
import { ROUTES } from '@/commons/constants';

// 기본 이동
navigation.push(ROUTES.TIMECAPSULE_DETAIL);

// 쿼리 파라미터와 함께 이동
navigation.push(ROUTES.TIMECAPSULE_DETAIL, { id: '123', name: 'John' });
// 결과: /timecapsule/detail?id=123&name=John
```

#### `replace(path: string, params?: NavigationParams)`

현재 페이지를 히스토리에서 제거하고 새 페이지로 이동합니다.

```tsx
import { ROUTES } from '@/commons/constants';

// 로그인 후 홈으로 이동 (뒤로가기로 로그인 화면 접근 방지)
navigation.replace(ROUTES.HOME);
```

#### `back()`

이전 페이지로 돌아갑니다.

```tsx
const handleBack = () => {
  navigation.back();
};
```

#### `canGoBack()`

뒤로 가기가 가능한지 확인합니다.

```tsx
if (navigation.canGoBack()) {
  navigation.back();
} else {
  navigation.toHome();
}
```

#### `toHome()`

홈 화면으로 이동합니다 (모든 네비게이션 스택 초기화).

```tsx
navigation.toHome();
```

#### `goBackSteps(steps: number)`

여러 단계 뒤로 갑니다.

```tsx
// 2단계 뒤로 가기
navigation.goBackSteps(2);
```

### 실제 사용 예시

#### 예시 1: 홈 페이지에서 타임캡슐 생성으로 이동

```tsx
// commons/layout/Tabs/HomePage/index.tsx
import { ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';

export default function HomePage() {
  const navigation = useNavigation();

  const handleTimeCapsulePress = () => {
    console.log('타임캡슐 버튼 클릭');
    navigation.push(ROUTES.TIMECAPSULE_CREATE);
  };

  return <MapFeature onTimeCapsulePress={handleTimeCapsulePress} />;
}
```

#### 예시 2: 뒤로가기 구현

```tsx
// components/timecapsule-create/index.tsx
import { useNavigation } from '@/commons/hooks';

export default function TimeCapsuleCreate() {
  const navigation = useNavigation();

  const handleBack = () => {
    console.log('🔙 메인으로 돌아가기');
    navigation.back();
  };

  return <StepInfo onBack={handleBack} />;
}
```

#### 예시 3: 조건부 네비게이션

```tsx
import { useNavigation } from '@/commons/hooks';

function MyComponent() {
  const navigation = useNavigation();

  const handleNavigate = () => {
    if (navigation.canGoBack()) {
      // 히스토리가 있으면 뒤로가기
      navigation.back();
    } else {
      // 히스토리가 없으면 홈으로
      navigation.toHome();
    }
  };

  return <Button onPress={handleNavigate}>돌아가기</Button>;
}
```

#### 예시 4: 쿼리 파라미터 전달

```tsx
import { ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';

function ListComponent() {
  const navigation = useNavigation();

  const handleItemPress = (itemId: string) => {
    navigation.push(ROUTES.TIMECAPSULE_DETAIL, {
      id: itemId,
      from: 'list',
      timestamp: Date.now(),
    });
  };

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item.id)}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
```

### 타입 정의

```typescript
interface NavigationParams {
  [key: string]: string | number | boolean | undefined;
}

interface UseNavigationReturn {
  push: (path: string, params?: NavigationParams) => void;
  replace: (path: string, params?: NavigationParams) => void;
  back: () => void;
  canGoBack: () => boolean;
  toHome: () => void;
  goBackSteps: (steps?: number) => void;
}
```

### 에러 처리

모든 네비게이션 함수는 내부적으로 에러 처리를 하고 있으며, 에러 발생 시 콘솔에 로그를 출력합니다.

```tsx
// 안전하게 사용 가능
navigation.back(); // 히스토리가 없어도 에러 발생하지 않음
```

### 주의사항

1. **뒤로가기 가능 여부 확인**: `back()` 호출 전에 `canGoBack()`으로 확인하는 것이 좋습니다.
2. **쿼리 파라미터**: undefined 값은 자동으로 제외됩니다.
3. **에러 핸들링**: 모든 네비게이션 에러는 자동으로 catch되어 콘솔에 출력됩니다.

## 라우트 상수 (ROUTES)

모든 라우트 경로는 `commons/constants/routes.ts`에서 상수로 관리됩니다.

### 사용 가능한 라우트

```tsx
import { ROUTES } from '@/commons/constants';

// 메인 탭
ROUTES.HOME; // '/'
ROUTES.ALARM; // '/alarm'
ROUTES.CALENDAR; // '/calendar'
ROUTES.MY_PAGE; // '/my-page'

// 타임캡슐
ROUTES.TIMECAPSULE_CREATE; // '/timecapsule/create'
ROUTES.TIMECAPSULE_DETAIL; // '/timecapsule/detail'

// 인증
ROUTES.AUTH_LOGIN; // '/(auth)/login'
ROUTES.AUTH_SIGNUP; // '/(auth)/signup'
```

### 라우트 추가하기

새로운 페이지를 추가할 때는 `commons/constants/routes.ts`에 상수를 추가하세요:

```tsx
// commons/constants/routes.ts
export const ROUTES = {
  // ... 기존 라우트들

  // 새로운 라우트 추가
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;
```

이렇게 하면:

- 타입 안정성 보장
- 자동 완성 지원
- 오타 방지
- 라우트 경로 일괄 관리 가능
