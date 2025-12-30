/**
 * components/agreement-detail-modal/styles.ts
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 10, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: Colors.white[50],
    borderRadius: 20,
    overflow: 'hidden',
  },

  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalTitle: {
    ...Typography.caption.button,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.darkGrey[900],
    flex: 1,
  },

  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCloseText: {
    ...Typography.header.h1,
    color: Colors.grey[500],
  },

  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  modalSection: {
    marginBottom: 16,
  },

  modalSectionTitle: {
    ...Typography.body.body1,
    color: Colors.darkGrey[900],
    marginBottom: 8,
  },

  modalText: {
    ...Typography.body.body6,
    lineHeight: 22,
    color: Colors.darkGrey[800],
  },
});

