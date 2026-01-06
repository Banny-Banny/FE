/**
 * components/friend-consent/index.tsx
 * 친구 연동 동의 Feature Container
 */

import { ConsentForm } from './components/consent-form';
import { useFriendConsent } from './hooks/useFriendConsent';

/**
 * 친구 연동 동의 Feature Container
 * - 비즈니스 로직(Hook) + UI 컴포넌트 연결
 */
export default function FriendConsentFeature() {
  const { isLoading, handleConsent } = useFriendConsent();

  return <ConsentForm isLoading={isLoading} onConsent={handleConsent} />;
}

