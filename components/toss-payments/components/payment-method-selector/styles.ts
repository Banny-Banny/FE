/**
 * components/payment-method-selector/styles.ts
 * 결제 수단 선택 컴포넌트 스타일
 */

import { Colors, Typography } from '@/commons/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    ...Typography.body.body1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey[900],
    marginBottom: 12,
  },
  methodList: {
    gap: 8,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white[50],
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.grey[200],
  },
  methodItemSelected: {
    borderColor: Colors.blue[500],
    backgroundColor: Colors.blue[50],
  },
  methodContent: {
    flex: 1,
  },
  methodLabel: {
    ...Typography.body.body1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGrey[900],
    marginBottom: 4,
  },
  methodLabelSelected: {
    color: Colors.blue[500],
  },
  methodDescription: {
    ...Typography.body.body6,
    fontSize: 13,
    color: Colors.grey[500],
  },
  methodDescriptionSelected: {
    color: Colors.blue[500],
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    ...Typography.body.body1,
    color: Colors.white[50],
    fontSize: 14,
    fontWeight: 'bold',
  },
});

