/**
 * components/customer-service/hooks/useSocket.ts
 * WebSocket 연결 관리 훅 (실제 Socket.IO)
 * 
 * @description
 * - Phase 5: 실제 Socket.IO 클라이언트를 사용한 WebSocket 연결 관리
 * - 연결 실패, 재연결, 여러 기기 접속 등의 Edge Case 처리
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { ConnectionStatus } from '../types';
import { STORAGE_KEYS } from '@/commons/constants';

interface UseSocketOptions {
  inquiryId?: string; // 선택사항: 없으면 서버가 자동으로 새 문의 생성
  onConnectionChange?: (status: ConnectionStatus) => void;
  onRoomIdReceived?: (roomId: string) => void;
  onInquiryIdReceived?: (inquiryId: string) => void; // 새 문의 생성 시 inquiryId 콜백
  onError?: (message: string) => void; // 에러 메시지 콜백
}

interface UseSocketReturn {
  connectionStatus: ConnectionStatus;
  roomId: string | null;
  isRoomEntered: boolean;
  isActiveDevice: boolean; // 여러 기기 동시 접속 시 활성 기기 여부
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  joinRoom: () => Promise<void>;
  socket: Socket | null; // Socket 인스턴스 (메시지 송수신에 사용)
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1초
const NAMESPACE = '/user-chat';

/**
 * Socket.IO 서버 URL 가져오기
 */
const getSocketUrl = (): string | null => {
  const url = Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || '';
  
  if (!url || url === 'your_api_url' || url.includes('your_api')) {
    return null;
  }
  
  // 끝의 슬래시 제거
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

/**
 * WebSocket 연결 관리 훅 (실제 Socket.IO)
 * 
 * @param options - 옵션 객체
 * @param options.inquiryId - 문의 ID
 * @param options.onConnectionChange - 연결 상태 변경 콜백
 * @param options.onRoomIdReceived - roomId 수신 콜백
 * @param options.onError - 에러 메시지 콜백
 * @returns WebSocket 연결 상태 및 제어 함수들
 */
export function useSocket({ inquiryId, onConnectionChange, onRoomIdReceived, onInquiryIdReceived, onError }: UseSocketOptions): UseSocketReturn {
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isRoomEntered, setIsRoomEntered] = useState(false);
  const [isActiveDevice, setIsActiveDevice] = useState(true); // 기본적으로 활성 기기
  
  const socketRef = useRef<Socket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  /**
   * 연결 상태 변경 및 콜백 호출
   */
  const updateConnectionStatus = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status);
    onConnectionChange?.(status);
  }, [onConnectionChange]);

  /**
   * WebSocket 연결 시도 (실제 Socket.IO)
   * EC-001: 연결 실패 처리 및 자동 재시도
   */
  const connect = useCallback(async () => {
    if (connectionStatus === 'connected' || connectionStatus === 'connecting' || isConnectingRef.current) {
      return;
    }

    const socketUrl = getSocketUrl();
    if (!socketUrl) {
      updateConnectionStatus('error');
      onError?.('서버 주소가 설정되지 않았습니다.');
      return;
    }

    isConnectingRef.current = true;
    updateConnectionStatus('connecting');
    retryCountRef.current = 0;

    try {
      // AsyncStorage에서 토큰 가져오기
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        updateConnectionStatus('error');
        onError?.('인증 토큰이 없습니다. 다시 로그인해주세요.');
        isConnectingRef.current = false;
        return;
      }

      // Socket.IO 클라이언트 생성
      const socket = io(`${socketUrl}${NAMESPACE}`, {
        auth: {
          token: token, // T110: 인증 토큰 전달
        },
        transports: ['websocket', 'polling'], // WebSocket 우선, 폴백으로 polling
        reconnection: false, // 수동 재연결 관리
        timeout: 10000,
      });

      socketRef.current = socket;

      // 연결 성공 이벤트
      socket.on('connect', () => {
        console.log('Socket.IO 연결 성공');
        updateConnectionStatus('connected');
        retryCountRef.current = 0;
        isConnectingRef.current = false;
      });

      // 연결 실패 이벤트
      socket.on('connect_error', (error) => {
        console.error('Socket.IO 연결 실패:', error);
        retryCountRef.current += 1;

        if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
          // 최대 재시도 횟수 초과
          updateConnectionStatus('error');
          onError?.('연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
          socket.disconnect();
          socketRef.current = null;
          isConnectingRef.current = false;
          
          // 문의 목록 페이지로 이동
          setTimeout(() => {
            router.replace('/(tabs)/customer-service');
          }, 2000);
        } else {
          // 재시도
          retryTimeoutRef.current = setTimeout(() => {
            socket.disconnect();
            connect();
          }, RETRY_DELAY);
        }
      });

      // 연결 해제 이벤트
      socket.on('disconnect', (reason) => {
        console.log('Socket.IO 연결 해제:', reason);
        if (reason === 'io server disconnect') {
          // 서버가 연결을 끊은 경우 (인증 실패 등)
          updateConnectionStatus('error');
          socketRef.current = null;
          isConnectingRef.current = false;
        } else {
          // 클라이언트가 연결을 끊은 경우 또는 네트워크 오류
          updateConnectionStatus('disconnected');
        }
      });

      // 여러 기기 동시 접속 처리 (EC-003)
      socket.on('device_deactivated', () => {
        console.log('다른 기기에서 접속하여 이 기기는 비활성화됨');
        setIsActiveDevice(false);
        updateConnectionStatus('disconnected');
      });

      socket.on('device_activated', () => {
        console.log('이 기기가 활성화됨');
        setIsActiveDevice(true);
        if (socket.connected) {
          updateConnectionStatus('connected');
        }
      });

    } catch (error) {
      console.error('Socket.IO 연결 중 오류:', error);
      updateConnectionStatus('error');
      onError?.('연결 중 오류가 발생했습니다.');
      isConnectingRef.current = false;
    }
  }, [connectionStatus, updateConnectionStatus, router, onError]);

  /**
   * WebSocket 연결 해제
   */
  const disconnect = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    updateConnectionStatus('disconnected');
    setIsRoomEntered(false);
    setRoomId(null);
    isConnectingRef.current = false;
  }, [updateConnectionStatus]);

  /**
   * 재연결 시도
   */
  const reconnect = useCallback(() => {
    disconnect();
    retryCountRef.current = 0;
    connect();
  }, [connect, disconnect]);

  /**
   * 방 입장 (join_room 이벤트)
   * EC-005: roomId 생성 실패 처리
   */
  const joinRoom = useCallback(async () => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      throw new Error('WebSocket이 연결되지 않았습니다.');
    }

    return new Promise<void>((resolve, reject) => {
      let isResolved = false;
      
      // 타임아웃 처리 (10초)
      const timeoutId = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          updateConnectionStatus('error');
          onError?.('방 입장 시간이 초과되었습니다.');
          disconnect();
          setTimeout(() => {
            router.replace('/(tabs)/customer-service');
          }, 1000);
          reject(new Error('방 입장 시간이 초과되었습니다.'));
        }
      }, 10000);

      // join_room 이벤트 전송 (inquiryId 없으면 서버가 자동으로 새 문의 생성/조회)
      socket.emit('join_room', inquiryId ? { inquiryId } : {}, (response: { roomId?: string; inquiryId?: string; error?: string }) => {
        if (isResolved) {
          return; // 이미 타임아웃으로 reject된 경우 무시
        }

        clearTimeout(timeoutId);
        isResolved = true;

        if (response.error) {
          // roomId 생성 실패
          updateConnectionStatus('error');
          onError?.('채팅방 생성에 실패했습니다');
          
          // WebSocket 연결 차단
          disconnect();
          
          // 문의 목록 페이지로 이동 및 토스트 메시지
          setTimeout(() => {
            router.replace('/(tabs)/customer-service');
            onError?.('채팅방을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.');
          }, 1000);
          
          reject(new Error(response.error));
          return;
        }

        if (response.roomId) {
          // roomId 수신 성공
          setRoomId(response.roomId);
          setIsRoomEntered(true);
          onRoomIdReceived?.(response.roomId);
          
          // 새 문의 생성 시 inquiryId도 함께 받음
          if (response.inquiryId) {
            onInquiryIdReceived?.(response.inquiryId);
          }
          
          resolve();
        } else {
          reject(new Error('roomId를 받지 못했습니다.'));
        }
      });
    });
  }, [inquiryId, isRoomEntered, updateConnectionStatus, disconnect, router, onError, onRoomIdReceived]);

  /**
   * 컴포넌트 마운트 시 자동 연결
   */
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    connectionStatus,
    roomId,
    isRoomEntered,
    isActiveDevice,
    connect,
    disconnect,
    reconnect,
    joinRoom,
    socket: socketRef.current, // Socket 인스턴스 반환
  };
}
