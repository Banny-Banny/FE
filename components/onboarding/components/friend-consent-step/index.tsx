/**
 * components/onboarding/components/friend-consent-step/index.tsx
 * 친구 연동 동의 단계 UI 컴포넌트 (순수 프레젠테이션)
 */

import { Button } from '@/commons/components/button';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';

// Figma MCP에서 제공한 이미지 URL
const imgIcon = 'http://localhost:3845/assets/63a9c3fe0631b4c9b76397f9a662f3d345afa745.svg';
const imgIcon1 = 'http://localhost:3845/assets/86032ef9a65e3223bc6101110b3ca0081ebe5cb4.svg';
const imgIcon2 = 'http://localhost:3845/assets/485eea67f7f02559a2b44a86af07a8cba6296bd3.svg';

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
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <Image source={{ uri: imgIcon2 }} style={styles.backIcon} />
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
          <Text style={styles.stepBadgeText}>STEP 01</Text>
        </View>

        {/* 제목 */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>친구들과 함께</Text>
          <Text style={styles.title}>찾아보세요</Text>
        </View>

        {/* 설명 */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>연락처를 연동하면 이미 활동 중인</Text>
          <Text style={styles.description}>친구들을 바로 만날 수 있어요.</Text>
        </View>

        {/* 정보 카드들 */}
        <View style={styles.cardsContainer}>
          {/* 카드 1: 내 친구 자동 매칭 */}
          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Image source={{ uri: imgIcon }} style={styles.cardIcon} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>내 친구 자동 매칭</Text>
              <Text style={styles.cardDescription}>
                내 연락처 속 친구들이 숨겨둔 에그를{'\n'}
                알림으로도 받을 수 있어요.
              </Text>
            </View>
          </View>

          {/* 카드 2: 안전한 개인정보 */}
          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Image source={{ uri: imgIcon1 }} style={styles.cardIcon} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>안전한 개인정보</Text>
              <Text style={styles.cardDescription}>
                모든 연락처는 암호화되어 안전하게{'\n'}
                저장됩니다.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <Button
          label="친구 연동 허용"
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
