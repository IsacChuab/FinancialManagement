import { useState } from 'react';

import { Button, Table } from 'antd';
import { AiOutlineArrowRight, AiOutlinePlusCircle } from 'react-icons/ai';
import AddBill from '../../components/AddBillForms';

const Financial = () => {
  const [isOpen, setIsOpen] = useState(false);

  const fakeData = [
    {
      key: '1',
      name: 'Água',
      startDate: '2023-01-01',
      currentInstallment: 'Vitalício',
      finalInstallment: 'Vitalício',
      value: 50.24,
      valueInstallment: null,
      currentDate: '2023-02-01',
    },
    {
      key: '2',
      name: 'Moto',
      startDate: '2023-02-01',
      currentInstallment: '1',
      finalInstallment: '3',
      value: 365.5,
      valueInstallment: 188.3,
      currentDate: '2023-03-01',
    },

    {
      key: '3',
      name: 'lanche',
      startDate: '2023-02-01',
      currentInstallment: '1',
      finalInstallment: '1',
      value: 35.5,
      valueInstallment: null,
      currentDate: '2023-03-01',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Current Installment',
      dataIndex: 'currentInstallment',
      key: 'currentInstallment',
    },
    {
      title: 'Final Installment',
      dataIndex: 'finalInstallment',
      key: 'finalInstallment',
    },
    {
      title: 'Value Installment',
      dataIndex: 'valueInstallment',
      key: 'valueInstallment',
    },
    {
      title: 'Expire Date',
      dataIndex: 'currentDate',
      key: 'currentDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'actions',
      render: () => (
        <div>
          <Button type="default">Edit</Button>
        </div>
      ),
    },
  ];

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

      <Table dataSource={fakeData} columns={columns} pagination={false} />

      <AddBill isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Financial;
