import type { BillStatus, BillWithActions } from '../../../api/src/billings/billTypes';
import type { BillInput } from '../../../api/src/billings/billValidator';
import { checkStatusBill } from '../utils/functions';
import { trpc } from '../utils/trpc';

export function useBillActions() {
  const utils = trpc.useUtils();

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

  function editBill(billId: string, data: BillWithActions) {
    console.log('Delete bill', billId, data);
  }

  return {
    newBill,
    isPending: newBillMutation.isPending,
    updateStatus,
    deleteBill,
    editBill,
  };
}

export type BillActions = ReturnType<typeof useBillActions>;
