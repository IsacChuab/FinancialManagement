import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { BillWithActions } from '@isac-chuab/financial-shared';

import dayjs from '../../utils/dayjs';
import Summary from '../../components/Summary';
import BillsView from '../../components/CardInfo/BillsView';
import { useBillActions } from '../../hooks/useBillActions';
import { useSortables } from '../../hooks/useSortables';
import { useOffline } from '../../providers/OfflineProvider';
import { db } from '../../infrastructure/db/database';

const EMPTY_BILLS: BillWithActions[] = [];

const Financial = () => {
  const { isOffline } = useOffline();
  const { listBills, reorderBills } = useBillActions();
  const dexieBills = useLiveQuery(() => db.bill.toArray(), []);

  const activeBills = useMemo(
    () => (isOffline ? (dexieBills ?? EMPTY_BILLS) : (listBills ?? EMPTY_BILLS)),
    [isOffline, dexieBills, listBills],
  );

  const { orderedList, onReorder } = useSortables(activeBills);

  const currentMonth = dayjs().format('MMMM');
  const currentMonthLabel = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  const handleReorder = (params: { sourceId: string; targetId: string }) => {
    if (isOffline) {
      return;
    }

    const result = onReorder(params);

    if (result) {
      reorderBills(result.newList);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Summary />

      <BillsView
        title={`Contas de ${currentMonthLabel}`}
        bills={orderedList}
        onReorder={handleReorder}
      />
    </div>
  );
};

export default Financial;
