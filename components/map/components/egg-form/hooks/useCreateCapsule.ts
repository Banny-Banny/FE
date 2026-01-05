/**
 * components/map/components/egg-form/hooks/useCreateCapsule.ts
 * 캡슐 생성 API 호출 Hook
 */

import { API_ENDPOINTS } from '@/commons/constants/endpoints';
import { MediaType } from '@/commons/constants/media';
import { useMediaUpload } from '@/commons/hooks';
import { apiClient, buildApiUrl, getMediaUrls, normalizeApiBaseUrl } from '@/utils';
import { AxiosError } from 'axios';
import Constants from 'expo-constants';
import { Alert } from 'react-native';
import { useMapLocation } from '../../map-view/hooks/useMapLocation';
import {
  ApiErrorResponse,
  AttachmentFile,
  CreateCapsuleRequest,
  CreateCapsuleResponse,
} from '../types';

export const useCreateCapsule = () => {
  const { upload } = useMediaUpload();
  const { location } = useMapLocation();

  const createCapsule = async (
    data: Omit<CreateCapsuleRequest, 'media_urls' | 'media_types'> & {
      attachments: AttachmentFile[];
    },
  ): Promise<CreateCapsuleResponse | null> => {
    try {
      const rawApiBaseUrl =
        Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL;
      const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

      if (!apiBaseUrl) {
        Alert.alert(
          '오류',
          'API 서버 주소가 설정되지 않았습니다.\n.env 파일에 EXPO_PUBLIC_API_BASE_URL을 설정해주세요.',
        );
        return null;
      }

      // 파일 업로드
      const mediaIds: string[] = [];
      const mediaTypes: MediaType[] = [];

      for (const attachment of data.attachments) {
        if (attachment.uri) {
          const mediaId = await upload(attachment.uri, attachment.type);
          if (mediaId) {
            mediaIds.push(mediaId);
            mediaTypes.push(attachment.type);
          } else {
            Alert.alert('오류', `파일 업로드에 실패했습니다: ${attachment.name}`);
            return null;
          }
        }
      }

      // mediaIds를 URL로 변환
      const mediaUrls = await getMediaUrls(mediaIds);

      // 현재 위치 확인
      if (!location) {
        Alert.alert('오류', '현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        return null;
      }

      const requestData: CreateCapsuleRequest = {
        latitude: location.lat,
        longitude: location.lng,
        title: data.title,
        content: data.content,
        media_urls: mediaUrls,
        media_types: mediaTypes,
        open_at: data.open_at,
        view_limit: data.view_limit,
        product_id: data.product_id,
      };

      const response = await apiClient.post<CreateCapsuleResponse>(
        buildApiUrl(apiBaseUrl, API_ENDPOINTS.CAPSULE.CREATE),
        requestData,
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data;

      switch (status) {
        case 409: {
          const errorCode = errorData?.code;
          const details = errorData?.details;

          if (errorCode === 'EGG_SLOTS_EXCEEDED') {
            if (details?.max_slots !== undefined && details?.used_slots !== undefined) {
              const remaining = (details.max_slots || 0) - (details.used_slots || 0);
              Alert.alert(
                '슬롯 부족',
                `이스터에그 작성 슬롯이 모두 사용되었습니다.\n\n사용된 슬롯: ${details.used_slots}개\n최대 슬롯: ${details.max_slots}개\n남은 슬롯: ${remaining}개`,
              );
            } else if (details?.remaining_slots !== undefined) {
              Alert.alert(
                '슬롯 부족',
                `남은 슬롯이 없습니다.\n(남은 슬롯: ${details.remaining_slots}개)`,
              );
            } else {
              const serverMessage = errorData?.message || errorData?.error;
              Alert.alert(
                '슬롯 부족',
                serverMessage ||
                  '이스터에그 작성 슬롯이 모두 사용되었습니다.\n더 이상 작성할 수 없습니다.',
              );
            }
          } else {
            const serverMessage = errorData?.message || errorData?.error || '요청이 충돌했습니다.';
            Alert.alert('알림', serverMessage);
          }
          break;
        }
        case 400:
          Alert.alert(
            '오류',
            errorData?.message || errorData?.error || '입력한 정보를 확인해주세요.',
          );
          break;
        case 404:
          Alert.alert('오류', '요청한 상품을 찾을 수 없습니다.');
          break;
        default:
          Alert.alert(
            '오류',
            errorData?.message || errorData?.error || '서버 오류가 발생했습니다.',
          );
          break;
      }

      return null;
    }
  };

  return { createCapsule };
};
