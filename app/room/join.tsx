/**
 * app/room/join.tsx
 * 타임캡슐 대기실 입장 (딥링크 초대 또는 내 캡슐에서 입장)
 *
 * 케이스 1: 딥링크 초대 (invite_code 파라미터)
 *   - 딥링크 형식: timeegg://room/join?invite_code=ABC123
 *   - 플로우: invite_code → fetchRoomByInviteCode() → capsule_id → StepRoom (guest)
 *
 * 케이스 2: 내 캡슐에서 입장 (capsuleId 파라미터)
 *   - URL 형식: /room/join?capsuleId=xxx-xxx-xxx
 *   - 플로우: capsuleId → StepRoom (host)
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
  const [role, setRole] = useState<'host' | 'guest'>('guest');

  // URL 파라미터 추출
  useEffect(() => {
    const directCapsuleId = Array.isArray(params.capsuleId) ? params.capsuleId[0] : params.capsuleId;
    const code = Array.isArray(params.invite_code) ? params.invite_code[0] : params.invite_code;

    // 케이스 1: 내 캡슐에서 입장 (capsuleId 직접 전달)
    if (directCapsuleId) {
      console.log('🔗 [RoomJoin] 내 캡슐에서 입장:', directCapsuleId);
      setCapsuleId(directCapsuleId);
      setRole('host');
      setIsLoading(false);
      return;
    }

    // 케이스 2: 딥링크 초대 (invite_code로 조회)
    if (code) {
      console.log('🔗 [RoomJoin] 딥링크로 입장:', code);
      setInviteCode(code);
      setRole('guest');

      // 초대 코드로 대기실 조회
      const joinRoom = async () => {
        try {
          setIsLoading(true);
          const response = await fetchRoomByInviteCode(code);

          console.log('✅ [RoomJoin] 대기실 조회 성공:', response);
          console.log('🔍 [RoomJoin] capsule_id:', response.room_id);

          setCapsuleId(response.room_id);
          setIsLoading(false);
        } catch (err) {
          console.error('❌ [RoomJoin] 대기실 조회 실패:', err);
          setError(err instanceof Error ? err.message : '대기실을 찾을 수 없습니다.');
          setIsLoading(false);
        }
      };

      joinRoom();
      return;
    }

    // 파라미터가 없는 경우
    setError('초대 코드 또는 캡슐 ID가 없습니다.');
    setIsLoading(false);
  }, [params.invite_code, params.capsuleId]);

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
  if (capsuleId) {
    return (
      <StepRoom
        role={role}
        capsuleId={capsuleId}
        inviteCode={inviteCode || undefined}
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
