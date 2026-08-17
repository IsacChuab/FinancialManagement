import type { BillStatus, BillWithActions } from '@isac-chuab/financial-shared';
import type { BillInput } from '@isac-chuab/financial-shared';

import { checkStatusBill, generateOrderForNewBill, mapBillsToUpdate, recalcOrders } from '../utils/functions';
import { trpc } from '../utils/trpc';
import { useOffline } from '../providers/OfflineProvider';

export function useBillActions() {
  const { isOffline } = useOffline();
  const utils = trpc.useUtils();
  const { data: listBills, isPending: isPendingListBills } = trpc.bill.allBills.useQuery(undefined, {
    enabled: !isOffline,
  });

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

  const updateReorderBills = trpc.bill.updateReorderBills.useMutation({
    onSuccess: () => {
      void utils.bill.allBills.invalidate();
    },
  });

  async function newBill(data: BillInput, isPaid: boolean) {
    const bills = listBills !== undefined ? listBills : [];
    data.order = generateOrderForNewBill(bills);

    const dueDate = data.type !== 'debit' ? data.dueDate : undefined;

    const status = checkStatusBill(isPaid, data.type, dueDate);
    await newBillMutation.mutateAsync({ ...data, status });
  }

  function updateStatus(bill: BillWithActions, status: BillStatus) {
    const isPaid = status === 'paid' ? true : false;
    const date = bill?.dueDate ? new Date(bill.dueDate) : undefined;

    const checkedStatus = checkStatusBill(isPaid, bill.type, date);

    updateStatusMutation.mutate({ id: bill.id, status: checkedStatus });
  }

  async function deleteBill(billId: string) {
    await deleteBillMutation.mutateAsync({ id: billId });
  }

  async function updateBill(billId: string, data: BillInput, isPaid: boolean) {
    const dueDate = data.type !== 'debit' ? data.dueDate : undefined;

    const status = checkStatusBill(isPaid, data.type, dueDate);
    await updateBillMutation.mutateAsync({ id: billId, ...data, status });
  }

  async function closeMonth () {
    if (!listBills?.length) {
      return;
    }

    const formatedData = mapBillsToUpdate(listBills);

    const { success } = await closeMonthMutation.mutateAsync(formatedData);

    return success;
  }

  function reorderBills(data: BillWithActions[]) {
    const dataWithNewOrder = recalcOrders(data);
    const formatedData = mapBillsToUpdate(dataWithNewOrder);

    updateReorderBills.mutate(formatedData);
  }

  function getSomeLatedOrPendingBill() {
    if (!listBills) {
      return false
    };

    return listBills.some((bill) => bill.status === 'pending' || bill.status === 'late');
  }

  function isPendingBill(billId: string) {
    if (updateStatusMutation.isPending && updateStatusMutation.variables?.id === billId) {
      return true;
    }

    if (deleteBillMutation.isPending && deleteBillMutation.variables?.id === billId) {
      return true;
    }

    if (updateBillMutation.isPending && updateBillMutation.variables?.id === billId) {
      return true;
    }

    return false;
  }

  function isPendingCheckPaid(billId: string) {
    return (
      updateStatusMutation.isPending &&
      updateStatusMutation.variables?.id === billId &&
      updateStatusMutation.variables?.status === 'paid'
    );
  }

  function isPendingCheckPending(billId: string) {
    return (
      updateStatusMutation.isPending &&
      updateStatusMutation.variables?.id === billId &&
      updateStatusMutation.variables?.status !== 'paid'
    );
  }

  return {
    newBill,
    isPendingNewBill: newBillMutation.isPending,
    isPendingUpdateBill: updateBillMutation.isPending,
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
    isPendingBill,
    isPendingCheckPaid,
    isPendingCheckPending,
  };
}

export type BillActions = ReturnType<typeof useBillActions>;
