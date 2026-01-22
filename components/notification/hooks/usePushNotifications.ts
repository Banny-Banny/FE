/**
 * Push Notifications Hook
 * Version: 1.0.0
 * Created: 2025-01-XX
 *
 * [Business Logic] 푸시 알림 초기화 및 토큰 관리
 * - 푸시 알림 권한 요청
 * - Expo Push Token 등록
 * - 알림 수신 리스너 설정
 * - 알림 탭 시 화면 이동 처리
 */

import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { API_ENDPOINTS, ROUTES } from '@/commons/constants';
import { apiClient } from '@/utils/apiClient';
import { notificationEvents } from '../utils/notificationEvents';

/**
 * 알림 핸들러 설정
 * - 앱이 포그라운드에 있을 때도 알림 표시
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * 푸시 알림을 초기화하고 관리하는 Hook
 *
 * @description
 * - 앱 시작 시 푸시 알림 권한 요청
 * - Expo Push Token을 백엔드에 등록
 * - 알림 수신 시 알림 목록 새로고침
 * - 알림 탭 시 타입에 따라 화면 이동
 */
export function usePushNotifications() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // 푸시 알림 초기화
    registerForPushNotificationsAsync();

    // 앱 상태 변경 감지 (포그라운드로 돌아올 때 알림 목록 새로고침)
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // 앱이 포그라운드로 돌아올 때 알림 목록 새로고침 이벤트 발생
        // useNotifications 훅에서 이 이벤트를 구독하여 자동으로 새로고침
        notificationEvents.emit();
        if (__DEV__) {
        }
      }
      appState.current = nextAppState;
    });

    // 알림 수신 리스너 (앱이 포그라운드에 있을 때)
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        if (__DEV__) {
        }
        // 푸시 알림 수신 시 즉시 알림 목록 새로고침 이벤트 발생
        // useNotifications 훅에서 이 이벤트를 구독하여 자동으로 새로고침
        notificationEvents.emit();
      },
    );

    // 알림 탭 리스너 (사용자가 알림을 탭했을 때)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        const notificationType = data?.type as string;

        if (__DEV__) {
        }

        // 알림 탭 시 즉시 알림 목록 새로고침 이벤트 발생
        // 백그라운드에서 알림을 받고 탭한 경우에도 최신 알림 목록을 가져오기 위함
        notificationEvents.emit();

        // 알림 타입에 따라 화면 이동
        if (notificationType === 'FRIEND_INVITE' || notificationType === 'FRIEND_ACCEPTED') {
          // 친구 관련 알림 → 마이페이지로 이동
          router.push('/(tabs)/mypage');
        } else if (notificationType === 'CAPSULE_OPEN') {
          // 캡슐 열림 알림 → 홈(지도)으로 이동
          router.push(ROUTES.HOME);
        } else if (notificationType === 'EASTER_EGG_VIEWED') {
          // 이스터에그 발견 알림 → 홈(지도)으로 이동
          router.push(ROUTES.HOME);
        } else {
          // 기본: 알림 화면으로 이동
          router.push(ROUTES.ALARM);
        }
      },
    );

    // 앱 시작 시 마지막 알림 확인 (앱이 종료된 상태에서 알림을 받은 경우)
    // 앱이 백그라운드나 종료 상태에서 알림을 받았을 때, 앱을 다시 열면 마지막 알림을 확인하여 새로고침
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) {
          // 마지막 알림이 있으면 알림 목록 새로고침
          notificationEvents.emit();
        }
      })
      .catch(() => {
        // 에러는 무시 (앱 시작 시 실패해도 치명적이지 않음)
      });

    return () => {
      subscription.remove();
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return null;
}

/**
 * 푸시 알림 권한 요청 및 토큰 등록
 */
async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  try {
    // Android 알림 채널 설정
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: '기본 알림',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });
    }

    // 현재 권한 상태 확인
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 권한이 없으면 요청
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // 권한이 거부된 경우
    if (finalStatus !== 'granted') {
      if (__DEV__) {
      }
      return null;
    }

    // Expo Push Token 가져오기
    // projectId는 EAS Build에서 자동으로 설정되거나, expo-constants에서 가져올 수 있음
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.expoConfig?.extra?.projectId ||
      undefined;

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });
    token = tokenData.data;

    if (__DEV__) {
    }

    // 백엔드에 토큰 등록
    try {
      const endpoint = `/${API_ENDPOINTS.AUTH.PUSH_TOKEN}`;
      await apiClient.post(endpoint, { token });

      if (__DEV__) {
      }
    } catch (error: any) {
      // 토큰 등록 실패는 치명적이지 않으므로 로깅만
      if (__DEV__) {
      }
    }
  } catch (error: any) {
  }

  return token;
}

