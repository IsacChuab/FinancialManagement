import type { BillWithActions } from '@financial/shared';
import type { BillModel } from '../billings/repositories/billModel.js';

export function addActionsToBill(bill: BillModel): BillWithActions {
  const plain = bill.toObject();

  if (plain.type === 'debit') {
    return {
      ...plain,
      actions: ['edit', 'delete'],
    };
  }

  return {
    ...plain,
    actions:
      plain.status === 'paid'
        ? ['checkPending', 'edit', 'delete']
        : ['checkPaid', 'edit', 'delete'],
  };
}
