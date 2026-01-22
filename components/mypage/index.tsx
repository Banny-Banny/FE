/**
 * components/mypage/index.tsx
 * 마이페이지 Feature Container
 *
 * Feature Slice Architecture 패턴에 따라
 * 비즈니스 로직과 UI 컴포넌트를 조립하는 컨테이너
 */

import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityStats } from './components/activity-stats';
import { Header } from './components/header';
import { LogoutButton } from './components/logout-button';
import { MenuList } from './components/menu-list';
import { ProfileSection } from './components/profile-section';
import { styles } from './styles';

export default function MyPageFeature() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handlePaymentHistoryPress = () => {
    router.push('/(tabs)/payment-history');
  };

  const handleCustomerServicePress = () => {
    router.push('/(tabs)/customer-service');
  };

  const handleNoticePress = () => {
    router.push('/(tabs)/notices');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header />
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <ProfileSection />
        </View>
        <View style={styles.activityStats}>
          <ActivityStats />
        </View>
        <View style={styles.menuList}>
          <MenuList 
            onPaymentHistoryPress={handlePaymentHistoryPress} 
            onCustomerServicePress={handleCustomerServicePress}
            onNoticePress={handleNoticePress}
          />
        </View>
        <View style={styles.logoutButton}>
          <LogoutButton onPress={handleLogout} />
        </View>
      </ScrollView>
    </View>
  );
}
