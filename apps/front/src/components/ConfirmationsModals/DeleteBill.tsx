import type { BillWithActions } from '@isac-chuab/financial-shared';

import { Button, Modal } from 'antd';

import { useBillActions } from '../../hooks/useBillActions';
import { formatBrlMoney } from '../../utils/functions';
import { typeEnum } from '../../pages/financial/billEnums';
import { useRef } from 'react';

const DeleteBillModal = ({
  isOpen,
  bill,
  setModalIsOpen,
}: {
  isOpen: boolean;
  bill: BillWithActions | null;
  setModalIsOpen: (isOpen: boolean) => void;
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  
  const { deleteBill, isPendingDeleteBill } = useBillActions();

  const handleDelete = () => {
    if (!bill) return;

    deleteBill(bill.id);
    setModalIsOpen(false);
  };

  return (
    <Modal
      title="Adicionar Conta"
      onCancel={() => setModalIsOpen(false)}
      onOk={handleDelete}
      open={isOpen}
      footer={null}
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
        <Button key="cancel" onClick={() => setModalIsOpen(false)} disabled={isPendingDeleteBill}>
          Cancelar
        </Button>

        <Button
          key="confirm"
          type="primary"
          onClick={handleDelete}
          loading={isPendingDeleteBill}
          ref={confirmButtonRef}
        >
          Excluir
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteBillModal;
