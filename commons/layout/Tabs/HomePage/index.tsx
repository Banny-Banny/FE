import { ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';
import MapFeature from '@/components/map';
import { View } from 'react-native';
import { styles } from './styles';

/**
 * 홈 페이지 (지도 화면)
 * Tabs 레이아웃과 함께 사용
 */
export default function HomePage() {
  const navigation = useNavigation();

  const handleEasterEggPress = () => {
    console.log('이스터에그 버튼 클릭');
    // TODO: 이스터에그 생성 바텀 시트 띄우기
  };

  const handleTimeCapsulePress = () => {
    console.log('타임캡슐 버튼 클릭');
    navigation.push(ROUTES.TIMECAPSULE_CREATE);
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
