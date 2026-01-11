/**
 * components/onboarding/components/friend-consent-step/index.tsx
 * 친구 연동 동의 단계 UI 컴포넌트 (순수 프레젠테이션)
 */

import { Button } from '@/commons/components/button';
import { Colors } from '@/commons/constants';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Icon, { IconName } from 'react-native-remix-icon';
import { styles } from './styles';

// 이미지 리소스
const imgShield = require('@/assets/icons/shield.png');

interface FriendConsentStepProps {
  isLoading: boolean;
  onConsent: () => void;
  onSkip: () => void;
}

/**
 * 친구 연동 동의 단계 (UI만 담당)
 */
export function FriendConsentStep({ isLoading, onConsent, onSkip }: FriendConsentStepProps) {
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
            <View style={styles.progressInactive} />
          </View>
        </View>

        {/* 메인 컨텐츠 */}
        <View style={styles.content}>
          {/* STEP 01 배지 */}
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP 01</Text>
          </View>

          {/* 제목 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>친구들과 함께</Text>
            <Text style={styles.title}>찾아보세요!</Text>
          </View>

          {/* 설명 */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>연락처를 연동하면 이미 활동 중인</Text>
            <Text style={styles.description}>친구들을 바로 만날 수 있어요.</Text>
          </View>

          {/* 카드 섹션 */}
          <View style={styles.cardsContainer}>
            {/* 첫 번째 카드: 내 친구 자동 매칭 */}
            <View style={styles.card}>
              <View style={styles.cardIconContainer}>
                <Icon name={'team-line' as IconName} size={20} color={Colors.grey[500]} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>내 친구 자동 매칭</Text>
                <Text style={styles.cardDescription}>
                  내 연락처 속 친구들이 숨겨둔 에그를 알림으로도 받을 수 있어요.
                </Text>
              </View>
            </View>

            {/* 두 번째 카드: 안전한 개인정보 */}
            <View style={styles.card}>
              <View style={styles.cardIconContainer}>
                <Image source={imgShield} style={styles.cardIcon} contentFit="contain" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>안전한 개인정보</Text>
                <Text style={styles.cardDescription}>
                  모든 연락처는 암호화되어 안전하게 저장됩니다.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 하단 버튼 영역 */}
        <View style={styles.buttonContainer}>
          {/* 친구 연동 허용 버튼 */}
          <Button
            label="친구 연동 허용"
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
