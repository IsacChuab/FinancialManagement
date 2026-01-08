import { useState } from 'react';
import { AiOutlineArrowRight, AiOutlinePlusCircle } from 'react-icons/ai';

import { Button } from 'antd';
import { trpc } from '../../utils/trpc';
import dayjs from '../../utils/dayjs';

import AddBill from '../../components/AddBill';
import { useBillActions } from '../../hooks/useBillActions';
import type { BillWithActions } from '../../../../api/src/billings/billTypes';
import InfoBills from '../../components/CardInfo';

const Financial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isPending } = trpc.bill.allBills.useQuery();
  const billActions = useBillActions();
  const currentMonth = dayjs().format('MMMM');

  const handleEdit = (bill: BillWithActions) => {
    billActions.startEdit(bill);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    billActions.clearEdit();
  };

  const handleCloseMonth = () => {
    if (!data) return;

    billActions.closeMonth(data);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl">Contas de {currentMonth}</h1>

        <div className="flex flex-col gap-3 md:flex-row">
          <Button type="primary" onClick={() => setIsOpen(true)}>
            Adicionar Conta <AiOutlinePlusCircle />
          </Button>

          <Button type="default" onClick={handleCloseMonth} disabled={!data?.length}>
            Finalizar Mês <AiOutlineArrowRight />
          </Button>
        </div>
      </div>

      {!data?.length && <p>Nenhuma conta registrada</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data &&
          data.map((bill) => (
            <InfoBills
              key={bill.id}
              bill={bill}
              handleActions={billActions}
              handleEdit={handleEdit}
              loading={isPending}
            />
          ))}
      </div>

      {/*
        layout em table
        <Table
        dataSource={data}
        columns={columns({ billActions, handleEdit })}
        pagination={false}
        loading={isPending}
        scroll={{ y: 'calc(100vh - 300px)' }}
      />*/}

      <AddBill isOpen={isOpen} closeModal={closeModal} billToEdit={billActions.editingBill} />
    </div>
  );
};

export default Financial;
