import type { BillWithActions, CloseMonth } from '@financial/shared';
import dayjs from '../utils/dayjs';

export const formatBrlMoney = (value = 0) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value > 0 ? value : 0);
};

export const checkStatusBill = (isPaid: boolean, dueDate: Date) => {
  const currentDate = new Date();

  if (isPaid) {
    return 'paid';
  }

  if (dayjs(currentDate).format('YYYY-MM-DD') > dayjs(dueDate).format('YYYY-MM-DD')) {
    return 'late';
  }

  return 'pending';
};

export const closeMonthDataFormatter = (data: BillWithActions[]): CloseMonth => {
  return data.map((bill) => {
    const {
      id,
      type,
      name,
      amount,
      status,
      valueInstallment,
      currentInstallment,
      totalInstallments,
      dueDate,
    } = bill;

    if (type === 'debit') {
      return {
        id,
        type,
        name,
        amount,
        status,
      };
    }

    if (type === 'credit') {
      return {
        id,
        type,
        name,
        amount,
        status,
        valueInstallment,
        currentInstallment,
        totalInstallments,
        dueDate: new Date(dueDate!),
      };
    }

    return {
      id,
      type,
      name,
      amount,
      status,
      dueDate: new Date(dueDate!),
    };
  });
};
