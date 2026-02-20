import type { BillUpdate, BillWithActions } from '@isac-chuab/financial-shared';
import dayjs from '../utils/dayjs';

export const formatBrlMoney = (value = 0) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value > 0 ? value : 0);
};

export const checkStatusBill = (isPaid: boolean, type: string, dueDate?: Date) => {
  const currentDate = new Date();

  if (isPaid || type === 'debit') {
    return 'paid';
  }

  if (dayjs(currentDate).format('YYYY-MM-DD') > dayjs(dueDate).format('YYYY-MM-DD')) {
    return 'late';
  }

  return 'pending';
};

export function isBillData(data: unknown): data is BillWithActions {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const bill = data as Record<string, unknown>;

  return (
    typeof bill.billId === 'string' &&
    typeof bill.userId === 'string' &&
    typeof bill.amount === 'number' &&
    typeof bill.name === 'string' &&
    typeof bill.type === 'string' &&
    Array.isArray(bill.actions)
  );
}

export function getBillData(bill: BillWithActions): Record<string, unknown> {
  return {
    billId: bill.id,
    userId: bill.userId,
    type: bill.type,
    name: bill.name,
    amount: bill.amount,
    actions: bill.actions,
  };
}

export function recalcOrders(data: BillWithActions[]): BillWithActions[] {
  const step = 10_000;

  return data.map((bill, i) => ({
    ...bill,
    order: (i + 1) * step,
  }));
}

export function mapBillsToUpdate(bills: BillWithActions[]): BillUpdate[] {
  return bills.map((bill) => {
    if (bill.type === 'debit') {
      return {
        id: bill.id,
        type: 'debit',
        name: bill.name,
        amount: bill.amount,
        status: bill.status,
        order: bill.order,
      };
    }

    if (bill.type === 'credit') {
      return {
        id: bill.id,
        type: 'credit',
        name: bill.name,
        amount: bill.amount,
        status: bill.status,
        order: bill.order,
        valueInstallment: bill.valueInstallment,
        currentInstallment: bill.currentInstallment,
        totalInstallments: bill.totalInstallments,
        dueDate: new Date(bill.dueDate!),
      };
    }

    return {
      id: bill.id,
      type: 'vital',
      name: bill.name,
      amount: bill.amount,
      status: bill.status,
      order: bill.order,
      dueDate: new Date(bill.dueDate!),
    };
  });
}

export function generateOrderForNewBill(existingBills: BillWithActions[]): number {
  if (existingBills.length === 0) {
    return 10_000;
  }

  const maxOrder = Math.max(...existingBills.map((bill) => bill.order || 0));
  return maxOrder + 10_000;
}