import { Button, Table } from 'antd';

const Financial = () => {
  const fakeData = [
    {
      key: '1',
      name: 'Água',
      startDate: '2023-01-01',
      currentInstallment: 'Vitalício',
      finalInstallment: '10',
      value: 10.24,
      currentDate: '2023-02-01',
    },
    {
      key: '2',
      name: 'Luz',
      startDate: '2023-02-01',
      currentInstallment: '3',
      finalInstallment: '10',
      value: 15.5,
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
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
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
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Current Date',
      dataIndex: 'currentDate',
      key: 'currentDate',
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'actions',
      render: () => (
        <div>
          <Button type="primary">Edit</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-lime-900 text-6xl">Dashboard</h1>
      <Table dataSource={fakeData} columns={columns} />
    </div>
  );
};

export default Financial;
