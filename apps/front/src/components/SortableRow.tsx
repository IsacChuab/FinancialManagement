import React, { forwardRef } from "react";
import { useTableSortableRow } from "../hooks/useTableSortableRow";

type Props = {
  record: { id: string };
  onReorder: (params: { sourceId: string; targetId: string }) => void;
  children?: React.ReactNode;
};

const SortableRow = forwardRef<HTMLTableRowElement, Props>(
  ({ record, onReorder, children }, ref) => {
    const { rowRef } = useTableSortableRow({
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
      >
        {children}
      </tr>
    );
  }
);

export default SortableRow;