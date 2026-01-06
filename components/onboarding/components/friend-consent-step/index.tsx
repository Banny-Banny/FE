/**
 * components/onboarding/components/friend-consent-step/index.tsx
 * 친구 연동 동의 단계 UI 컴포넌트 (순수 프레젠테이션)
 */

import { Button } from '@/commons/components/button';
import { Text, View } from 'react-native';
import { styles } from './styles';

interface FriendConsentStepProps {
  isLoading: boolean;
  onConsent: () => void;
}

/**
 * 친구 연동 동의 단계 (UI만 담당)
 */
export function FriendConsentStep({ isLoading, onConsent }: FriendConsentStepProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>친구 연동 동의</Text>
        <Text style={styles.description}>
          친구와 함께 타임캡슐을 만들고 공유하려면{'\n'}
          친구 연동이 필요합니다.
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            label={isLoading ? '처리 중...' : '동의하고 계속하기'}
            variant="primary"
            size="L"
            disabled={isLoading}
            onPress={onConsent}
          />
        </View>
      </View>
    </View>
  );
}

