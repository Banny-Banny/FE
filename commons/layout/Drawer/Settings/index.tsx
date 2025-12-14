import { Text, View } from 'react-native';

import { styles } from './styles';

/**
 * 설정 페이지
 * DrawerLayout과 함께 사용
 */
export default function SettingsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>설정</Text>
        <Text style={styles.subtitle}>앱 설정 및 환경설정</Text>
      </View>
    </View>
  );
}

