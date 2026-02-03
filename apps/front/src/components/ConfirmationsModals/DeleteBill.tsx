import type { BillWithActions } from '@isac-chuab/financial-shared';

import { Button, Modal } from 'antd';

import { useBillActions } from '../../hooks/useBillActions';
import { formatBrlMoney } from '../../utils/functions';
import { typeEnum } from '../../pages/financial/billEnums';

const DeleteBillModal = ({
  isOpen,
  bill,
  setModalIsOpen,
}: {
  isOpen: boolean;
  bill: BillWithActions | null;
  setModalIsOpen: (isOpen: boolean) => void;
}) => {
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
      footer={[
        <Button key="cancel" onClick={() => setModalIsOpen(false)}>
          Cancelar
        </Button>,

        <Button
          key="ok"
          type="primary"
          loading={isPendingDeleteBill}
          disabled={isPendingDeleteBill}
          onClick={handleDelete}
        >
          Excluir
        </Button>,
      ]}
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
    </Modal>
  );
};

export default DeleteBillModal;
