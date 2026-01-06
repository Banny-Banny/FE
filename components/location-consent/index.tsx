/**
 * components/location-consent/index.tsx
 * 위치 연동 동의 Feature Container
 */

import { ConsentForm } from './components/consent-form';
import { useLocationConsent } from './hooks/useLocationConsent';

/**
 * 위치 연동 동의 Feature Container
 * - 비즈니스 로직(Hook) + UI 컴포넌트 연결
 */
export default function LocationConsentFeature() {
  const { isLoading, handleConsent } = useLocationConsent();

  return <ConsentForm isLoading={isLoading} onConsent={handleConsent} />;
}

