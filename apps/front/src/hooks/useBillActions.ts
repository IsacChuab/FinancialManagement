import { useState } from 'react';
import type { BillStatus, BillWithActions } from '@isac-chuab/financial-shared';
import type { BillInput } from '@isac-chuab/financial-shared';

import { checkStatusBill, generateOrderForNewBill, mapBillsToUpdate } from '../utils/functions';
import { trpc } from '../utils/trpc';

export function useBillActions() {
  const utils = trpc.useUtils();
  const [editingBill, setEditingBill] = useState<BillWithActions | undefined>(undefined);

  const updateStatusMutation = trpc.bill.updateStatus.useMutation({
    onSuccess: (response) => {
      const { formattedBill } = response;

      utils.bill.allBills.setData(undefined, (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((bill) => {
          if (bill.id === formattedBill.id) return formattedBill;
          return bill;
        });
      });
    },
  });

  const newBillMutation = trpc.bill.newBill.useMutation({
    onSuccess: (response) => {
      const { formattedBill } = response;

      utils.bill.allBills.setData(undefined, (old) => {
        if (!old) return [formattedBill];
        return [...old, formattedBill];
      });
    },
  });

  const deleteBillMutation = trpc.bill.deleteBill.useMutation({
    onSuccess: (response) => {
      const { id } = response;

      utils.bill.allBills.setData(undefined, (oldData) => {
        if (!oldData) return [];

        return oldData.filter((bill) => bill.id !== id);
      });
    },
  });

  const updateBillMutation = trpc.bill.updateBill.useMutation({
    onSuccess: (response) => {
      const { formattedBill } = response;

      utils.bill.allBills.setData(undefined, (old) => {
        if (!old) return [formattedBill];
        return old.map((bill) => {
          if (bill.id === formattedBill.id) return formattedBill;
          return bill;
        });
      });
    },
  });

  const closeMonthMutation = trpc.bill.closeMonth.useMutation({
    onSuccess: () => {
      void utils.bill.allBills.invalidate();
    },
  });

  const updateBillInBulkMutation = trpc.bill.updateBillsInBulk.useMutation({
    onSuccess: () => {
      void utils.bill.allBills.invalidate();
    },
  });

  function newBill(data: BillInput, isPaid: boolean, listBills: BillWithActions[]) {
    console.log('new bill', {  data  });
    const orderBill = generateOrderForNewBill(listBills);
    data.order = orderBill;

    const dueDate = data.type !== 'debit' ? data.dueDate : undefined;

    const status = checkStatusBill(isPaid, data.type, dueDate);
    newBillMutation.mutate({ ...data, status });
  }

  function updateStatus(billId: string, status: BillStatus) {
    updateStatusMutation.mutate({ id: billId, status });
  }

  function deleteBill(billId: string) {
    deleteBillMutation.mutate({ id: billId });
  }

  function updateBill(billId: string, data: BillInput, isPaid: boolean) {
    console.log('update bill', {  data  });
    const dueDate = data.type !== 'debit' ? data.dueDate : undefined;

    const status = checkStatusBill(isPaid, data.type, dueDate);
    updateBillMutation.mutate({ id: billId, ...data, status });
  }

  function clearEdit() {
    setEditingBill(undefined);
  }

  function startEdit(bill: BillWithActions) {
    setEditingBill(bill);
  }

  function closeMonth(data: BillWithActions[]) {
    const formatedData = mapBillsToUpdate(data);

    closeMonthMutation.mutate(formatedData);
  }

  function reorderBills(data: BillWithActions[]) {
    const formatedData = mapBillsToUpdate(data);

    updateBillInBulkMutation.mutate(formatedData);
  }

  return {
    newBill,
    isPendingNewBill: newBillMutation.isPending,
    isPendingCloseMonth: closeMonthMutation.isPending,
    isPendingDeleteBill: deleteBillMutation.isPending,
    updateStatus,
    deleteBill,
    updateBill,
    editingBill,
    startEdit,
    clearEdit,
    closeMonth,
    reorderBills,
  };
}

export type BillActions = ReturnType<typeof useBillActions>;
