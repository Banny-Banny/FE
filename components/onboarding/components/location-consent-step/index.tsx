/**
 * components/onboarding/components/location-consent-step/index.tsx
 * 위치 연동 동의 단계 UI 컴포넌트 (순수 프레젠테이션)
 */

import { Button } from '@/commons/components/button';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';

// Figma MCP에서 제공한 이미지 URL (위치 연동 동의 화면용)
// TODO: Figma MCP로부터 정확한 이미지 URL 가져오기
const imgLocationIcon = 'http://localhost:3845/assets/location-icon.svg';
const imgLocationIcon1 = 'http://localhost:3845/assets/location-icon1.svg';
const imgBackIcon = 'http://localhost:3845/assets/485eea67f7f02559a2b44a86af07a8cba6296bd3.svg';

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
          <Image source={{ uri: imgBackIcon }} style={styles.backIcon} />
        </Pressable>
        <View style={styles.progressContainer}>
          <View style={styles.progressActive} />
          <View style={styles.progressInactive} />
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
          <Text style={styles.title}>위치를 공유하고</Text>
          <Text style={styles.title}>타임캡슐을 찾아보세요</Text>
        </View>

        {/* 설명 */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>위치 권한을 허용하면 지도에서</Text>
          <Text style={styles.description}>타임캡슐을 쉽게 찾을 수 있어요.</Text>
        </View>

        {/* 정보 카드들 */}
        <View style={styles.cardsContainer}>
          {/* 카드 1: 지도에서 타임캡슐 찾기 */}
          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Image source={{ uri: imgLocationIcon }} style={styles.cardIcon} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>지도에서 타임캡슐 찾기</Text>
              <Text style={styles.cardDescription}>
                주변에 숨겨진 타임캡슐을{'\n'}
                지도에서 바로 확인할 수 있어요.
              </Text>
            </View>
          </View>

          {/* 카드 2: 안전한 위치 정보 */}
          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Image source={{ uri: imgLocationIcon1 }} style={styles.cardIcon} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>안전한 위치 정보</Text>
              <Text style={styles.cardDescription}>
                위치 정보는 암호화되어{'\n'}
                안전하게 관리됩니다.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <Button
          label={isLoading ? '처리 중...' : '위치 연동 허용하기'}
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

