/**
 * components/onboarding/components/location-consent-step/index.tsx
 * 위치 연동 동의 단계 UI 컴포넌트 (순수 프레젠테이션)
 */

import { Button } from '@/commons/components/button';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';

// 이미지 리소스
const imgBackIcon = require('@/assets/icons/<.png');
const imgLocationIllustration = require('@/assets/icons/onboarding_location.png');

interface LocationConsentStepProps {
  isLoading: boolean;
  onConsent: () => void;
}

/**
 * 위치 연동 동의 단계 (UI만 담당)
 */
export function LocationConsentStep({ isLoading, onConsent }: LocationConsentStepProps) {
  return (
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <Image source={imgBackIcon} style={styles.backIcon} contentFit="contain" />
        </Pressable>
        <View style={styles.progressContainer}>
          <View style={styles.progressActive} />
          <View style={styles.progressActive} />
        </View>
      </View>

      {/* 메인 컨텐츠 */}
      <View style={styles.content}>
        {/* STEP 배지 */}
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>STEP 02</Text>
        </View>

        {/* 제목 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>지금 어디에</Text>
          <Text style={styles.title}>계신가요?</Text>
        </View>

        {/* 설명 */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>정확한 위치를 확인해야 지도 위에</Text>
          <Text style={styles.description}>당신의 소중한 기록을 남길 수 있어요.</Text>
        </View>
      </View>

      {/* 지도 일러스트레이션 */}
      <View style={styles.illustrationContainer}>
        <Image source={imgLocationIllustration} style={styles.illustration} contentFit="contain" />
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <Button
          label={isLoading ? '처리 중...' : '위치 권한 허용'}
          variant="primary"
          size="L"
          disabled={isLoading}
          onPress={onConsent}
        />
        <Pressable style={styles.skipButton}>
          <Text style={styles.skipButtonText}>건너뛰기</Text>
        </Pressable>
      </View>
    </View>
  );
}

