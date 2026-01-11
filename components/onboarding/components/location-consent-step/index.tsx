/**
 * components/onboarding/components/location-consent-step/index.tsx
 * 위치 연동 동의 단계 UI 컴포넌트 (순수 프레젠테이션)
 */

import { Button } from '@/commons/components/button';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from './styles';

// 이미지 리소스
const imgLocationIcon = require('@/assets/icons/onboarding_location.png');

interface LocationConsentStepProps {
  isLoading: boolean;
  onConsent: () => void;
  onSkip: () => void;
}

/**
 * 위치 연동 동의 단계 (UI만 담당)
 */
export function LocationConsentStep({ isLoading, onConsent, onSkip }: LocationConsentStepProps) {
  // 건너뛰기 핸들러 (권한 거부 처리)
  const handleSkip = () => {
    onSkip();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* 헤더 영역 */}
        <View style={styles.header}>
          {/* 진행 바 */}
          <View style={styles.progressContainer}>
            <View style={styles.progressActive} />
            <View style={styles.progressActive} />
          </View>
        </View>

        {/* 메인 컨텐츠 */}
        <View style={styles.content}>
          {/* STEP 02 배지 */}
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

          {/* 위치 아이콘 이미지 */}
          <View style={styles.imageContainer}>
            <Image source={imgLocationIcon} style={styles.locationImage} contentFit="contain" />
          </View>
        </View>

        {/* 하단 버튼 영역 */}
        <View style={styles.buttonContainer}>
          {/* 위치 권한 허용 버튼 */}
          <Button
            label="위치 권한 허용"
            variant="primary"
            size="M"
            icon="arrow-right-line"
            iconPosition="right"
            disabled={isLoading}
            onPress={onConsent}
            fullWidth={true}
          />

          {/* 건너뛰기 버튼 */}
          <Pressable style={styles.skipButton} onPress={handleSkip} disabled={isLoading}>
            <Text style={styles.skipButtonText}>건너뛰기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
