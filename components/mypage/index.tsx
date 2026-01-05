/**
 * components/mypage/index.tsx
 * 마이페이지 Feature Container
 *
 * Feature Slice Architecture 패턴에 따라
 * 비즈니스 로직과 UI 컴포넌트를 조립하는 컨테이너
 */

import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import React from 'react';
import { View } from 'react-native';
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

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <ProfileSection />
        </View>
        <View style={styles.activityStats}>
          <ActivityStats />
        </View>
        <View style={styles.menuList}>
          <MenuList />
        </View>
        <View style={styles.logoutButton}>
          <LogoutButton onPress={handleLogout} />
        </View>
      </View>
    </View>
  );
}
