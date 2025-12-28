import { BillWithActions } from '../billings/billTypes.js';
import { BillModel } from '../billings/repositories/billModel.js';

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
        ? ['checkPendent', 'edit', 'delete']
        : ['checkPaid', 'edit', 'delete'],
  };
}
