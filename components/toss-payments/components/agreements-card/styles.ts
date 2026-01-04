/**
 * components/agreements-card/styles.ts
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';
import { sharedStyles } from '../shared/styles';

export const styles = StyleSheet.create({
  agreementsCard: {
    position: 'relative',
    width: '100%',
    backgroundColor: Colors.white[50],
    borderRadius: 20,
  },

  cardBorder: sharedStyles.cardBorder,

  allAgreeRow: {
    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
    justifyContent: 'center',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 24,
    height: 24,
    backgroundColor: Colors.white[50],
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: Colors.darkGrey[900],
    borderRadius: 20,
  },

  checkboxChecked: {
    backgroundColor: Colors.white[50],
  },

  checkboxCheckmark: {
    ...Typography.body.body1,
    fontSize: 16,
    lineHeight: 16,
    color: Colors.darkGrey[900],
    zIndex: 1,
  },

  allAgreeText: {
    ...Typography.body.body1,
    color: Colors.darkGrey[900],
  },

  agreementsList: {
    paddingHorizontal: 17,
    paddingBottom: 17,
  },

  agreementRow: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  agreementText: {
    ...Typography.body.body6,
    color: Colors.darkGrey[900],
  },

  chevronButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chevronText: {
    ...Typography.body.body4,
    fontSize: 24,
    lineHeight: 24,
    color: Colors.grey[500],
  },
});

