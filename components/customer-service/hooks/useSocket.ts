/**
 * components/customer-service/hooks/useSocket.ts
 * WebSocket 연결 관리 훅 (단순화 버전)
 * 
 * @description
 * - 한 유저당 채팅방 1개만 존재
 * - 불필요한 복잡도 제거
 */

import { STORAGE_KEYS } from '@/commons/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { ConnectionStatus } from '../types';

interface UseSocketOptions {
  onConnectionChange?: (status: ConnectionStatus) => void;
  onRoomIdReceived?: (roomId: string) => void;
  onError?: (message: string) => void;
}

interface UseSocketReturn {
  connectionStatus: ConnectionStatus;
  roomId: string | null;
  isRoomEntered: boolean;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  joinRoom: () => Promise<void>;
  socket: Socket | null;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;
const NAMESPACE = '/user-chat';

const getSocketUrl = (): string | null => {
  const url = Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || '';
  if (!url || url === 'your_api_url' || url.includes('your_api')) return null;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

/**
 * WebSocket 연결 관리 훅 (단순화 버전)
 * - 한 유저당 채팅방 1개만 존재
 */
export function useSocket({ onConnectionChange, onRoomIdReceived, onError }: UseSocketOptions): UseSocketReturn {
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isRoomEntered, setIsRoomEntered] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const updateConnectionStatus = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status);
    onConnectionChange?.(status);
  }, [onConnectionChange]);

  const disconnect = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current.close();
      socketRef.current = null;
    }

    updateConnectionStatus('disconnected');
    setIsRoomEntered(false);
    setRoomId(null);
    isConnectingRef.current = false;
    retryCountRef.current = 0;
  }, [updateConnectionStatus]);

  const connect = useCallback(async () => {
    if (isConnectingRef.current || connectionStatus === 'connecting') return;
    if (connectionStatus === 'connected' && socketRef.current?.connected) return;

    if (socketRef.current) disconnect();

    const socketUrl = getSocketUrl();
    if (!socketUrl) {
      updateConnectionStatus('error');
      onError?.('서버 주소가 설정되지 않았습니다.');
      return;
    }

    isConnectingRef.current = true;
    updateConnectionStatus('connecting');

    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        updateConnectionStatus('error');
        onError?.('인증 토큰이 없습니다. 다시 로그인해주세요.');
        isConnectingRef.current = false;
        return;
      }

      const socket = io(`${socketUrl}${NAMESPACE}`, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: false,
        timeout: 10000,
        forceNew: true,
        multiplex: false,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        updateConnectionStatus('connected');
        retryCountRef.current = 0;
        isConnectingRef.current = false;
      });

      socket.on('connect_error', () => {
        retryCountRef.current += 1;
        isConnectingRef.current = false;

        if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
          updateConnectionStatus('error');
          onError?.('연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
          socket.disconnect();
          socket.close();
          socketRef.current = null;
          setTimeout(() => router.replace('/(tabs)/customer-service'), 2000);
        } else {
          retryTimeoutRef.current = setTimeout(() => {
            socket.removeAllListeners();
            socket.disconnect();
            socket.close();
            socketRef.current = null;
            connect();
          }, RETRY_DELAY) as unknown as NodeJS.Timeout;
        }
      });

      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          updateConnectionStatus('error');
          socketRef.current = null;
          isConnectingRef.current = false;
        } else {
          updateConnectionStatus('disconnected');
        }
      });
    } catch (error) {
      updateConnectionStatus('error');
      onError?.('연결 중 오류가 발생했습니다.');
      isConnectingRef.current = false;
    }
  }, [connectionStatus, disconnect, onError, router, updateConnectionStatus]);

  const reconnect = useCallback(() => {
    disconnect();
    retryCountRef.current = 0;
    connect();
  }, [connect, disconnect]);

  const joinRoom = useCallback(async () => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    return new Promise<void>((resolve, reject) => {
      let isResolved = false;

      const timeoutId = setTimeout(() => {
        if (isResolved) return;
        isResolved = true;
        console.error('[joinRoom] 타임아웃 발생');
        updateConnectionStatus('error');
        onError?.('방 입장 시간이 초과되었습니다.');
        disconnect();
        setTimeout(() => router.replace('/(tabs)/customer-service'), 1000);
        reject(new Error('방 입장 시간이 초과되었습니다.'));
      }, 10000);

      console.log('[joinRoom] join_room 이벤트 전송');

      // 콜백 방식
      socket.emit('join_room', {}, (response: any) => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timeoutId);

        console.log('[joinRoom] 콜백 응답 받음:', response);

        if (response?.error) {
          updateConnectionStatus('error');
          onError?.('채팅방 생성에 실패했습니다');
          disconnect();
          setTimeout(() => {
            router.replace('/(tabs)/customer-service');
            onError?.('채팅방을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.');
          }, 1000);
          reject(new Error(response.error));
          return;
        }

        if (response?.roomId) {
          setRoomId(response.roomId);
          setIsRoomEntered(true);
          onRoomIdReceived?.(response.roomId);
          resolve();
        } else {
          reject(new Error('roomId를 받지 못했습니다.'));
        }
      });

      // 이벤트 방식 (혹시 서버가 이벤트로 응답하는 경우)
      const handleJoinRoomResponse = (response: any) => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timeoutId);

        console.log('[joinRoom] 이벤트 응답 받음:', response);

        socket.off('join_room_response', handleJoinRoomResponse);

        if (response?.roomId) {
          setRoomId(response.roomId);
          setIsRoomEntered(true);
          onRoomIdReceived?.(response.roomId);
          resolve();
        } else if (response?.error) {
          reject(new Error(response.error));
        }
      };

      socket.once('join_room_response', handleJoinRoomResponse);
    });
  }, [updateConnectionStatus, disconnect, router, onError, onRoomIdReceived]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const socket = socketRef.current;
        if (socket && !socket.connected && connectionStatus !== 'connecting') {
          reconnect();
        } else if (!socket && connectionStatus === 'disconnected') {
          connect();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [connectionStatus, connect, reconnect]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  return {
    connectionStatus,
    roomId,
    isRoomEntered,
    connect,
    disconnect,
    reconnect,
    joinRoom,
    socket: socketRef.current,
  };
}
