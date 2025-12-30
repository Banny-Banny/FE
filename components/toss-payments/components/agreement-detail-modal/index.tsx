/**
 * components/agreement-detail-modal/index.tsx
 * 약관 상세 모달 컴포넌트
 */

import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AGREEMENT_DETAILS } from '../../constants';
import { styles } from './styles';
import type { AgreementDetailModalProps } from './types';

export const AgreementDetailModal: React.FC<AgreementDetailModalProps> = ({
  visible,
  selectedIndex,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}>
          {/* 모달 헤더 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedIndex !== null ? AGREEMENT_DETAILS[selectedIndex].title : ''}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="닫기">
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* 모달 콘텐츠 */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true}>
            {selectedIndex !== null &&
              AGREEMENT_DETAILS[selectedIndex].content.map((section, index) => (
                <View key={index} style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>{section.sectionTitle}</Text>
                  <Text style={styles.modalText}>{section.text}</Text>
                </View>
              ))}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

