import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DRAWER_SCREEN_OPTIONS, MENU_BUTTON_POSITION, styles } from './styles';

export interface DrawerMenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface CustomDrawerContentProps extends DrawerContentComponentProps {
  menuItems?: DrawerMenuItem[];
}

// Drawer 설정 (styles.ts에서 가져옴)
export const DRAWER_CONFIG = {
  screenOptions: DRAWER_SCREEN_OPTIONS,
};

/**
 * 메뉴 버튼 컴포넌트
 */
function MenuButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.menuButton}>
      <View style={styles.menuIconContainer}>
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
      </View>
    </Pressable>
  );
}

/**
 * Drawer 메뉴 버튼 (화면에 표시)
 */
export function DrawerMenuButton() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View
      style={[
        styles.menuButtonOverlay,
        {
          top: insets.top + MENU_BUTTON_POSITION.top,
          left: MENU_BUTTON_POSITION.left,
        },
      ]}>
      <MenuButton onPress={handlePress} />
    </View>
  );
}

/**
 * Drawer 컨텐츠 (사이드바 내부)
 */
export function CustomDrawerContent({ menuItems = [], ...props }: CustomDrawerContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path as any);
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item, index) => {
          const isActive =
            pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));

          return (
            <Pressable
              key={`${item.path}-${index}`}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleNavigation(item.path)}>
              {item.icon && <View style={styles.menuIcon}>{item.icon}</View>}
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

/**
 * Drawer 레이아웃 HOC
 * 페이지 컴포넌트를 감싸서 메뉴 버튼 추가
 */
export function withDrawerLayout<P extends object>(
  PageComponent: React.ComponentType<P>,
  options?: { hideMenuButton?: boolean },
) {
  return function DrawerLayoutWrapper(props: P) {
    return (
      <View style={{ flex: 1 }}>
        <PageComponent {...props} />
        {!options?.hideMenuButton && <DrawerMenuButton />}
      </View>
    );
  };
}

export default CustomDrawerContent;

