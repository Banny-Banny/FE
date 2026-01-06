import OnboardingFeature from '@/components/onboarding';

/**
 * 온보딩 페이지 (라우팅 레이어)
 * 내부에서 단계별로 자동 전환 (로그인 → 친구 연동 → 위치 동의)
 * 비즈니스 로직 없이 Feature Container만 렌더링
 */
export default function Onboarding() {
  return <OnboardingFeature />;
}

