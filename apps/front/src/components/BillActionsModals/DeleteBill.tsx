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

  const handleDelete = async () => {
    if (!bill) return;

    try {
      await deleteBill(bill.id);
      closeModal();
    } catch {
      return;
    }
  };

  return (
    <Modal
      title="Adicionar Conta"
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
        <span>Tem certeza que deseja excluir esta conta?</span>

        <div className="flex flex-col">
          <span>
            <b>Nome: </b>
            {bill?.name}
          </span>
          <span>
            <b>Tipo: </b>
            {bill?.type && typeEnum[bill.type].label}
          </span>
          <span>
            <b>Valor: </b>
            {formatBrlMoney(bill?.amount)}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button key="cancel" onClick={closeModal} disabled={isPendingDeleteBill}>
          Cancelar
        </Button>

        <Button
          key="confirm"
          type="primary"
          onClick={() => void handleDelete()}
          loading={isPendingDeleteBill}
          disabled={isPendingDeleteBill}
          ref={confirmButtonRef}
        >
          Excluir
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteBill;
