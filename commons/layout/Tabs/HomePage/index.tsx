import { Toast } from '@/commons/components/toast';
import { ROUTES } from '@/commons/constants';
import { useNavigation } from '@/commons/hooks';
import MapFeature from '@/components/map';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles';

/**
 * 홈 페이지 (지도 화면)
 * Tabs 레이아웃과 함께 사용
 */
export default function HomePage() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // URL 파라미터에서 토스트 메시지 확인
  useEffect(() => {
    const showToast = params.showToast;
    if (showToast === 'true' || showToast === '1') {
      setToastMessage('대기실은 마이페이지에서 조회 가능합니다');
      setToastVisible(true);
      // URL 파라미터 제거 (한 번만 표시)
      // Note: expo-router에서는 직접 URL을 수정할 수 없으므로, 
      // 컴포넌트가 다시 마운트될 때는 표시되지 않도록 처리
    }
  }, [params.showToast]);

  const handleEasterEggPress = () => {
    console.log('이스터에그 버튼 클릭');
    // TODO: 이스터에그 생성 바텀 시트 띄우기
  };

  const handleTimeCapsulePress = () => {
    console.log('타임캡슐 버튼 클릭');
    navigation.push(ROUTES.TIMECAPSULE_CREATE);
  };

  return (
    <View style={styles.container}>
      <MapFeature
        onEasterEggPress={handleEasterEggPress}
        onTimeCapsulePress={handleTimeCapsulePress}
      />
      {/* 토스트 메시지 */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}
