/**
 * components/map/components/egg-form/hooks/useAttachments.ts
 * 첨부파일 관리 Hook
 *
 * 생성 시각: 2025-01-XX
 * 규칙 준수 체크리스트:
 * - [x] 첨부파일 추가 로직
 * - [x] 첨부파일 삭제 로직
 */

import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { AttachmentFile, EggFormData } from '../types';
import { useFileUpload } from './useFileUpload';

interface UseAttachmentsProps {
  attachments: AttachmentFile[];
  setValue: UseFormSetValue<EggFormData>;
  watch: UseFormWatch<EggFormData>;
}

/**
 * 첨부파일 관리 Hook
 */
export const useAttachments = ({ attachments, setValue, watch }: UseAttachmentsProps) => {
  const { handleFileSelect } = useFileUpload();

  /**
   * 첨부파일 삭제 핸들러
   * @param id 삭제할 첨부파일의 ID
   */
  const handleDeleteAttachment = (id: string) => {
    const updatedAttachments = attachments.filter((file) => file.id !== id);
    setValue('attachments', updatedAttachments);
  };

  /**
   * 첨부파일 추가 핸들러
   * @param type 첨부파일 타입 (photo, music, video)
   * 각 타입별로 하나씩만 업로드 가능 (기존 파일이 있으면 교체)
   */
  const handleAddAttachment = async (type: 'photo' | 'music' | 'video') => {
    try {
      const file = await handleFileSelect(type);
      if (file) {
        // 기존에 같은 타입의 파일이 있으면 제거하고 새 파일로 교체
        const otherAttachments = attachments.filter((att) => att.type !== type);
        const newAttachment: AttachmentFile = {
          id: Date.now().toString(),
          type,
          name: file.name,
          uri: file.uri,
        };
        setValue('attachments', [...otherAttachments, newAttachment]);
      }
    } catch (error) {
      // 파일 선택 취소 또는 오류 발생 시 무시
      console.log('파일 선택 취소 또는 오류:', error);
    }
  };

  return {
    handleDeleteAttachment,
    handleAddAttachment,
  };
};
