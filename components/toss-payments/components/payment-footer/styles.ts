/**
 * components/payment-footer/styles.ts
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  footer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 34,
  },

  submitButton: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.darkGrey[900],
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  submitButtonDisabled: {
    backgroundColor: Colors.grey[300],
  },

  submitButtonText: {
    ...Typography.caption.button,
    color: Colors.white[50],
  },

  submitButtonArrow: {
    ...Typography.caption.button,
    fontSize: 20,
    lineHeight: 28,
    color: Colors.white[50],
  },
});

