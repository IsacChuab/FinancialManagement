import type { BillWithActions } from '@isac-chuab/financial-shared';

import { AiOutlineBars } from 'react-icons/ai';
import { Dropdown, Tag, type TableColumnProps } from 'antd';
import dayjs from 'dayjs';

import { formatBrlMoney } from '../../utils/functions';
import { actionEnum, statusEnum, typeEnum } from './billEnums';
import type { BillActions } from '../../hooks/useBillActions';

export type ActionKey = 'checkPaid' | 'checkPending' | 'edit' | 'delete';

export const columns = ({
  billActions,
  handleEdit,
  handleDelete,
}: {
  billActions: BillActions;
  handleEdit: (bill: BillWithActions) => void;
  handleDelete: (bill: BillWithActions) => void;
}): TableColumnProps<BillWithActions>[] => [
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
    title: 'Estágio',
    dataIndex: 'currentInstallment',
    key: 'currentInstallment',
    render: (_, data: BillWithActions) =>
      data.currentInstallment ? `${data.currentInstallment} de ${data.totalInstallments}` : '-',
  },
  {
    title: 'Parcela',
    dataIndex: 'valueInstallment',
    key: 'valueInstallment',
    render: (valueInstallment: number) =>
      valueInstallment ? formatBrlMoney(valueInstallment) : '-',
  },
  {
    title: 'Vencimento',
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (dueDate: Date) => (dueDate ? dayjs(dueDate).format('DD/MM/YYYY') : '-'),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: 'paid' | 'late' | 'pending') => {
      const statusItem = statusEnum[status];
      return (
        <Tag color={statusItem.color} key={status}>
          {statusItem.label}
        </Tag>
      );
    },
  },
  {
    title: 'Ações',
    dataIndex: 'actions',
    key: 'actions',
    align: 'center',
    render: (actions: ActionKey[], record: BillWithActions) => {
      const items = actionEnum(record, billActions, handleEdit, handleDelete)?.filter(
        (action) => action?.key && actions.includes(action.key as ActionKey),
      );

      return (
        <Dropdown menu={{ items }} className="cursor-pointer m-auto">
          <AiOutlineBars />
        </Dropdown>
      );
    },
  },
];
