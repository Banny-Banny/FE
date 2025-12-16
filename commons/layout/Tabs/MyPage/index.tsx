import { Text, View } from 'react-native';

import { styles } from './styles';

/**
 * 마이페이지
 * Tabs 레이아웃과 함께 사용
 */
export default function MyPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>마이페이지</Text>
        <Text style={styles.subtitle}>사용자 설정 및 정보</Text>
      </View>
    </View>
  );
}
