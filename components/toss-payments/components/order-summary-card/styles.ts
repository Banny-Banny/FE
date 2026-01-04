/**
 * components/order-summary-card/styles.ts
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';
import { sharedStyles } from '../shared/styles';

export const styles = StyleSheet.create({
  orderSummaryCard: {
    width: '100%',
    height: 280,
    backgroundColor: Colors.white[50],
    borderRadius: 20,
    marginBottom: 20,
  },

  cardBorder: sharedStyles.cardBorder,

  cardContent: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  orderSummaryHeader: {
    paddingHorizontal: 17,
    paddingTop: 17,
    height: 45,
  },

  orderSummaryTitle: {
    ...Typography.body.body1,
    fontSize: 20,
    lineHeight: 28,
    color: Colors.darkGrey[900],
  },

  participantRow: {
    paddingHorizontal: 17,
    height: 37,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  participantLabel: {
    ...Typography.body.body6,
    color: Colors.grey[500],
  },

  participantValue: {
    ...Typography.body.body6,
    color: Colors.darkGrey[900],
  },

  itemsList: {
    paddingHorizontal: 17,
    paddingTop: 8,
    paddingBottom: 8,
  },

  itemRow: {
    height: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemLabel: {
    ...Typography.body.body6,
    color: Colors.darkGrey[900],
    marginRight: 8,
  },

  itemDetail: {
    ...Typography.body.body3,
    color: Colors.grey[400],
  },

  itemPrice: {
    ...Typography.body.body6,
    color: Colors.darkGrey[900],
  },

  totalRow: {
    paddingHorizontal: 17,
    height: 37,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    ...Typography.body.body1,
    color: Colors.darkGrey[900],
  },

  totalPrice: {
    ...Typography.caption.button,
    fontSize: 18,
    lineHeight: 20,
    color: Colors.darkGrey[900],
  },
});

