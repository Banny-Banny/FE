import MapScreen from '@/components/map';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

/**
 * 홈 페이지 (지도 화면)
 * Tabs 레이아웃과 함께 사용
 */
export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MapScreen />

      {/* 타임캡슐 만들기 플로팅 버튼 */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push('/timecapsule/create')}
        accessibilityRole="button"
        accessibilityLabel="타임캡슐 만들기">
        <Text style={styles.floatingButtonText}>+ 타임캡슐 만들기</Text>
      </TouchableOpacity>
    </View>
  );
}
