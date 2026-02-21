import React, { forwardRef } from "react";
import { useTableSortableRow } from "../hooks/useTableSortableRow";
import { cn } from "../utils/cn";

type Props = {
  record: { id: string };
  onReorder: (params: { sourceId: string; targetId: string }) => void;
  children?: React.ReactNode;
};

const SortableRow = forwardRef<HTMLTableRowElement, Props>(
  ({ record, onReorder, children }, ref) => {
    const { rowRef, edge } = useTableSortableRow({
      id: record.id,
      onReorder,
    });

    return (
      <tr
        ref={(node) => {
          rowRef.current = node;

          if (!ref) {
            return;
          }

          if (typeof ref === "function") {
            return ref(node);
          }

          ref.current = node;
        }}
        data-bill-id={record.id}
        className={cn({
            "[&>td]:before:absolute [&>td]:before:left-0 [&>td]:before:right-0 [&>td]:before:-top-0.5 [&>td]:before:h-0.75 [&>td]:before:bg-teal-950":
              edge === "top",
          })}
      >
        {children}
      </tr>
    );
  }
);

export default SortableRow;