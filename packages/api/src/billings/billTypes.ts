import type { IBill } from './repositories/billModel.js';

export type BillAction = 'checkPaid' | 'checkPending' | 'edit' | 'delete';
export type BillStatus = 'paid' | 'pending' | 'late';
export type BillType = 'debit' | 'credit' | 'vital';

export type BillWithActions = IBill & {
  actions: BillAction[];
};
