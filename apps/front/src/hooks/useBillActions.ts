import { useState } from 'react';
import type { BillStatus, BillWithActions } from '@financial/shared';
import type { BillInput } from '@financial/shared';

import { checkStatusBill, mapBillsToUpdate } from '../utils/functions';
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

  function newBill(data: BillInput, isPaid: boolean) {
    if (data.type === 'debit') {
      newBillMutation.mutate({ ...data, status: 'paid' });
      return;
    }

    const status = checkStatusBill(isPaid, data.dueDate);
    newBillMutation.mutate({ ...data, status });
  }

  function updateStatus(billId: string, status: BillStatus) {
    updateStatusMutation.mutate({ id: billId, status });
  }

  function deleteBill(billId: string) {
    deleteBillMutation.mutate({ id: billId });
  }

  function updateBill(billId: string, data: BillInput, isPaid: boolean) {
    if (data.type === 'debit') {
      updateBillMutation.mutate({ id: billId, ...data, status: 'paid' });
      return;
    }

    const status = checkStatusBill(isPaid, data.dueDate);
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
