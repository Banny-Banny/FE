/**
 * components/agreements-card/index.tsx
 * 약관 동의 카드 컴포넌트
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AGREEMENT_ITEMS, TEXTS } from '../../constants';
import { styles } from './styles';
import type { AgreementsCardProps } from './types';

export const AgreementsCard: React.FC<AgreementsCardProps> = ({
  allAgreed,
  agreements,
  onAllAgreeToggle,
  onAgreementToggle,
  onAgreementDetailPress,
}) => {
  return (
    <View style={styles.agreementsCard}>
      {/* 전체 동의 */}
      <View style={styles.allAgreeRow}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={onAllAgreeToggle}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: allAgreed }}>
          <View style={[styles.checkbox, allAgreed && styles.checkboxChecked]}>
            {allAgreed && <Text style={styles.checkboxCheckmark}>✓</Text>}
          </View>
          <Text style={styles.allAgreeText}>{TEXTS.agreements.allAgree}</Text>
        </TouchableOpacity>
      </View>

      {/* 개별 약관 목록 */}
      <View style={styles.agreementsList}>
        {AGREEMENT_ITEMS.map(({ key, label }, index) => {
          const isChecked = agreements[key];

          return (
            <View key={key} style={styles.agreementRow}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => onAgreementToggle(key)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isChecked }}>
                <View style={[styles.checkboxSmall, isChecked && styles.checkboxSmallChecked]}>
                  {isChecked && <Text style={styles.checkboxCheckmarkSmall}>✓</Text>}
                </View>
                <Text style={styles.agreementText}>{label}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chevronButton}
                onPress={() => onAgreementDetailPress(index)}
                accessibilityRole="button"
                accessibilityLabel={`${label} 상세보기`}>
                <Text style={styles.chevronText}>›</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

