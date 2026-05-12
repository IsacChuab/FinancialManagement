import { useLiveQuery } from 'dexie-react-hooks';

import dayjs from '../../utils/dayjs';
import Summary from '../../components/Summary';
import BillsView from '../../components/CardInfo/BillsView';
import { useBillActions } from '../../hooks/useBillActions';
import { useSortables } from '../../hooks/useSortables';
import { useOffline } from '../../providers/OfflineProvider';
import { db } from '../../infrastructure/db/database';

const Financial = () => {
  const { isOffline } = useOffline();
  const { listBills, reorderBills } = useBillActions();
  const dexieBills = useLiveQuery(() => db.bill.toArray(), []);

  const activeBills = isOffline ? (dexieBills ?? []) : (listBills ?? []);

  const { orderedList, onReorder } = useSortables(activeBills);

  const currentMonth = dayjs().format('MMMM');

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
    <div className="flex flex-col gap-4 p-4">
      <Summary />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl">Contas de {currentMonth}</h1>
      </div>

      {!orderedList.length && <p>Nenhuma conta registrada</p>}

      <BillsView bills={orderedList} onReorder={handleReorder} />
    </div>
  );
};

export default Financial;
