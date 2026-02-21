import dayjs from "../../utils/dayjs";
import Summary from "../../components/Summary";
import BillsView from "../../components/CardInfo/BillsView";
import { useBillActions } from "../../hooks/useBillActions";
import { useSortables } from "../../hooks/useSortables";

const Financial = () => {
  const { listBills, reorderBills } = useBillActions();
  const { orderedList, onReorder } = useSortables(listBills ?? []);

  const currentMonth = dayjs().format("MMMM");

  const handleReorder = (params: { sourceId: string; targetId: string }) => {
    const result = onReorder(params);

    if (result) {
      reorderBills(result.newList);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <Summary />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl">
          Contas de {currentMonth}
        </h1>
      </div>

      {!orderedList.length && <p>Nenhuma conta registrada</p>}

      <BillsView bills={orderedList} onReorder={handleReorder} />
    </div>
  );
};

export default Financial;