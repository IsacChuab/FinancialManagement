import { Button, Tag } from 'antd';
import { formatBrlMoney } from '../../utils/functions';
import dayjs from 'dayjs';

const typeEnum = {
  debit: {
    label: 'Débito',
    color: '#24117a',
  },
  credit: {
    label: 'Crédito',
    color: '#c97f08',
  },
  vital: {
    label: 'Vitalício',
    color: '#038539',
  },
};

const statusEnum = {
  paid: {
    label: 'Pago',
    color: '#53D388',
  },
  late: {
    label: 'Atrasado',
    color: '#c97f08',
  },
  pendent: {
    label: 'Pendente',
    color: '#038539',
  },
};

export const columns = [
  {
    title: 'Tipo',
    dataIndex: 'type',
    key: 'type',
    render: (type: 'debit' | 'credit' | 'vital') => {
      const typeItem = typeEnum[type];
      return (
        <Tag color={typeItem.color} key={type}>
          {typeItem.label}
        </Tag>
      );
    },
  },
  {
    title: 'Nome',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Valor',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: number) => formatBrlMoney(amount),
  },
  {
    title: 'Parcela Atual',
    dataIndex: 'currentInstallment',
    key: 'currentInstallment',
    render: (currentInstallment: number) => (currentInstallment ? currentInstallment : '-'),
  },
  {
    title: 'Parcela Final',
    dataIndex: 'totalInstallments',
    key: 'totalInstallments',
    render: (finalInstallment: number) => (finalInstallment ? finalInstallment : '-'),
  },
  {
    title: 'Valor da Parcela',
    dataIndex: 'valueInstallment',
    key: 'valueInstallment',
    render: (valueInstallment: number) =>
      valueInstallment ? formatBrlMoney(valueInstallment) : '-',
  },
  {
    title: 'Data de Vencimento',
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (dueDate: Date) => (dueDate ? dayjs(dueDate).format('DD/MM/YYYY') : '-'),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: 'paid' | 'late' | 'pendent') => {
      const statusItem = statusEnum[status];
      return (
        <Tag color={statusItem.color} key={status}>
          {statusItem.label}
        </Tag>
      );
    },
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
