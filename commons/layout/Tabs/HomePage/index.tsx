import FabButton from '@/commons/components/fab-button';
import MapScreen from '@/components/map';
import { View } from 'react-native';

import { styles } from './styles';

/**
 * 홈 페이지 (지도 화면)
 * Tabs 레이아웃과 함께 사용
 */
export default function HomePage() {
  const handleEasterEggPress = () => {
    console.log('이스터에그 버튼 클릭');
    // TODO: 이스터에그 생성 화면으로 이동
  };

  const handleTimeCapsulePress = () => {
    console.log('타임캡슐 버튼 클릭');
    // TODO: 타임캡슐 생성 화면으로 이동
  };

  return (
    <View style={styles.container}>
      <MapScreen />
      <FabButton
        onEasterEggPress={handleEasterEggPress}
        onTimeCapsulePress={handleTimeCapsulePress}
      />
    </View>
  );
}
