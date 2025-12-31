import { Button } from '@/commons/components/button';
import { useNavigation } from '@/commons/hooks';
import { Text, View } from 'react-native';

import { styles } from './styles';

/**
 * 알림 페이지
 * Tabs 레이아웃과 함께 사용
 */
export default function AlarmPage() {
  const navigation = useNavigation();

  const handleNavigateToGallery = () => {
    navigation.push('/component-gallery');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>알림</Text>
        <Text style={styles.subtitle}>알림 설정 및 정보</Text>
        <View style={styles.buttonContainer}>
          <Button
            label="컴포넌트 갤러리 보기"
            variant="primary"
            size="M"
            onPress={handleNavigateToGallery}
            fullWidth={false}
          />
        </View>
      </View>
    </View>
  );
}
