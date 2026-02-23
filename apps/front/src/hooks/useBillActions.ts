import type { BillStatus, BillWithActions } from '@isac-chuab/financial-shared';
import type { BillInput } from '@isac-chuab/financial-shared';

import { checkStatusBill, generateOrderForNewBill, mapBillsToUpdate } from '../utils/functions';
import { trpc } from '../utils/trpc';

export function useBillActions() {
  const utils = trpc.useUtils();
  const { data: listBills, isPending: isPendingListBills } = trpc.bill.allBills.useQuery();

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
      void utils.bill.summary.invalidate();
      const { formattedBill } = response;

      utils.bill.allBills.setData(undefined, (old) => {
        if (!old) return [formattedBill];
        return [...old, formattedBill];
      });
    },
  });

  const deleteBillMutation = trpc.bill.deleteBill.useMutation({
    onSuccess: (response) => {
      void utils.bill.summary.invalidate();
      const { id } = response;

      utils.bill.allBills.setData(undefined, (oldData) => {
        if (!oldData) return [];

        return oldData.filter((bill) => bill.id !== id);
      });
    },
  });

  const updateBillMutation = trpc.bill.updateBill.useMutation({
    onSuccess: (response) => {
      void utils.bill.summary.invalidate();
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
      void utils.bill.summary.invalidate();
      void utils.bill.allBills.invalidate();
    },
  });

  const updateBillInBulkMutation = trpc.bill.updateBillsInBulk.useMutation({
    onSuccess: () => {
      void utils.bill.allBills.invalidate();
    },
  });

  function newBill(data: BillInput, isPaid: boolean) {
    const bills = listBills !== undefined ? listBills : [];
    data.order = generateOrderForNewBill(bills);

    const dueDate = data.type !== 'debit' ? data.dueDate : undefined;

    const status = checkStatusBill(isPaid, data.type, dueDate);
    newBillMutation.mutate({ ...data, status });
  }

  function updateStatus(bill: BillWithActions, status: BillStatus) {
    const isPaid = status === 'paid' ? true : false;
    const date = bill?.dueDate ? new Date(bill.dueDate) : undefined;

    const checkedStatus = checkStatusBill(isPaid, bill.type, date);

    updateStatusMutation.mutate({ id: bill.id, status: checkedStatus });
  }

  function deleteBill(billId: string) {
    deleteBillMutation.mutate({ id: billId });
  }

  function updateBill(billId: string, data: BillInput, isPaid: boolean) {
    const dueDate = data.type !== 'debit' ? data.dueDate : undefined;

    const status = checkStatusBill(isPaid, data.type, dueDate);
    updateBillMutation.mutate({ id: billId, ...data, status });
  }

  function closeMonth(data: BillWithActions[]) {
    const formatedData = mapBillsToUpdate(data);

    closeMonthMutation.mutate(formatedData);
  }

  function reorderBills(data: BillWithActions[]) {
    const formatedData = mapBillsToUpdate(data);

    updateBillInBulkMutation.mutate(formatedData);
  }

  function getSomeLatedOrPendingBill() {
    if (!listBills) {
      return false
    };

    return listBills.some((bill) => bill.status === 'pending' || bill.status === 'late');
  }

  return {
    newBill,
    isPendingNewBill: newBillMutation.isPending,
    isPendingCloseMonth: closeMonthMutation.isPending,
    isPendingDeleteBill: deleteBillMutation.isPending,
    listBills,
    updateStatus,
    deleteBill,
    updateBill,
    closeMonth,
    reorderBills,
    getSomeLatedOrPendingBill,
    isPendingListBills,
  };
}

export type BillActions = ReturnType<typeof useBillActions>;
