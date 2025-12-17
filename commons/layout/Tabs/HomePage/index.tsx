import MapFeature from '@/components/map';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './styles';

/**
 * 홈 페이지 (지도 화면)
 * Tabs 레이아웃과 함께 사용
 */
export default function HomePage() {

  const handleEasterEggPress = () => {
    console.log('이스터에그 버튼 클릭');
    // TODO: 이스터에그 생성 바텀 시트 띄우기
  };

  const handleTimeCapsulePress = () => {
    console.log('타임캡슐 버튼 클릭');
    router.push('/timecapsule/create')
  };

  return (
    <View style={styles.container}>
      <MapFeature
        onEasterEggPress={handleEasterEggPress}
        onTimeCapsulePress={handleTimeCapsulePress}
      />
    </View>
  );
}
