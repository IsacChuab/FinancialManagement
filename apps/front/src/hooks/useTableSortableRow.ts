import { useEffect, useRef } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

type Params = {
  id: string;
  onReorder: (params: { sourceId: string; targetId: string }) => void;
};

export const useTableSortableRow = ({ id, onReorder }: Params) => {
  const rowRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rowRef.current) return;

    const cleanDrag = draggable({
      element: rowRef.current,
      getInitialData: () => ({ billId: id }),
    });

    const cleanDrop = dropTargetForElements({
      element: rowRef.current,
      getData: () => ({ billId: id }),
      onDrop: ({ source }) => {
        const sourceId = source.data.billId as string;

        if (!sourceId || sourceId === id) return;

        onReorder({
          sourceId,
          targetId: id,
        });
      },
    });

    return () => {
      cleanDrag();
      cleanDrop();
    };
  }, [id, onReorder]);

  return { rowRef };
};