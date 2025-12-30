import MyPageFeature from '@/components/mypage';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';

/**
 * 마이페이지
 * Tabs 레이아웃과 함께 사용
 */
export default function MyPage() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <MyPageFeature />
    </SafeAreaView>
  );
}
