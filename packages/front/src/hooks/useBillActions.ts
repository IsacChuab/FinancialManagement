import { useState } from 'react';
import type { BillStatus, BillWithActions } from '../../../api/src/billings/billTypes';
import type { BillInput } from '../../../api/src/billings/billValidator';
import { checkStatusBill } from '../utils/functions';
import { trpc } from '../utils/trpc';

export function useBillActions() {
  const utils = trpc.useUtils();
  const [editingBill, setEditingBill] = useState<BillWithActions | null>(null);

  const updateStatusMutation = trpc.bill.updateStatus.useMutation({
    onSuccess: (data) => {
      utils.bill.allBills.setData(undefined, (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((bill) => {
          if (bill.id === data.id) return data;
          return bill;
        });
      });
    },
  });

  const newBillMutation = trpc.bill.newBill.useMutation({
    onSuccess: (newBill) => {
      utils.bill.allBills.setData(undefined, (old) => {
        if (!old) return [newBill];
        return [...old, newBill];
      });
    },
  });

  const deleteBillMutation = trpc.bill.deleteBill.useMutation({
    onSuccess: (data) => {
      utils.bill.allBills.setData(undefined, (oldData) => {
        if (!oldData) return [];

        return oldData.filter((bill) => bill.id !== data.id);
      });
    },
  });

  const updateBillMutation = trpc.bill.updateBill.useMutation({
    onSuccess: (updatedBill) => {
      utils.bill.allBills.setData(undefined, (old) => {
        if (!old) return [updatedBill];
        return old.map((bill) => {
          if (bill.id === updatedBill.id) return updatedBill;
          return bill;
        });
      });
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
    setEditingBill(null);
  }

  function startEdit(bill: BillWithActions) {
    setEditingBill(bill);
  }

  return {
    newBill,
    isPending: newBillMutation.isPending,
    updateStatus,
    deleteBill,
    updateBill,
    editingBill,
    startEdit,
    clearEdit,
  };
}

export type BillActions = ReturnType<typeof useBillActions>;
