import { Text, View } from 'react-native';

import { styles } from './styles';

/**
 * 결제 페이지
 * DrawerLayout과 함께 사용
 */
export default function PaymentsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>결제</Text>
        <Text style={styles.subtitle}>결제 내역 및 관리</Text>
      </View>
    </View>
  );
}

