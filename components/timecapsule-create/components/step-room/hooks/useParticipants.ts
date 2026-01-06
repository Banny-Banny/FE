/**
 * components/timecapsule-create/components/step-room/hooks/useParticipants.ts
 * 참여자 목록 관리,상태 관리, 작성 내용 저장 Hook
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRoomDetail } from '../api/capsule';
import { DEFAULT_EMOJI, EMPTY_SLOT_EMOJI, PARTICIPANT_STATUS } from '../constants';
import type { Participant, ParticipantContent, ParticipantStatus } from '../types';
import { getUserFromToken } from '@/utils/auth';
import { STORAGE_KEYS } from '@/commons/constants/storage';
import { submitMyContent } from '../../write-bottomsheet/api/content';

// ============================================
// 테스트 모드 설정
// ============================================

/**
 * 테스트 시나리오 타입
 *
 * - 'solo': 혼자만 입장 (기본)
 * - 'partial': 2명 입장, 1명 완료
 * - 'full': 4명 모두 입장, 일부 완료
 * - 'ready': 모두 작성 완료 (제출 가능 상태)
 */
export type TestScenario = 'solo' | 'partial' | 'full' | 'ready';

/**
 * 현재 테스트 시나리오 설정
 * ⚠️ 이 값을 변경하면 대기실 상태가 즉시 바뀝니다!
 */

// 테스트용 ⬇️
// const CURRENT_TEST_SCENARIO: TestScenario = 'solo';  // 'solo' | 'partial' | 'full' | 'ready'
const CURRENT_TEST_SCENARIO: TestScenario = 'ready';

// ============================================
// 목데이터 생성 함수 (테스트용)
// ============================================

/**
 * 테스트 시나리오별 참여자 목록 생성
 *
 * @param {TestScenario} scenario 테스트 시나리오
 * @returns {Participant[]} 참여자 목록
 */
function createTestParticipants(scenario: TestScenario): Participant[] {
  const baseParticipants: Record<TestScenario, Participant[]> = {
    // 시나리오 1: 혼자만 입장 (기본)
    solo: [
      {
        id: 'user-001',
        name: '나 (존잘최홍식)',
        emoji: DEFAULT_EMOJI,
        status: PARTICIPANT_STATUS.PENDING,
        isMe: true,
        isHost: true,
        joinedAt: '2025-12-29T10:00:00Z',
      },
      {
        id: 'slot-002',
        name: '',
        emoji: EMPTY_SLOT_EMOJI,
        status: PARTICIPANT_STATUS.WAITING,
      },
      {
        id: 'slot-003',
        name: '',
        emoji: EMPTY_SLOT_EMOJI,
        status: PARTICIPANT_STATUS.WAITING,
      },
      {
        id: 'slot-004',
        name: '',
        emoji: EMPTY_SLOT_EMOJI,
        status: PARTICIPANT_STATUS.WAITING,
      },
    ],

    // 시나리오 2: 2명 입장, 둘 다 미완료
    partial: [
      {
        id: 'user-001',
        name: '나 (존잘최홍식)',
        emoji: DEFAULT_EMOJI,
        status: PARTICIPANT_STATUS.PENDING,
        isMe: true,
        isHost: true,
        joinedAt: '2025-12-29T10:00:00Z',
      },
      {
        id: 'user-002',
        name: '친구1 (김철수)',
        emoji: '🐣',
        status: PARTICIPANT_STATUS.PENDING,
        isMe: false, // 다른 사람 (클릭 차단)
        isHost: false,
        joinedAt: '2025-12-29T10:30:00Z',
      },
      {
        id: 'slot-003',
        name: '',
        emoji: EMPTY_SLOT_EMOJI,
        status: PARTICIPANT_STATUS.WAITING,
      },
      {
        id: 'slot-004',
        name: '',
        emoji: EMPTY_SLOT_EMOJI,
        status: PARTICIPANT_STATUS.WAITING,
      },
    ],

    // 시나리오 3: 4명 모두 입장, 2명 완료
    full: [
      {
        id: 'user-001',
        name: '나 (존잘최홍식)',
        emoji: DEFAULT_EMOJI,
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: true,
        isHost: true,
        joinedAt: '2025-12-29T10:00:00Z',
        content: {
          text: '내가 작성한 내용입니다!',
          images: [],
        },
      },
      {
        id: 'user-002',
        name: '친구1 (김철수)',
        emoji: '🐣',
        status: PARTICIPANT_STATUS.PENDING,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T10:30:00Z',
      },
      {
        id: 'user-003',
        name: '친구2 (박영희)',
        emoji: '🐥',
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T11:00:00Z',
        content: {
          text: '다른 사람이 작성한 내용 (볼 수 없음)',
        },
      },
      {
        id: 'user-004',
        name: '친구3 (이민수)',
        emoji: '🐤',
        status: PARTICIPANT_STATUS.WAITING,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T11:30:00Z',
      },
    ],

    // 시나리오 4: 모두 작성 완료 (제출 가능 상태)
    ready: [
      {
        id: 'user-001',
        name: '나 (존잘최홍식)',
        emoji: DEFAULT_EMOJI,
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: true,
        isHost: true,
        joinedAt: '2025-12-29T10:00:00Z',
        content: {
          text: '내가 작성한 내용입니다!',
          images: [],
        },
      },
      {
        id: 'user-002',
        name: '친구1 (김철수)',
        emoji: '🐣',
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T10:30:00Z',
      },
      {
        id: 'user-003',
        name: '친구2 (박영희)',
        emoji: '🐥',
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T11:00:00Z',
      },
      {
        id: 'user-004',
        name: '친구3 (이민수)',
        emoji: '🐤',
        status: PARTICIPANT_STATUS.COMPLETED,
        isMe: false,
        isHost: false,
        joinedAt: '2025-12-29T11:30:00Z',
      },
    ],
  };

  return baseParticipants[scenario];
}

/**
 * 목데이터: 참여자 목록
 * ⚠️ 추후 백엔드 API로 교체될 예정
 */
const mockParticipants: Participant[] = createTestParticipants(CURRENT_TEST_SCENARIO);

// ============================================
// 타입 정의
// ============================================

/** useParticipants Hook 반환 타입 */
interface UseParticipantsReturn {
  /** 참여자 목록 */
  participants: Participant[];
  /** 본인 참여자 정보 */
  myParticipant: Participant | undefined;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 */
  error: Error | null;
  /** 참여자 상태 업데이트 (pending → completed) */
  updateStatus: (participantId: string, status: ParticipantStatus) => void;
  /** 참여자 작성 내용 저장 (본인만) */
  saveContent: (participantId: string, content: ParticipantContent) => Promise<void>;
  /** 편집 가능 여부 확인 (본인만) */
  canEdit: (participantId: string) => boolean;
}

/** useParticipants Hook 파라미터 */
interface UseParticipantsParams {
  /** 캡슐 ID (UUID) - 참여자 슬롯 정보 조회용 */
  capsuleId: string | null;
  /** 최대 참여 인원수 - 빈 슬롯 생성용 */
  maxParticipants: number;
}

/**
 * 파일 확장자에서 MIME 타입 추론
 */
function getMimeTypeFromUri(uri: string): string {
  const extension = uri.split('.').pop()?.toLowerCase() || '';
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    heic: 'image/jpeg', // HEIC는 JPEG로 변환되므로 JPEG MIME 타입 사용
    heif: 'image/jpeg', // HEIF도 JPEG로 변환되므로 JPEG MIME 타입 사용
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    wav: 'audio/wav',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    m4v: 'video/mp4',
  };
  return mimeMap[extension] || 'application/octet-stream';
}

/**
 * HEIC/HEIF 파일을 JPEG로 변환
 * 서버가 HEIC를 지원하지 않으므로 JPEG로 변환 필요
 */
async function convertHeicToJpeg(uri: string): Promise<string> {
  // 웹 환경에서는 변환 불가 (원본 반환)
  if (Platform.OS === 'web') {
    return uri;
  }

  try {
    // expo-image-manipulator를 사용하여 HEIC를 JPEG로 변환
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [], // 변환만 수행 (리사이즈 없음)
      {
        compress: 0.9, // 높은 품질 유지
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );
    return result.uri;
  } catch (error) {
    console.error('HEIC 변환 실패:', error);
    // 변환 실패 시 원본 반환 (에러 발생 가능하지만 시도)
    return uri;
  }
}

/**
 * 이미지 URI가 HEIC/HEIF 형식인지 확인
 */
function isHeicFormat(uri: string): boolean {
  const extension = uri.split('.').pop()?.toLowerCase() || '';
  return extension === 'heic' || extension === 'heif';
}

/**
 * ParticipantContent를 FormData로 변환하는 헬퍼 함수
 * React Native에서는 File 생성자를 사용할 수 없으므로 { uri, type, name } 형식 사용
 */
async function contentToFormData(content: ParticipantContent): Promise<FormData> {
  const formData = new FormData();

  // text_message 추가 (필수!)
  formData.append('text_message', content.text || '');

  // 이미지 파일 추가
  if (content.images && content.images.length > 0) {
    for (const imageUri of content.images) {
      try {
        let finalUri = imageUri;
        let fileName = imageUri.split('/').pop() || `photo_${Date.now()}.jpg`;
        
        // HEIC/HEIF 파일인 경우 JPEG로 변환
        if (isHeicFormat(imageUri)) {
          console.log('  🔄 HEIC 파일 감지, JPEG로 변환 중...');
          finalUri = await convertHeicToJpeg(imageUri);
          // 파일명 확장자 변경
          fileName = fileName.replace(/\.(heic|heif)$/i, '.jpg');
          console.log('  ✅ HEIC → JPEG 변환 완료:', fileName);
        }
        
        const mimeType = getMimeTypeFromUri(finalUri);
        
        // React Native FormData 형식: { uri, type, name }
        formData.append('images', {
          uri: finalUri,
          type: mimeType,
          name: fileName,
        } as any);
        console.log('  ✅ 이미지 추가:', fileName, `(${mimeType})`);
      } catch (error) {
        console.error('  ❌ 이미지 추가 실패:', imageUri, error);
      }
    }
  }

  // 음악 파일 추가
  if (content.voiceRecording) {
    try {
      const fileName = content.voiceRecording.split('/').pop() || `music_${Date.now()}.mp3`;
      const mimeType = getMimeTypeFromUri(content.voiceRecording);
      
      // React Native FormData 형식: { uri, type, name }
      formData.append('music', {
        uri: content.voiceRecording,
        type: mimeType,
        name: fileName,
      } as any);
      console.log('  ✅ 음악 추가:', fileName, `(${mimeType})`);
    } catch (error) {
      console.error('  ❌ 음악 추가 실패:', content.voiceRecording, error);
    }
  }

  // 비디오 파일 추가
  if (content.video) {
    try {
      const fileName = content.video.split('/').pop() || `video_${Date.now()}.mp4`;
      const mimeType = getMimeTypeFromUri(content.video);
      
      // React Native FormData 형식: { uri, type, name }
      formData.append('video', {
        uri: content.video,
        type: mimeType,
        name: fileName,
      } as any);
      console.log('  ✅ 비디오 추가:', fileName, `(${mimeType})`);
    } catch (error) {
      console.error('  ❌ 비디오 추가 실패:', content.video, error);
    }
  }

  return formData;
}

// ============================================
// Hook
// ============================================

/**
 * 참여자 목록 관리 Hook
 *
 * 기능:
 * 1. fetchParticipants(): 참여자 목록 가져오기 (API 또는 목데이터)
 * 2. updateParticipantStatus(): 참여자 상태 업데이트 (pending → completed)
 * 3. saveParticipantContent(): 참여자 작성 내용 저장 (본인만)
 * 4. canEditParticipant(): 편집 가능 여부 확인 (본인만)
 *
 * @param {UseParticipantsParams} params Hook 파라미터
 * @returns {UseParticipantsReturn} Hook 반환값
 */
export function useParticipants({
  capsuleId,
  maxParticipants,
}: UseParticipantsParams): UseParticipantsReturn {
  // ============================================
  // 상태 관리
  // ============================================

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // ============================================
  // 데이터 가져오기 (목데이터)
  // ============================================

  useEffect(() => {
    /**
     * 참여자 목록 가져오기
     * - capsuleId가 있으면 API 호출
     * - 없으면 대기 (로딩 상태 유지, 목데이터 사용 안 함)
     */
    async function fetchParticipants() {
      // capsuleId가 없으면 아무것도 하지 않음 (로딩 상태 유지)
      if (!capsuleId) {
        // capsuleId가 설정될 때까지 대기 (다음 useEffect 실행에서 처리됨)
        return;
      }

      setIsLoading(true);
      setError(null);

      try {

        // ⭐ API 호출: 대기실 상세 조회
        console.log('🔄 [useParticipants] 참여자 슬롯 정보 조회 시작 - capsuleId:', capsuleId);
        const roomDetail = await getRoomDetail(capsuleId);

          // 현재 사용자 ID 가져오기 (본인 여부 판단용)
          const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          const currentUser = token ? getUserFromToken(token) : null;
          const currentUserId = currentUser?.id || null;

          // slots[] 배열을 Participant[] 형식으로 변환
          // ⭐ 수정: roomDetail.slots에는 이미 모든 슬롯(빈 슬롯 포함)이 있으므로 그대로 사용
          const participantsList: Participant[] = [];

          // 모든 슬롯 변환 (배정된 슬롯 + 빈 슬롯 모두 포함)
          for (const slot of roomDetail.slots) {
            if (slot.user_id && slot.nickname) {
              // 배정된 슬롯
              const isMe = slot.user_id === currentUserId;
              participantsList.push({
                id: slot.user_id,
                name: slot.nickname,
                emoji: DEFAULT_EMOJI, // 기본 이모지 (추후 사용자 프로필에서 가져올 수 있음)
                status:
                  slot.status === 'ACCEPTED'
                    ? PARTICIPANT_STATUS.PENDING
                    : PARTICIPANT_STATUS.WAITING,
                isHost: slot.is_host,
                isMe,
                // 작성 완료 여부는 별도 API로 확인 필요 (현재는 PENDING으로 설정)
                // 추후 콘텐츠 저장 API 응답에서 COMPLETED 상태로 업데이트
              });
            } else {
              // 빈 슬롯 (user_id가 null인 경우)
              participantsList.push({
                id: `slot-${slot.slot_number}`,
                name: '',
                emoji: EMPTY_SLOT_EMOJI,
                status: PARTICIPANT_STATUS.WAITING,
              });
            }
          }

          // ⭐ 디버깅: 슬롯 계산 확인
          console.log(
            '🔍 [useParticipants] 슬롯 계산:',
            `roomDetail.slots.length=${roomDetail.slots.length}`,
            `participantsList.length=${participantsList.length}`,
            `maxParticipants=${maxParticipants}`,
          );

        setParticipants(participantsList);
        console.log('✅ [useParticipants] 참여자 슬롯 정보 조회 성공:', participantsList);
      } catch (err) {
        console.warn('⚠️ [useParticipants] API 호출 실패, 목데이터 사용:', err);
        setError(err instanceof Error ? err : new Error('API 호출 실패'));
        // 목데이터로 폴백
        setParticipants(mockParticipants);
      } finally {
        setIsLoading(false);
      }
    }

    fetchParticipants();
  }, [capsuleId, maxParticipants]);

  // ============================================
  // 본인 참여자 정보
  // ============================================

  /**
   * 본인 참여자 정보 찾기
   */
  const myParticipant = useMemo(() => {
    return participants.find((p) => p.isMe);
  }, [participants]);

  // ============================================
  // 참여자 상태 업데이트
  // ============================================

  /**
   * 참여자 상태 업데이트
   *
   * @param {string} participantId 참여자 ID
   * @param {ParticipantStatus} status 새로운 상태
   */
  const updateStatus = useCallback((participantId: string, status: ParticipantStatus) => {
    setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, status } : p)));

    // TODO: API 연동
    // await fetch(`/api/room/${capsuleId}/participants/${participantId}/status`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ status }),
    // });
  }, []);

  // ============================================
  // 참여자 작성 내용 저장
  // ============================================

  /**
   * 참여자 작성 내용 저장 (본인만)
   *
   * 프라이버시 보호:
   * - 본인 것만 저장 가능
   * - 저장 성공 시 상태를 'completed'로 업데이트
   *
   * @param {string} participantId 참여자 ID
   * @param {ParticipantContent} content 작성 내용
   */
  const saveContent = useCallback(
    async (participantId: string, content: ParticipantContent) => {
      try {
        // 본인 것만 저장 가능 (프라이버시 보호)
        const participant = participants.find((p) => p.id === participantId);
        if (!participant?.isMe) {
          throw new Error('본인의 작성 내용만 저장할 수 있습니다.');
        }

        // capsuleId가 없으면 에러
        if (!capsuleId) {
          throw new Error('캡슐 ID가 없습니다.');
        }

        console.log('💾 [useParticipants] 작성 내용 저장 시작:', participantId);
        console.log('  📝 텍스트:', content.text?.substring(0, 30) + '...');
        console.log('  🖼️  이미지:', content.images?.length || 0, '개');
        console.log('  🎵 음악:', content.voiceRecording ? '있음' : '없음');
        console.log('  🎬 비디오:', content.video ? '있음' : '없음');
        console.log('  🆔 capsuleId:', capsuleId);

        // 1. FormData 생성
        console.log('📦 [useParticipants] FormData 생성 시작...');
        const formData = await contentToFormData(content);
        console.log('✅ [useParticipants] FormData 생성 완료');

        // 2. 실제 API 호출
        console.log('📤 [useParticipants] API 호출 시작...');
        const result = await submitMyContent(capsuleId, formData);
        console.log('✅ [useParticipants] API 호출 성공!');
        console.log('  📊 응답 데이터:', JSON.stringify(result, null, 2));
        console.log('  🎯 상태:', result.data.status);
        console.log('  🖼️  이미지:', result.data.uploaded_images, '개');
        console.log('  🎵 음악:', result.data.uploaded_music ? '업로드됨' : '없음');
        console.log('  🎬 비디오:', result.data.uploaded_video ? '업로드됨' : '없음');

        // 3. 로컬 상태 업데이트 (작성 내용 저장 및 상태를 'completed'로 업데이트)
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === participantId ? { ...p, content, status: PARTICIPANT_STATUS.COMPLETED } : p,
          ),
        );

        console.log('✅ [useParticipants] 작성 내용 저장 성공!');
      } catch (err) {
        console.error('❌ [useParticipants] 작성 내용 저장 실패:', err);
        throw err;
      }
    },
    [participants, capsuleId],
  );

  // ============================================
  // 편집 가능 여부 확인
  // ============================================

  /**
   * 편집 가능 여부 확인 (본인만)
   *
   * 프라이버시 보호:
   * - 본인 것만 편집 가능
   * - 다른 사람 것은 편집 불가
   *
   * @param {string} participantId 참여자 ID
   * @returns {boolean} 편집 가능 여부
   */
  const canEdit = useCallback(
    (participantId: string): boolean => {
      const participant = participants.find((p) => p.id === participantId);
      return participant?.isMe === true;
    },
    [participants],
  );

  // ============================================
  // 반환
  // ============================================

  return {
    participants,
    myParticipant,
    isLoading,
    error,
    updateStatus,
    saveContent,
    canEdit,
  };
}
