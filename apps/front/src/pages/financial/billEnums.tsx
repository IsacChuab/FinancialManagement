import type { BillWithActions } from '@isac-chuab/financial-shared';

import { AiFillDelete, AiFillEdit, AiOutlineCheck, AiOutlineDollar } from 'react-icons/ai';
import { MdCalendarMonth, MdOutlineAttachMoney } from 'react-icons/md';
import { FaRegCreditCard } from 'react-icons/fa6';
import { Spin } from 'antd';

import type { BillActions } from '../../hooks/useBillActions';
import { cn } from '../../utils/cn';

export const typeEnum = {
  debit: {
    label: 'Débito',
    color: '#20d0f7',
    icon: <MdOutlineAttachMoney />,
  },
  credit: {
    label: 'Crédito',
    color: '#b622f5',
    icon: <FaRegCreditCard />,
  },
  vital: {
    label: 'Vitalício',
    color: '#00ab22',
    icon: <MdCalendarMonth />,
  },
};

export const statusEnum = {
  paid: {
    label: 'Pago',
    color: '#53D388',
    shadowClass: 'shadow-green-500',
  },
  late: {
    label: 'Atrasado',
    color: '#c40606',
    shadowClass: 'shadow-red-600',
  },
  pending: {
    label: 'Pendente',
    color: '#f0a01f',
    shadowClass: 'shadow-amber-500',
  },
};

export const actionEnum = (
  bill: BillWithActions,
  actions: BillActions,
  handleAction: (action: 'add' | 'edit' | 'delete' | 'closeMonth', bill?: BillWithActions) => void,
  disabled = false,
  pendingCheckPaid = false,
  pendingCheckPending = false,
) => [
  {
    key: 'checkPaid',
    label: 'Quitar',
    icon: <AiOutlineCheck />,
    disabled,
    actionCard: (
      <div
        key="checkPaid"
        className={cn('flex items-center gap-2 justify-center', {
          'opacity-40 pointer-events-none cursor-not-allowed': disabled && !pendingCheckPaid,
          'pointer-events-none cursor-not-allowed': pendingCheckPaid,
        })}
        onClick={() => !disabled && actions.updateStatus(bill, 'paid')}
      >
        {pendingCheckPaid ? <Spin size="small" /> : 'Quitar'}
      </div>
    ),
    onClick: () => actions.updateStatus(bill, 'paid'),
  },
  {
    key: 'checkPending',
    label: 'Em aberto',
    icon: <AiOutlineDollar />,
    disabled,
    actionCard: (
      <div
        key="checkPending"
        className={cn('flex items-center gap-2 justify-center', {
          'opacity-40 pointer-events-none cursor-not-allowed': disabled && !pendingCheckPending,
          'pointer-events-none cursor-not-allowed': pendingCheckPending,
        })}
        onClick={() => !disabled && actions.updateStatus(bill, 'pending')}
      >
        {pendingCheckPending ? <Spin size="small" /> : 'Em aberto'}
      </div>
    ),
    onClick: () => actions.updateStatus(bill, 'pending'),
  },
  {
    key: 'edit',
    label: 'Editar',
    icon: <AiFillEdit />,
    disabled,
    actionCard: (
      <div
        key="edit"
        className={cn('flex items-center gap-2 justify-center', {
          'opacity-40 pointer-events-none cursor-not-allowed': disabled,
        })}
        onClick={() => handleAction('edit', bill)}
      >
        Editar
      </div>
    ),
    onClick: () => handleAction('edit', bill),

  },
  {
    key: 'delete',
    label: 'Excluir',
    icon: <AiFillDelete />,
    disabled,
    actionCard: (
      <div
        key="delete"
        className={cn('flex items-center gap-2 justify-center', {
          'opacity-40 pointer-events-none cursor-not-allowed': disabled,
        })}
        onClick={() => handleAction('delete', bill)}
      >
        Excluir
      </div>
    ),
    onClick: () => handleAction('delete', bill),
  },
];
