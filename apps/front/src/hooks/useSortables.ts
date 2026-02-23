import { useCallback, useEffect, useMemo, useState } from "react";
import type { BillWithActions } from "@isac-chuab/financial-shared";

type ReorderParams = {
  sourceId: string;
  targetId: string;
};

function reorderIds(ids: string[], sourceId: string, targetId: string) {
  if (sourceId === targetId) return ids;

  const sourceIndex = ids.indexOf(sourceId);
  const targetIndex = ids.indexOf(targetId);

  if (sourceIndex === -1 || targetIndex === -1) return ids;

  const copy = [...ids];
  const [removed] = copy.splice(sourceIndex, 1);
  copy.splice(targetIndex, 0, removed);

  return copy;
}

export function useSortables(initialList: BillWithActions[] = []) {
  const [orderedIds, setOrderedIds] = useState<string[]>(
    initialList.map((b) => b.id)
  );

  useEffect(() => {
    const backendIds = initialList.map((b) => b.id);

    setOrderedIds((current) => {
      const currentSet = new Set(current);
      const backendSet = new Set(backendIds);

      const next = current.filter((id) => backendSet.has(id));

      backendIds.forEach((id) => {
        if (!currentSet.has(id)) next.push(id);
      });

      if (current.length === 0) return backendIds;

      return next;
    });
  }, [initialList]);

  const orderedList = useMemo(() => {
    const map = new Map(initialList.map((b) => [b.id, b]));
    return orderedIds.map((id) => map.get(id)).filter(Boolean) as BillWithActions[];
  }, [orderedIds, initialList]);

  const onReorder = useCallback(
    ({ sourceId, targetId }: ReorderParams) => {
      setOrderedIds((prev) => reorderIds(prev, sourceId, targetId));

      return {
        movedId: sourceId,
        newList: orderedList,
      };
    },
    [orderedList]
  );

  return {
    orderedList,
    onReorder,
    setOrderedIds,
  };
}