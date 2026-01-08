/**
 * app/room/join.tsx
 * 딥링크로 타임캡슐 대기실 참여하기
 *
 * 딥링크 형식: timeegg://room/join?invite_code=ABC123
 *
 * 플로우:
 * 1. URL 파라미터에서 invite_code 추출
 * 2. fetchRoomByInviteCode() API 호출 → room_id(=capsule_id) 받음
 * 3. joinRoom() API 호출 → 슬롯 배정 (참여자로 등록)
 * 4. StepRoom 컴포넌트 렌더링 (role='guest', capsuleId, inviteCode 전달)
 */

import { TimeCapsuleHeader } from '@/commons/components/timecapsule-header';
import { Colors, ROUTES, STORAGE_KEYS } from '@/commons/constants';
import { useAuth } from '@/commons/layout/provider/auth/auth.provider';
import { useNavigation } from '@/commons/hooks';
import { fetchRoomByInviteCode, joinRoom } from '@/components/timecapsule-create/components/step-room/api/capsule';
import StepRoom from '@/components/timecapsule-create/components/step-room';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';

export default function RoomJoinScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capsuleId, setCapsuleId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  // URL 파라미터에서 invite_code 추출 및 토큰 확인
  useEffect(() => {
    // 인증 상태 로딩 중이면 대기
    if (isAuthLoading) {
      return;
    }

    const code = Array.isArray(params.invite_code) ? params.invite_code[0] : params.invite_code;

    if (!code) {
      setError('초대 코드가 없습니다.');
      setIsLoading(false);
      return;
    }

    console.log('🔗 [RoomJoin] 딥링크로 입장:', code);
    setInviteCode(code);

    // 토큰 확인
    if (!accessToken) {
      // 토큰 없음 → 초대 코드 저장 후 온보딩으로 이동
      const saveInviteCodeAndRedirect = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEYS.PENDING_INVITE_CODE, code);
          if (__DEV__) {
            console.log('[RoomJoin] 토큰 없음 → 초대 코드 저장 후 온보딩으로 이동:', code);
          }
          router.replace(ROUTES.AUTH_ONBOARDING as any);
        } catch (err) {
          console.error('[RoomJoin] 초대 코드 저장 실패:', err);
          setError('초대 코드를 저장하는 중 오류가 발생했습니다.');
          setIsLoading(false);
        }
      };
      saveInviteCodeAndRedirect();
      return;
    }

    // 토큰 있음 → 대기실 조회 및 참여
    const joinRoomFlow = async () => {
      try {
        setIsLoading(true);

        // 1단계: 초대 코드로 대기실 조회
        const response = await fetchRoomByInviteCode(code);
        console.log('✅ [RoomJoin] 대기실 조회 성공:', response);
        console.log('🔍 [RoomJoin] capsule_id:', response.room_id);

        // 2단계: 슬롯 배정 (참여자로 등록)
        try {
          const joinResponse = await joinRoom(response.room_id, code);
          console.log('✅ [RoomJoin] 슬롯 배정 성공:', joinResponse);
          console.log('  🎫 슬롯 번호:', joinResponse.slot_number);
          console.log('  👤 닉네임:', joinResponse.nickname);
        } catch (joinErr) {
          // 409 (이미 참여 중)는 정상 케이스로 처리
          if (joinErr instanceof Error && joinErr.message.includes('이미 참여 중')) {
            console.log('ℹ️ [RoomJoin] 이미 참여 중입니다. 계속 진행합니다.');
          } else {
            throw joinErr;
          }
        }

        setCapsuleId(response.room_id);
        setIsLoading(false);
      } catch (err) {
        console.error('❌ [RoomJoin] 대기실 참여 실패:', err);
        setError(err instanceof Error ? err.message : '대기실을 찾을 수 없습니다.');
        setIsLoading(false);
      }
    };

    joinRoomFlow();
  }, [params.invite_code, accessToken, isAuthLoading, router]);

  // 로딩 중
  if (isLoading) {
    return (
      <View style={styles.container}>
        <TimeCapsuleHeader title="대기실 참여 중..." onBack={() => navigation.back()} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.blue[500]} />
          <Text style={styles.loadingText}>대기실 정보를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <View style={styles.container}>
        <TimeCapsuleHeader title="참여 실패" onBack={() => navigation.back()} />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorDescription}>초대 링크가 올바른지 확인해주세요.</Text>
        </View>
      </View>
    );
  }

  // 대기실 입장 성공 - StepRoom 렌더링
  if (capsuleId && inviteCode) {
    return (
      <StepRoom
        role="guest"
        capsuleId={capsuleId}
        inviteCode={inviteCode}
        onSubmit={() => {
          console.log('✅ [RoomJoin] 타임캡슐 제출 완료!');
          router.replace('/(tabs)/'); // 메인으로 이동
        }}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey[50],
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.grey[600],
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.red[600],
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
    color: Colors.grey[500],
    textAlign: 'center',
  },
});
