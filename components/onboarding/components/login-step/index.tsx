/**
 * components/onboarding/components/login-step/index.tsx
 * 로그인 단계 UI 컴포넌트 (순수 프레젠테이션)
 */

import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { createResponsiveStyles } from './styles';

// Figma MCP에서 제공한 배경 이미지 URL
const imgGeminiGeneratedImage =
  'http://localhost:3845/assets/1f32b8de05056d1ec9a5f74cec54c29176823019.png';
const imgEllipse = 'http://localhost:3845/assets/5fd04f478f1b1f756c49f81b5c65ba151f3c22eb.svg';

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
  const { width: screenWidth } = useWindowDimensions();
  const styles = createResponsiveStyles(screenWidth);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={styles.scrollView}>
        {/* 상단 환영 메시지 */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>환영합니다!</Text>
          <Text style={styles.welcomeSubtitle}>시간을 담아, 추억을 보관하세요</Text>
        </View>

        {/* 카드 섹션 */}
        <View style={styles.cardsSection}>
          {/* 지도에서 추억 숨기기 카드 */}
          <View style={styles.cardFirst}>
            <View style={styles.cardFirstOuter}>
              <View style={styles.cardFirstContent}>
                <View style={styles.cardFirstTextContainer}>
                  <Text style={styles.cardTitle}>지도에서 추억 숨기기</Text>
                  <Text style={styles.cardDescription}>원하는 장소에 타임캡슐을 묻어보세요</Text>
                </View>
                <View style={styles.cardIconRight}>
                  <Image
                    source={require('../../../../assets/icons/locationPin.png')}
                    style={styles.cardIcon}
                    contentFit="contain"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* 친구와 함께 카드 */}
          <View style={styles.cardSecond}>
            <View style={styles.cardSecondContent}>
              <View style={styles.cardIconLeft}>
                <Image
                  source={require('../../../../assets/icons/friend.png')}
                  style={styles.cardIconSecond}
                  contentFit="contain"
                />
              </View>
              <View style={styles.cardSecondTextContainer}>
                <Text style={styles.cardTitle}>친구와 함께</Text>
                <Text style={styles.cardDescriptionSecond}>소중한 사람들과 추억을 공유하세요</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 하단 이미지 및 버튼 */}
        <View style={styles.bottomSection}>
          {/* 배경 이미지들 (flexbox로 하단 배치) */}
          <View style={styles.backgroundImagesWrapper}>
            <View style={styles.backgroundImagesContainer}>
              {/* <Image source={{ uri: imgEllipse }} style={styles.ellipseImage} /> */}
              <Image source={{ uri: imgGeminiGeneratedImage }} style={styles.bunnyImage} />
            </View>

            {/* 카카오 로그인 버튼 (이미지 위에 배치) */}
            <Pressable
              style={[styles.kakaoButton, isLoading && styles.kakaoButtonDisabled]}
              onPress={onKakaoLogin}
              disabled={isLoading}>
              <View style={styles.kakaoButtonContent}>
                <Text style={styles.kakaoButtonText}>
                  {isLoading ? '로그인 중...' : '카카오로 시작하기'}
                </Text>
                {!isLoading && (
                  <Icon name="arrow-right-line" size={21} color={styles.kakaoButtonText.color} />
                )}
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
