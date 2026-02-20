import { useEffect } from "react";
import dayjs from "../../utils/dayjs";

import Summary from "../../components/Summary";
import BillsView from "../../components/CardInfo/BillsView";

import { useBillActions } from "../../hooks/useBillActions";
import { useSortables } from "../../hooks/useSortables";

import { isBillData } from "../../utils/functions";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";

const Financial = () => {
  const { listBills, reorderBills } = useBillActions();
  const { orderedList, onReorder } = useSortables(listBills ?? []);

  const currentMonth = dayjs().format("MMMM");

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isBillData(source.data);
      },

      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return
        };

        const sourceData = source.data;
        const targetData = target.data;

        if (!isBillData(sourceData) || !isBillData(targetData)) {
          return;
        }

        const result = onReorder({
          sourceId: sourceData.billId as string,
          targetId: targetData.billId as string,
        });

        if (!result) {
          return
        };

        reorderBills(result.newList);

        const element = document.querySelector(
          `[data-bill-id="${result.movedId}"]`
        );

        if (element) {
          triggerPostMoveFlash(element as HTMLElement);
        }
      },
    });
  }, [onReorder, reorderBills]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Summary />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl">
          Contas de {currentMonth}
        </h1>
      </div>

      {!orderedList.length && <p>Nenhuma conta registrada</p>}

      <BillsView bills={orderedList} onReorder={onReorder} />
    </div>
  );
};

export default Financial;
