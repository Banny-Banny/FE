/**
 * components/onboarding/components/login-step/index.tsx
 * 로그인 단계 UI 컴포넌트 (순수 프레젠테이션)
 */

import { Image, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { styles } from './styles';

// 피그마에서 제공된 이미지 에셋 URL
const IMG_ILLUSTRATION = 'http://localhost:3845/assets/1f32b8de05056d1ec9a5f74cec54c29176823019.png';
const IMG_ELLIPSE = 'http://localhost:3845/assets/5fd04f478f1b1f756c49f81b5c65ba151f3c22eb.svg';
const IMG_LOCATION_ICON = 'http://localhost:3845/assets/e11f6bf89ea89599d3c731a4b3757e56614bcf0d.svg';
const IMG_FRIEND_ICON = 'http://localhost:3845/assets/10cc22e87847878b14afe497576868a4fa09453f.svg';

interface LoginStepProps {
  isLoading: boolean;
  onKakaoLogin: () => void;
}

/**
 * 로그인 단계 (UI만 담당)
 */
export function LoginStep({ isLoading, onKakaoLogin }: LoginStepProps) {
  return (
    <View style={styles.container}>
      {/* 상단 환영 메시지 */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>환영합니다!</Text>
        <Text style={styles.welcomeSubtitle}>시간을 담아, 추억을 보관하세요</Text>
      </View>

      {/* 기능 소개 카드들 */}
      <View style={styles.cardsSection}>
        {/* 첫 번째 카드: 지도에서 추억 숨기기 */}
        <View style={styles.cardFirst}>
          <View style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>지도에서 추억 숨기기</Text>
              <Text style={styles.cardDescription}>원하는 장소에 타임캡슐을 묻어보세요</Text>
            </View>
            <View style={styles.cardIconContainer}>
              <Image source={{ uri: IMG_LOCATION_ICON }} style={styles.cardIcon} />
            </View>
          </View>
        </View>

        {/* 두 번째 카드: 친구와 함께 */}
        <View style={styles.cardSecond}>
          <View style={styles.cardContent}>
            <View style={styles.cardIconContainerLeft}>
              <Image source={{ uri: IMG_FRIEND_ICON }} style={styles.cardIcon} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>친구와 함께</Text>
              <Text style={styles.cardDescription}>소중한 사람들과 추억을 공유하세요</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 하단 일러스트 및 버튼 */}
      <View style={styles.bottomSection}>
        {/* 일러스트 배경 (Ellipse) */}
        <View style={styles.illustrationContainer}>
          <Image source={{ uri: IMG_ELLIPSE }} style={styles.ellipseImage} />
        </View>

        {/* 일러스트 메인 이미지 */}
        <View style={styles.illustrationMain}>
          <Image source={{ uri: IMG_ILLUSTRATION }} style={styles.illustrationImage} />
        </View>

        {/* 카카오 로그인 버튼 */}
        <Pressable
          style={[styles.kakaoButton, isLoading && styles.kakaoButtonDisabled]}
          onPress={onKakaoLogin}
          disabled={isLoading}>
          <View style={styles.kakaoButtonContent}>
            <Text style={styles.kakaoButtonText}>
              {isLoading ? '로그인 중...' : '카카오로 시작하기'}
            </Text>
            {!isLoading && (
              <Icon name="ri-arrow-right-line" size={21} color="#1a1a1a" />
            )}
          </View>
        </Pressable>

        {/* 저작권 표시 */}
        <Text style={styles.copyright}>© 2025 타임캡슐</Text>
      </View>
    </View>
  );
}
