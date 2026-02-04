/**
 * commons/layout/provider/modal/modal.context.tsx
 * Modal Context 정의
 */

import { createContext } from 'react';
import { ModalContextType } from '@/commons/components/modal/types';

/**
 * Modal Context
 * Provider 외부에서 사용 시 null 반환
 */
export const ModalContext = createContext<ModalContextType | null>(null);
