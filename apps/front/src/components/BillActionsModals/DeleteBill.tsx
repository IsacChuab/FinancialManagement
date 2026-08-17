import type { BillWithActions } from '@isac-chuab/financial-shared';

import { Button, Modal } from 'antd';

import { useBillActions } from '../../hooks/useBillActions';
import { formatBrlMoney } from '../../utils/functions';
import { typeEnum } from '../../pages/financial/billEnums';
import { useRef } from 'react';

const DeleteBill = ({
  isOpen,
  bill,
  closeModal,
}: {
  isOpen: boolean;
  bill: BillWithActions | null;
  closeModal: () => void;
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  const { deleteBill, isPendingDeleteBill } = useBillActions();

  const handleDelete = () => {
    if (!bill) return;

    try {
      deleteBill(bill.id);
      closeModal();
    } catch {
      return;
    }
  };

  return (
    <Modal
      title="Delete Bill"
      onCancel={closeModal}
      onOk={() => void handleDelete()}
      open={isOpen}
      footer={null}
      closable={!isPendingDeleteBill}
      mask={{ closable: !isPendingDeleteBill }}
      keyboard={!isPendingDeleteBill}
      afterOpenChange={(open) => {
        if (open) {
          confirmButtonRef.current?.focus();
        }
      }}
    >
      <div className="flex flex-col gap-2 mt-6">
        <span>Are you sure you want to delete this bill?</span>

        <div className="flex flex-col">
          <span>
            <b>Name: </b>
            {bill?.name}
          </span>
          <span>
            <b>Type: </b>
            {bill?.type && typeEnum[bill.type].label}
          </span>
          <span>
            <b>Amount: </b>
            {formatBrlMoney(bill?.amount)}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button key="cancel" onClick={closeModal} disabled={isPendingDeleteBill}>
          Cancel
        </Button>

        <Button
          key="confirm"
          type="primary"
          onClick={() => void handleDelete()}
          loading={isPendingDeleteBill}
          disabled={isPendingDeleteBill}
          ref={confirmButtonRef}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteBill;
