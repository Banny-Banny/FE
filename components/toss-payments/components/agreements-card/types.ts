/**
 * components/agreements-card/types.ts
 */

import type { AgreementsState } from '../../types';

export interface AgreementsCardProps {
  allAgreed: boolean;
  agreements: AgreementsState;
  onAllAgreeToggle: () => void;
  onAgreementToggle: (key: keyof AgreementsState) => void;
  onAgreementDetailPress: (index: number) => void;
}
