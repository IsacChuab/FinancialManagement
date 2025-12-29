import { useState } from 'react';
import { AiOutlineArrowRight, AiOutlinePlusCircle } from 'react-icons/ai';

import { Button, Table } from 'antd';
import { trpc } from '../../utils/trpc';

import AddBill from '../../components/AddBillForms';
import { columns } from './dashboardColumns';
import { useBillActions } from '../../hooks/useBillActions';
import type { BillWithActions } from '../../../../api/src/billings/billTypes';

const Financial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isPending } = trpc.bill.allBills.useQuery();
  const billActions = useBillActions();

  const handleEdit = (bill: BillWithActions) => {
    billActions.startEdit(bill);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    billActions.clearEdit();
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Contas Mensal</h1>

        <div className="flex gap-3">
          <Button type="primary" onClick={() => setIsOpen(true)}>
            Adicionar Conta <AiOutlinePlusCircle />
          </Button>

          <Button type="default">
            Finalizar Mês <AiOutlineArrowRight />
          </Button>
        </div>
      </div>

      <Table
        dataSource={data}
        columns={columns({ billActions, handleEdit })}
        pagination={false}
        loading={isPending}
        scroll={{ y: 'calc(100vh - 300px)' }}
      />

      <AddBill isOpen={isOpen} closeModal={closeModal} billToEdit={billActions.editingBill} />
    </div>
  );
};

export default Financial;
