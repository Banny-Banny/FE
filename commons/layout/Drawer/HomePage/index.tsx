import MapScreen from '@/components/map';
import { View } from 'react-native';

import { styles } from './styles';

/**
 * 홈 페이지 (지도 화면)
 * DrawerLayout과 함께 사용
 */
export default function HomePage() {
  return (
    <View style={styles.container}>
      <MapScreen />
    </View>
  );
}

