import { useEffect, useMemo, useRef, useState } from 'react';

import type { BillWithActions } from '@isac-chuab/financial-shared';

import { Card, Tag } from 'antd';
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

import { actionEnum, statusEnum, typeEnum } from '../../pages/financial/billEnums';
import type { BillActions } from '../../hooks/useBillActions';
import type { ActionKey } from '../../pages/financial/dashboardColumns';
import CreditInfo from './creditInfo';
import BasicInfo from './basicInfo';
import VitalInfo from './vitalInfo';
import { getBillData, isBillData } from '../../utils/functions';
import { createPortal } from 'react-dom';

type TaskState =
  | {
      type: 'idle';
    }
  | {
      type: 'preview';
      container: HTMLElement;
    }
  | {
      type: 'is-dragging';
    }
  | {
      type: 'is-dragging-over';
      closestEdge: Edge | null;
    };

const InfoBills = ({
  bill,
  handleActions,
  handleEdit,
  handleDelete,
  loading,
}: {
  bill: BillWithActions;
  handleActions: BillActions;
  handleEdit: (bill: BillWithActions) => void;
  handleDelete: (bill: BillWithActions) => void;
  loading: boolean;
}) => {
  const idle: TaskState = useMemo(() => ({ type: 'idle' }), []);

  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TaskState>(idle);

  const title = () => {
    return (
      <div className="flex items-center gap-2">
        {typeEnum[bill.type].icon} {typeEnum[bill.type].label}
      </div>
    );
  };

  const statusInfo = () => {
    const statusItem = statusEnum[bill.status];

    return (
      <Tag color={statusItem.color} key={bill.status} className="w-full text-center!">
        {statusItem.label}
      </Tag>
    );
  };

  const actionsList = () => {
    const items = actionEnum(bill, handleActions, handleEdit, handleDelete)?.filter(
      (action) => action?.key && bill.actions.includes(action.key as ActionKey),
    );

    return items?.map((item) => item.actionCard);
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    return combine(
      draggable({
        element,
        getInitialData() {
          return getBillData(bill);
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: '16px',
              y: '8px',
            }),
            render({ container }) {
              setState({ type: 'preview', container });
            },
          });
        },
        onDragStart() {
          setState({ type: 'is-dragging' });
        },
        onDrop() {
          setState(idle);
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          if (source.element === element) {
            return false;
          }

          return isBillData(source.data);
        },
        getData({ input }) {
          const data = getBillData(bill);

          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['left', 'right'],
          });
        },
        getIsSticky() {
          return true;
        },
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);

          setState({ type: 'is-dragging-over', closestEdge });
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);

          setState((current) => {
            if (current.type === 'is-dragging-over' && current.closestEdge === closestEdge) {
              return current;
            }
            return { type: 'is-dragging-over', closestEdge };
          });
        },
        onDragLeave() {
          setState(idle);
        },
        onDrop() {
          setState(idle);
        },
      }),
    );
  }, [bill, idle]);

  return (
    <>
      <div ref={ref}>
        <Card
          title={title()}
          extra={statusInfo()}
          variant="borderless"
          loading={loading}
          actions={actionsList()}
        >
          <div className="h-24 flex flex-col gap-1">
            <BasicInfo bill={bill} />

            {bill.type === 'credit' && <CreditInfo bill={bill} />}

            {bill.type === 'vital' && <VitalInfo bill={bill} />}
          </div>
        </Card>
      </div>

      {state.type === 'preview'
        ? createPortal(
            <div className="border-solid rounded p-2 bg-white">{bill.name}</div>,
            state.container,
          )
        : null}
    </>
  );
};

export default InfoBills;
