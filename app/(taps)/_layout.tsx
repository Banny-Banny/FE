/**
 * app/(taps)/_layout.tsx
 * Tabs Layout - 탭 네비게이션 설정
 * 오직 라우팅 설정만 담당
 */

import { CustomDrawerContent, DRAWER_CONFIG, DrawerMenuItem } from '@/commons/layout/Drawer';
import { Drawer } from 'expo-router/drawer';

const MENU_ITEMS: DrawerMenuItem[] = [
  { label: 'HOME', path: '/' },
  { label: 'MAP', path: '/map' },
  { label: 'PAYMENTS', path: '/payments' },
  { label: 'SETTINGS', path: '/settings' },
];

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} menuItems={MENU_ITEMS} />}
      screenOptions={DRAWER_CONFIG.screenOptions}>
      <Drawer.Screen
        name="index"
        options={{
          swipeEnabled: false,
        }}
      />
      <Drawer.Screen name="map" />
      <Drawer.Screen name="payments" />
      <Drawer.Screen name="settings" />
    </Drawer>
  );
}
