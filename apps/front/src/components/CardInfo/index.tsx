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
import { useMobileReorder } from '../../hooks/useMobileReorder';
import { cn } from '../../utils/cn';

type TaskState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'is-dragging' }
  | { type: 'is-dragging-over'; closestEdge: Edge | null };

const InfoBills = ({
  bill,
  handleActions,
  handleAction,
  onReorder,
}: {
  bill: BillWithActions;
  handleActions: BillActions;
  handleAction: (action: 'add' | 'edit' | 'delete' | 'closeMonth') => void;
  onReorder: (params: { sourceId: string; targetId: string }) => void;
}) => {
  const idle: TaskState = useMemo(() => ({ type: 'idle' }), []);
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TaskState>(idle);

  const { bind, isDragging } = useMobileReorder({
    billId: bill.id,
    onReorderMobile: (sourceId, targetId) => {
      onReorder({ sourceId, targetId });
    },
  });

  const title = () => (
    <div className="flex items-center gap-2">
      {typeEnum[bill.type].icon} {typeEnum[bill.type].label}
    </div>
  );

  const statusInfo = () => {
    const statusItem = statusEnum[bill.status];

    return (
      <Tag color={statusItem.color} key={bill.status} className="w-full text-center!">
        {statusItem.label}
      </Tag>
    );
  };

  const actionsList = () => {
    const items = actionEnum(bill, handleActions, handleAction)?.filter(
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
            getOffset: pointerOutsideOfPreview({ x: '16px', y: '8px' }),
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
          return source.element !== element && isBillData(source.data);
        },

        getData({ input }) {
          const data = getBillData(bill);

          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['left'],
          });
        },

        onDragEnter({ self }) {
          setState({
            type: 'is-dragging-over',
            closestEdge: extractClosestEdge(self.data),
          });
        },

        onDragLeave() {
          setState(idle);
        },

        onDrop({ source }) {
          if (!isBillData(source.data)) {
            return;
          }

          const sourceId = source.data.billId as string;
          const targetId = bill.id;

          if (sourceId === targetId) {
            return;
          }

          onReorder({ sourceId, targetId });
          setState(idle);
        },
      }),
    );
  }, [bill, idle, onReorder]);

  return (
    <>
      <div
        ref={ref}
        data-bill-id={bill.id}
        {...bind}
        className={cn(
          { 'scale-105 shadow-xl': isDragging },
          'relative transition-transform duration-200 ease-in-out'
        )}
      >
        {state.type === 'is-dragging-over' && state.closestEdge === 'left' && (
          <div className="absolute left-0 right-0 top-0 h-0.5 bg-blue-500 rounded z-10 md:bottom-0 md:w-0.5 md:right-auto md:h-auto" />
        )}

        <Card
          title={title()}
          extra={statusInfo()}
          variant="borderless"
          actions={actionsList()}
          className={`shadow-sm! ${statusEnum[bill.status].shadowClass}`}
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
            <Card
              title={title()}
              extra={statusInfo()}
              variant="borderless"
              className={`shadow-sm! ${statusEnum[bill.status].shadowClass}`}
            >
              <div className="h-24 flex flex-col gap-1">
                <BasicInfo bill={bill} />

                {bill.type === 'credit' && <CreditInfo bill={bill} />}

                {bill.type === 'vital' && <VitalInfo bill={bill} />}
              </div>
            </Card>,
            state.container,
          )
        : null}
    </>
  );
};

export default InfoBills;