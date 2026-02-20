import { useCallback, useEffect, useState } from "react";
import type { BillWithActions } from "@isac-chuab/financial-shared";
import { recalcOrders } from "../utils/functions";

type ReorderParams = {
  sourceId: string;
  targetId: string;
};

function reorder(
  bills: BillWithActions[],
  sourceId: string,
  targetId: string
): BillWithActions[] {
  if (sourceId === targetId) {
		return bills
	};

  const sourceIndex = bills.findIndex(b => b.id === sourceId);
  const targetIndex = bills.findIndex(b => b.id === targetId);

  if (sourceIndex === -1 || targetIndex === -1) {
    return bills;
  }

  const copy = [...bills];
  const [removed] = copy.splice(sourceIndex, 1);
  copy.splice(targetIndex, 0, removed);

  return recalcOrders(copy);
}

export function useSortables(initialList: BillWithActions[] = []) {
  const [orderedList, setOrderedList] = useState<BillWithActions[]>(initialList);

  useEffect(() => {
    setOrderedList(initialList);
  }, [initialList]);

  const onReorder = useCallback(
    ({ sourceId, targetId }: ReorderParams) => {
      const newList = reorder(orderedList, sourceId, targetId);

      if (newList === orderedList) {
				return
			};

      setOrderedList(newList);

      return {
        movedId: sourceId,
        newList,
      };
    },
    [orderedList]
  );

  return {
    orderedList,
    onReorder,
    setOrderedList,
  };
}
