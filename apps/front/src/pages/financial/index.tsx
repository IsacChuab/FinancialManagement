import { useEffect, useState } from 'react';
import type { BillWithActions } from '@isac-chuab/financial-shared';

import { AiOutlineArrowRight, AiOutlinePlusCircle } from 'react-icons/ai';
import { Button } from 'antd';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';

import { trpc } from '../../utils/trpc';
import dayjs from '../../utils/dayjs';
import AddBill from '../../components/AddBill';
import { useBillActions } from '../../hooks/useBillActions';
import InfoBills from '../../components/CardInfo';
import DeleteBillModal from '../../components/ConfirmationsModals/DeleteBill';
import CloseMonthModal from '../../components/ConfirmationsModals/CloseMonth';
import { flushSync } from 'react-dom';
import { isBillData, reorderBills } from '../../utils/functions';

const Financial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenCloseMonthModal, setIsOpenCloseMonthModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState<BillWithActions | null>(null);
  const [draggableBill, setDraggableBill] = useState<BillWithActions[]>([]);

  const { data, isPending } = trpc.bill.allBills.useQuery();
  const billActions = useBillActions();
  const currentMonth = dayjs().format('MMMM');

  useEffect(() => {
    if (data) {
      setDraggableBill(data);
    }
  }, [data]);

  const handleEdit = (bill: BillWithActions) => {
    billActions.startEdit(bill);
    setIsOpen(true);
  };

  const handleDelete = (bill: BillWithActions) => {
    setBillToDelete(bill);
    setIsOpenDeleteModal(true);
  };

  const closeAddBillModal = () => {
    setIsOpen(false);
    billActions.clearEdit();
  };

  const handleCloseMonth = () => {
    if (!data) return;

    billActions.closeMonth(data);
    setIsOpenCloseMonthModal(false);
  };

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isBillData(source.data);
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target || !data) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;

        if (!isBillData(sourceData) || !isBillData(targetData)) {
          return;
        }

        const indexOfSource = data.findIndex((bill) => bill.id == sourceData.billId);
        const indexOfTarget = data.findIndex((bill) => bill.id === targetData.billId);

        if ((indexOfTarget && indexOfTarget < 0) || (indexOfSource && indexOfSource < 0)) {
          return;
        }

        const newListBill = reorderWithEdge({
          list: draggableBill,
          startIndex: indexOfSource,
          indexOfTarget,
          closestEdgeOfTarget: null,
          axis: 'horizontal',
        });

        flushSync(() => {
          if (indexOfSource !== undefined && indexOfTarget !== undefined) {
            setDraggableBill(newListBill);
          }
        });

        const reorderedBills = reorderBills(newListBill);
        billActions.reorderBills(reorderedBills);

        const sourceDataWithId = sourceData as Record<string, unknown>;
        const element = document.querySelector(
          `[data-task-id="${String(sourceDataWithId.taskId)}"]`,
        );

        if (element instanceof HTMLElement) {
          triggerPostMoveFlash(element);
        }
      },
    });
  }, [draggableBill, data, billActions]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl">Contas de {currentMonth}</h1>

        <div className="flex flex-col gap-3 md:flex-row">
          <Button type="primary" onClick={() => setIsOpen(true)}>
            Adicionar Conta <AiOutlinePlusCircle />
          </Button>

          <Button
            type="default"
            onClick={() => setIsOpenCloseMonthModal(true)}
            disabled={!data?.length}
          >
            Finalizar Mês <AiOutlineArrowRight />
          </Button>
        </div>
      </div>

      {!data?.length && <p>Nenhuma conta registrada</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {draggableBill &&
          draggableBill.map((bill) => (
            <InfoBills
              key={bill.id}
              bill={bill}
              handleActions={billActions}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              loading={isPending}
            />
          ))}
      </div>

      {/*layout em table
      <Table
        dataSource={data}
        columns={columns({ billActions, handleEdit, handleDelete })}
        pagination={false}
        loading={isPending}
        scroll={{ y: 'calc(100vh - 300px)' }}
      />*/}

      <AddBill
        isOpen={isOpen}
        closeModal={closeAddBillModal}
        billToEdit={billActions.editingBill}
      />
      <DeleteBillModal
        isOpen={isOpenDeleteModal}
        setModalIsOpen={setIsOpenDeleteModal}
        bill={billToDelete}
      />
      <CloseMonthModal
        isOpen={isOpenCloseMonthModal}
        setModalIsOpen={setIsOpenCloseMonthModal}
        onConfirm={handleCloseMonth}
        loading={billActions.isPendingCloseMonth}
        name={currentMonth}
      />
    </div>
  );
};

export default Financial;
