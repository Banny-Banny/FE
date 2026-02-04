import MyPageFeature from '@/components/mypage';
import { View } from 'react-native';
import { styles } from './styles';

/**
 * 마이페이지
 * Tabs 레이아웃과 함께 사용
 */
export default function MyPage() {
  return (
    <View style={styles.container}>
      <MyPageFeature />
    </View>
  );
}
