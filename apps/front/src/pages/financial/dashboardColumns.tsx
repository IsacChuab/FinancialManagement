import type { BillWithActions } from '@isac-chuab/financial-shared';

import { AiOutlineBars } from 'react-icons/ai';
import { Dropdown, Tag, type TableColumnProps } from 'antd';
import dayjs from 'dayjs';

import { formatBrlMoney } from '../../utils/functions';
import { actionEnum, statusEnum, typeEnum } from './billEnums';
import type { BillActions } from '../../hooks/useBillActions';
import { RxDragHandleDots1 } from "react-icons/rx";

export type ActionKey = 'checkPaid' | 'checkPending' | 'edit' | 'delete';

export const columns = ({
  billActions,
  handleActions,
}: {
  billActions: BillActions;
  handleActions: (action: 'add' | 'edit' | 'delete' | 'closeMonth', bill?: BillWithActions) => void;
}): TableColumnProps<BillWithActions>[] => [
  {
    title: "",
    dataIndex: "drag",
    width: 40,
    render: () => (
      <span className="cursor-grab active:cursor-grabbing opacity-60 hover:opacity-100">
        <RxDragHandleDots1 size={18} />
      </span>
    ),
  },
  {
    title: 'Tipo',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    width: 85,
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
    width: '42%',
    key: 'name',
  },
  {
    title: 'Valor',
    dataIndex: 'amount',
    key: 'amount',
    width: 100,
    render: (amount: number) => formatBrlMoney(amount),
  },
  {
    title: 'Estágio',
    dataIndex: 'currentInstallment',
    key: 'currentInstallment',
    width: 85,
    render: (_, data: BillWithActions) =>
      data.currentInstallment ? `${data.currentInstallment} de ${data.totalInstallments}` : '-',
  },
  {
    title: 'Parcela',
    dataIndex: 'valueInstallment',
    key: 'valueInstallment',
    width: 100,
    render: (valueInstallment: number) =>
      valueInstallment ? formatBrlMoney(valueInstallment) : '-',
  },
  {
    title: 'Vencimento',
    dataIndex: 'dueDate',
    key: 'dueDate',
    width: 120,
    render: (dueDate: Date) => (dueDate ? dayjs(dueDate).format('DD/MM/YYYY') : '-'),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 85,
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
    width: 85,
    render: (actions: ActionKey[], record: BillWithActions) => {
      const items = actionEnum(record, billActions, handleActions)?.filter(
        (action) => action?.key && actions.includes(action.key as ActionKey),
      );

      return (
        <div className='w-full flex justify-center'>
          <Dropdown menu={{ items }} className="cursor-pointer m-auto">
            <AiOutlineBars />
          </Dropdown>
        </div>
      );
    },
  },
];
