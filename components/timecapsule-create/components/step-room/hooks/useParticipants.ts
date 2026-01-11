/**
 * components/timecapsule-create/components/step-room/hooks/useParticipants.ts
 * 참여자 목록 관리,상태 관리, 작성 내용 저장 Hook
 */

import { MIME_TYPE_MAP } from '@/commons/constants/media';
import { STORAGE_KEYS } from '@/commons/constants/storage';
import { getUserFromToken } from '@/utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImageManipulator from 'expo-image-manipulator';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { fetchMyContent, submitMyContent } from '../../write-bottomsheet/api/content';
import { getRoomDetail } from '../api/capsule';
import { DEFAULT_EMOJI, EMPTY_SLOT_EMOJI, PARTICIPANT_STATUS } from '../constants';
import type { Participant, ParticipantContent, ParticipantStatus } from '../types';

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
const CURRENT_TEST_SCENARIO: TestScenario = 'solo'; // 'solo' | 'partial' | 'full' | 'ready'
// const CURRENT_TEST_SCENARIO: TestScenario = 'ready';

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
  /** 참여자 목록 새로고침 */
  refetchParticipants: () => Promise<void>;
}

/** useParticipants Hook 파라미터 */
interface UseParticipantsParams {
  /** 캡슐 ID (UUID) - 참여자 슬롯 정보 조회용 */
  capsuleId: string | null;
  /** 최대 참여 인원수 - 빈 슬롯 생성용 */
  maxParticipants: number;
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
 * URI가 로컬 파일인지 확인 (HTTP/HTTPS URL이 아닌지)
 * @param uri 파일 URI
 * @returns 로컬 파일이면 true, HTTP URL이면 false
 */
function isLocalFile(uri: string): boolean {
  return !uri.startsWith('http://') && !uri.startsWith('https://');
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

  /**
   * 참여자 목록 가져오기 함수
   * - capsuleId가 있으면 API 호출
   * - 없으면 대기 (로딩 상태 유지, 목데이터 사용 안 함)
   */
  const fetchParticipants = useCallback(async () => {
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

          // ⭐ has_content 필드로 작성 완료 여부 판단
          const participantStatus = slot.has_content
            ? PARTICIPANT_STATUS.COMPLETED
            : slot.status === 'ACCEPTED'
            ? PARTICIPANT_STATUS.PENDING
            : PARTICIPANT_STATUS.WAITING;

          participantsList.push({
            id: slot.user_id,
            name: slot.nickname,
            emoji: DEFAULT_EMOJI, // 기본 이모지 (추후 사용자 프로필에서 가져올 수 있음)
            status: participantStatus,
            isHost: slot.is_host,
            isMe,
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
      // ⭐ 디버깅: 배정된 참가자 상세 확인
      const assignedParticipants = participantsList.filter((p) => p.name !== '');
      console.log('🔍 [useParticipants] 배정된 참가자 상세:', {
        배정된참가자수: assignedParticipants.length,
        참가자목록: assignedParticipants.map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          isMe: p.isMe,
        })),
        전체슬롯상세: roomDetail.slots.map((slot) => ({
          slot_number: slot.slot_number,
          user_id: slot.user_id,
          nickname: slot.nickname,
          has_content: slot.has_content,
          status: slot.status,
        })),
      });

      // ⭐ 본인이 이미 작성한 경우 콘텐츠 데이터 가져오기 (has_content가 true일 때만)
      const mySlot = roomDetail.slots.find((slot) => slot.user_id === currentUserId);
      if (mySlot && mySlot.has_content) {
        try {
          console.log('🔄 [useParticipants] 본인이 작성 완료했으므로 콘텐츠 조회 중...');
          const myContent = await fetchMyContent(capsuleId);

          if (myContent && myContent.data) {
            console.log('✅ [useParticipants] 본인 콘텐츠 조회 성공!');

            // API 응답 데이터를 ParticipantContent 형식으로 변환
            const contentData: ParticipantContent = {
              text:
                typeof myContent.data.text_message === 'string'
                  ? myContent.data.text_message
                  : JSON.stringify(myContent.data.text_message),
              images: myContent.data.images?.map((img) => img.url) || [],
              voiceRecording: myContent.data.music?.url || undefined,
              video: myContent.data.video?.url || undefined,
            };

            console.log('📦 [useParticipants] 변환된 콘텐츠 데이터:', {
              text: contentData.text?.substring(0, 30) + '...',
              imagesCount: contentData.images?.length || 0,
              hasMusic: !!contentData.voiceRecording,
              hasVideo: !!contentData.video,
            });

            // 본인 참여자에 콘텐츠 데이터 저장
            participantsList.forEach((p) => {
              if (p.isMe && p.status === PARTICIPANT_STATUS.COMPLETED) {
                p.content = contentData;
                console.log('✅ [useParticipants] 본인에게 콘텐츠 데이터 저장:', p.name);
              }
            });
          }
        } catch (err: any) {
          console.error(
            '⚠️ [useParticipants] 본인 콘텐츠 조회 실패 (has_content=true인데 실패):',
            err,
          );
          // 에러가 발생해도 계속 진행 (상태는 COMPLETED 유지)
        }
      } else {
        console.log('ℹ️ [useParticipants] 본인이 아직 작성하지 않음 (has_content=false) - 정상');
      }

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
  }, [capsuleId, maxParticipants]);

  // 초기 로드 및 의존성 변경 시 호출
  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

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
   * URI에서 파일 확장자를 추출하여 MIME 타입 반환
   * MIME_TYPE_MAP을 사용하되, 매핑이 없으면 기본값 반환
   */
  const getMimeType = (uri: string, mediaType: 'image' | 'audio' | 'video'): string => {
    const extension = uri.split('.').pop()?.split('?')[0].toLowerCase() || '';
    
    const mimeType = MIME_TYPE_MAP[extension];

    if (mimeType) {
      return mimeType;
    }

    // 매핑이 없는 경우 기본값 반환 (백엔드 허용 형식)
    if (mediaType === 'image') return 'image/jpeg';
    if (mediaType === 'audio') return 'audio/m4a'; // 기본값을 m4a로 변경
    if (mediaType === 'video') return 'video/mp4';

    return 'application/octet-stream';
  };

  /**
   * URI에서 파일명 추출
   */
  const getFileName = (uri: string, defaultName: string): string => {
    const fileName = uri.split('/').pop() || defaultName;
    // 파일명에 확장자가 없으면 기본 확장자 추가
    if (!fileName.includes('.')) {
      return defaultName;
    }
    return fileName;
  };

  /**
   * 참여자 작성 내용 저장 (본인만)
   *
   * 프라이버시 보호:
   * - 본인 것만 저장 가능
   * - 저장 성공 시 상태를 'completed'로 업데이트
   *
   * ⭐ FormData 방식 사용:
   * - multipart/form-data 형식으로 파일을 직접 전송
   * - 백엔드 API 명세에 맞게 구현
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

        // text_message 필수 검증
        if (!content.text || content.text.trim().length === 0) {
          throw new Error('텍스트 메시지는 필수입니다.');
        }

        console.log('💾 [useParticipants] 작성 내용 저장 시작:', participantId);
        console.log('  📝 텍스트:', content.text?.substring(0, 30) + '...');
        console.log('  🖼️  이미지:', content.images?.length || 0, '개');
        console.log('  🎵 음악:', content.voiceRecording ? '있음' : '없음');
        console.log('  🎬 비디오:', content.video ? '있음' : '없음');
        console.log('  🆔 capsuleId:', capsuleId);

        console.log('📤 [useParticipants] FormData 생성 시작');

        // 1. ⭐ FormData 생성 및 파일 추가
        const formData = new FormData();

        // 텍스트 메시지 추가 (필수)
        formData.append('text_message', content.text.trim());

        // 이미지 파일 추가 (배열로 여러 개 추가)
        if (content.images && content.images.length > 0) {
          console.log(
            `📤 [useParticipants] 이미지 ${content.images.length}개 FormData에 추가 중...`,
          );
          for (let i = 0; i < content.images.length; i++) {
            let imageUri = content.images[i];

            // ⭐ HTTP/HTTPS URL은 이미 업로드된 파일이므로 제외
            if (!isLocalFile(imageUri)) {
              console.log(`  ⏭️  이미지 ${i + 1}: 이미 업로드된 파일이므로 건너뜀 - ${imageUri}`);
              continue;
            }

            // HEIC 파일이면 JPEG로 변환
            if (isHeicFormat(imageUri)) {
              console.log(`  🔄 이미지 ${i + 1}: HEIC → JPEG 변환 중...`);
              imageUri = await convertHeicToJpeg(imageUri);
              console.log(`  ✅ 변환 완료`);
            }

            const fileName = getFileName(imageUri, `photo_${Date.now()}_${i}.jpg`);
            const mimeType = getMimeType(imageUri, 'image');

            // ⭐ 웹과 네이티브 플랫폼 구분
            if (Platform.OS === 'web') {
              // 웹: File 객체로 변환
              const response = await fetch(imageUri);
              const blob = await response.blob();
              const file = new File([blob], fileName, { type: mimeType });
              formData.append('images', file);
              console.log(
                `✅ [useParticipants] 이미지 ${i + 1}/${
                  content.images.length
                } File 객체로 추가 완료 (${file.size} bytes)`,
              );
            } else {
              // 네이티브: React Native 형식
              formData.append('images', {
                uri: imageUri,
                type: mimeType,
                name: fileName,
              } as any);
              console.log(
                `✅ [useParticipants] 이미지 ${i + 1}/${
                  content.images.length
                } FormData에 추가 완료`,
              );
            }
          }
        }

        // 음악 파일 추가
        if (content.voiceRecording) {
          // ⭐ HTTP/HTTPS URL은 이미 업로드된 파일이므로 제외
          if (isLocalFile(content.voiceRecording)) {
            console.log('📤 [useParticipants] 음악 파일 FormData에 추가 중...');
            const fileName = getFileName(content.voiceRecording, `music_${Date.now()}.mp3`);
            const mimeType = getMimeType(content.voiceRecording, 'audio');

            // ⭐ 웹과 네이티브 플랫폼 구분
            if (Platform.OS === 'web') {
              // 웹: File 객체로 변환
              const response = await fetch(content.voiceRecording);
              const blob = await response.blob();
              const file = new File([blob], fileName, { type: mimeType });
              formData.append('music', file);
              console.log(
                `✅ [useParticipants] 음악 파일 File 객체로 추가 완료 (${file.size} bytes)`,
              );
            } else {
              // 네이티브: React Native 형식
              formData.append('music', {
                uri: content.voiceRecording,
                type: mimeType,
                name: fileName,
              } as any);
              console.log('✅ [useParticipants] 음악 파일 FormData에 추가 완료');
            }
          } else {
            console.log('  ⏭️  음악: 이미 업로드된 파일이므로 건너뜀 - ', content.voiceRecording);
          }
        }

        // 비디오 파일 추가
        if (content.video) {
          // ⭐ HTTP/HTTPS URL은 이미 업로드된 파일이므로 제외
          if (isLocalFile(content.video)) {
            console.log('📤 [useParticipants] 비디오 파일 FormData에 추가 중...');
            const fileName = getFileName(content.video, `video_${Date.now()}.mp4`);
            const mimeType = getMimeType(content.video, 'video');

            // ⭐ 웹과 네이티브 플랫폼 구분
            if (Platform.OS === 'web') {
              // 웹: File 객체로 변환
              const response = await fetch(content.video);
              const blob = await response.blob();
              const file = new File([blob], fileName, { type: mimeType });
              formData.append('video', file);
              console.log(
                `✅ [useParticipants] 비디오 파일 File 객체로 추가 완료 (${file.size} bytes)`,
              );
            } else {
              // 네이티브: React Native 형식
              formData.append('video', {
                uri: content.video,
                type: mimeType,
                name: fileName,
              } as any);
              console.log('✅ [useParticipants] 비디오 파일 FormData에 추가 완료');
            }
          } else {
            console.log('  ⏭️  비디오: 이미 업로드된 파일이므로 건너뜀 - ', content.video);
          }
        }

        console.log('📤 [useParticipants] API 제출 시작 (multipart/form-data)');

        // 2. API 호출 (⭐ multipart/form-data 전송)
        const result = await submitMyContent(capsuleId, formData);

        console.log('✅ [useParticipants] API 호출 성공!');
        console.log('  📊 응답 데이터:', JSON.stringify(result, null, 2));
        console.log('  🎯 상태:', result.data.status);
        console.log('  🖼️  이미지:', result.data.uploaded_images, '개');
        console.log('  🎵 음악:', result.data.uploaded_music ? '업로드됨' : '없음');
        console.log('  🎬 비디오:', result.data.uploaded_video ? '업로드됨' : '없음');

        // 4. ⭐ 서버에서 업로드된 콘텐츠 다시 조회 (URL 포함)
        console.log('🔄 [useParticipants] 업로드된 콘텐츠 URL 가져오기...');
        try {
          const savedContent = await fetchMyContent(capsuleId);

          if (savedContent && savedContent.data) {
            // API 응답 데이터를 ParticipantContent 형식으로 변환
            const contentData: ParticipantContent = {
              text:
                typeof savedContent.data.text_message === 'string'
                  ? savedContent.data.text_message
                  : JSON.stringify(savedContent.data.text_message),
              images: savedContent.data.images?.map((img) => img.url) || [],
              voiceRecording: savedContent.data.music?.url || undefined,
              video: savedContent.data.video?.url || undefined,
            };

            console.log('✅ [useParticipants] 서버에서 받은 URL로 콘텐츠 업데이트:', {
              imagesCount: contentData.images?.length || 0,
              hasMusic: !!contentData.voiceRecording,
              hasVideo: !!contentData.video,
            });

            // 로컬 상태 업데이트 (서버에서 받은 URL 사용)
            setParticipants((prev) =>
              prev.map((p) =>
                p.id === participantId
                  ? { ...p, content: contentData, status: PARTICIPANT_STATUS.COMPLETED }
                  : p,
              ),
            );
          } else {
            // 폴백: 로컬 데이터로 업데이트 (웹에서는 blob: URI 만료 문제 있음)
            console.warn(
              '⚠️ [useParticipants] 서버 콘텐츠 조회 실패, 로컬 데이터 사용 (웹에서 문제 발생 가능)',
            );
            setParticipants((prev) =>
              prev.map((p) =>
                p.id === participantId
                  ? { ...p, content, status: PARTICIPANT_STATUS.COMPLETED }
                  : p,
              ),
            );
          }
        } catch (fetchErr) {
          console.warn('⚠️ [useParticipants] 서버 콘텐츠 조회 실패, 로컬 데이터 사용:', fetchErr);
          // 폴백: 로컬 데이터로 업데이트
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === participantId ? { ...p, content, status: PARTICIPANT_STATUS.COMPLETED } : p,
            ),
          );
        }

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
  // 참여자 목록 새로고침
  // ============================================

  /**
   * 참여자 목록 새로고침
   * 저장 후 완료 상태를 업데이트하기 위해 사용
   */
  const refetchParticipants = useCallback(async () => {
    console.log('🔄 [useParticipants] 참여자 목록 새로고침 시작...');
    await fetchParticipants();
    console.log('✅ [useParticipants] 참여자 목록 새로고침 완료');
  }, [fetchParticipants]);

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
    refetchParticipants,
  };
}
