/**
 * Egg Detail Component Types
 * Version: 1.0.0
 * Created: 2025-01-XX
 */

import type { CapsuleItem } from '../map-view/types';

export interface EggDetailProps {
  isVisible: boolean;
  onClose: () => void;
  capsule: CapsuleItem | null;
}

