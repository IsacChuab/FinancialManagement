import type { BillWithActions } from '@isac-chuab/financial-shared';

import { AiFillDelete, AiFillEdit, AiOutlineCheck, AiOutlineDollar } from 'react-icons/ai';
import { MdCalendarMonth, MdOutlineAttachMoney } from 'react-icons/md';
import { FaRegCreditCard } from 'react-icons/fa6';
import { Spin } from 'antd';

import type { BillActions } from '../../hooks/useBillActions';
import { cn } from '../../utils/cn';

export const typeEnum = {
  debit: {
    label: 'Debit',
    color: '#20d0f7',
    icon: <MdOutlineAttachMoney />,
  },
  credit: {
    label: 'Credit',
    color: '#b622f5',
    icon: <FaRegCreditCard />,
  },
  vital: {
    label: 'Recurring',
    color: '#00ab22',
    icon: <MdCalendarMonth />,
  },
};

export const statusEnum = {
  paid: {
    label: 'Paid',
    color: '#53D388',
    shadowClass: 'shadow-green-500',
  },
  late: {
    label: 'Late',
    color: '#c40606',
    shadowClass: 'shadow-red-600',
  },
  pending: {
    label: 'Pending',
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
    label: 'Mark as Paid',
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
        {pendingCheckPaid ? <Spin size="small" /> : 'Mark as Paid'}
      </div>
    ),
    onClick: () => actions.updateStatus(bill, 'paid'),
  },
  {
    key: 'checkPending',
    label: 'Mark as Pending',
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
        {pendingCheckPending ? <Spin size="small" /> : 'Mark as Pending'}
      </div>
    ),
    onClick: () => actions.updateStatus(bill, 'pending'),
  },
  {
    key: 'edit',
    label: 'Edit',
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
        Edit
      </div>
    ),
    onClick: () => handleAction('edit', bill),

  },
  {
    key: 'delete',
    label: 'Delete',
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
        Delete
      </div>
    ),
    onClick: () => handleAction('delete', bill),
  },
];
