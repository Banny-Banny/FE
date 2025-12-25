/**
 * components/map/components/egg-form/types.ts
 * 이스터에그 작성 폼 타입 정의
 */

// Props 인터페이스 정의
export interface EggFormProps {
  isVisible: boolean;
  onClose: () => void;
}

// 폼 데이터 타입 정의
export interface EggFormData {
  title: string;
  content: string;
  attachments: AttachmentFile[];
}

// 첨부파일 타입 정의
export interface AttachmentFile {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'MUSIC';
  name: string;
  uri?: string; // 실제 파일 URI (선택적)
  thumbnailUri?: string; // 동영상 썸네일 URI (동영상만, 선택적)
}

// API 요청 타입 정의
export interface CreateCapsuleRequest {
  title: string;
  content?: string;
  media_urls: string[];
  media_types: ('IMAGE' | 'VIDEO' | 'MUSIC')[];
  open_at?: string; // ISO-8601 string (future only)
  view_limit?: number;
  product_id?: string;
}

// API 응답 타입 정의
export interface CreateCapsuleResponse {
  id: string;
  title: string;
  content?: string;
  media_urls: string[];
  media_types: ('IMAGE' | 'VIDEO' | 'MUSIC')[];
  open_at?: string;
  view_limit?: number;
  product_id?: string;
  created_at: string;
}

// 에러 응답 타입 정의
export interface ApiErrorResponse {
  error?: string;
  message?: string;
  code?: string;
}
