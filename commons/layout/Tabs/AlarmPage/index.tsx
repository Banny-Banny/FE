import { Text, View } from 'react-native';

import { styles } from './styles';

/**
 * 알람 페이지
 * Tabs 레이아웃과 함께 사용
 */
export default function AlarmPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>소식</Text>
        <Text style={styles.subtitle}>알림 및 소식</Text>
      </View>
    </View>
  );
}
