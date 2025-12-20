import { Text, View } from 'react-native';

import { styles } from './styles';

/**
 * 알림 페이지
 * Tabs 레이아웃과 함께 사용
 */
export default function AlarmPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>알림</Text>
        <Text style={styles.subtitle}>알림 설정 및 정보</Text>
      </View>
    </View>
  );
}
