import type { IBill } from './repositories/billModel.js';

export type BillAction = 'checkPaid' | 'checkPendent' | 'edit' | 'delete';

export type BillWithActions = IBill & {
  actions: BillAction[];
};
