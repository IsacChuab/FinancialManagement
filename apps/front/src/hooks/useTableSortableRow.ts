import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

type Params = {
  id: string;
  onReorder: (params: { sourceId: string; targetId: string }) => void;
};

export const useTableSortableRow = ({ id, onReorder }: Params) => {
  const rowRef = useRef<HTMLElement | null>(null);
  const [edge, setEdge] = useState<Edge | null>(null);

  useEffect(() => {
    if (!rowRef.current) return;

    const cleanDrag = draggable({
      element: rowRef.current,
      getInitialData: () => ({ billId: id }),
    });

    const cleanDrop = dropTargetForElements({
      element: rowRef.current,

      getData: ({ input }) =>
        attachClosestEdge({ billId: id }, {
          element: rowRef.current!,
          input,
          allowedEdges: ['top'],
        }),

      onDragEnter: ({ self }) =>
        setEdge(extractClosestEdge(self.data)),

      onDrag: ({ self }) =>
        setEdge(extractClosestEdge(self.data)),

      onDragLeave: () => setEdge(null),

      onDrop: ({ source }) => {
        setEdge(null)
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

  return {
    rowRef,
    edge,
  };
};