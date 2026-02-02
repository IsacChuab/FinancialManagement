import type { BillModel } from '../billings/repositories/billModel.js';

export const generateOrderBill = (bill: Pick<BillModel, 'order'> | null) => {
  const order = 10_000;

  if (!bill) {
    return order;
  }

  return bill.order + order;
};
