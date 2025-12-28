import { useState } from 'react';
import { AiOutlineArrowRight, AiOutlinePlusCircle } from 'react-icons/ai';

import { Button, Table } from 'antd';
import { trpc } from '../../utils/trpc';

import AddBill from '../../components/AddBillForms';
import { columns } from './dashboardColumns';

const Financial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isPending } = trpc.bill.allBills.useQuery();

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
        columns={columns}
        pagination={false}
        loading={isPending}
        scroll={{ y: 'calc(100vh - 300px)' }}
      />

      <AddBill isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Financial;
