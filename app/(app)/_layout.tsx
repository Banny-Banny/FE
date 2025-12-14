import { CustomDrawerContent, DRAWER_CONFIG, DrawerMenuItem } from '@/commons/layout/Drawer';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const MENU_ITEMS: DrawerMenuItem[] = [
  { label: 'HOME', path: '/' },
  { label: 'PAYMENTS', path: '/payments' },
  { label: 'SETTINGS', path: '/settings' },
];

export default function AppLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} menuItems={MENU_ITEMS} />}
          screenOptions={DRAWER_CONFIG.screenOptions}>
          <Drawer.Screen
            name="index"
            options={{
              swipeEnabled: false,
            }}
          />
          <Drawer.Screen name="payments" />
          <Drawer.Screen name="settings" />
        </Drawer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
