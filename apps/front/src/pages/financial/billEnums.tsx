import type { BillWithActions } from '@isac-chuab/financial-shared';

import { AiFillDelete, AiFillEdit, AiOutlineCheck, AiOutlineDollar } from 'react-icons/ai';
import { MdCalendarMonth, MdOutlineAttachMoney } from 'react-icons/md';
import { FaRegCreditCard } from 'react-icons/fa6';

import type { BillActions } from '../../hooks/useBillActions';

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
  },
  late: {
    label: 'Atrasado',
    color: '#c40606',
  },
  pending: {
    label: 'Pendente',
    color: '#f0a01f',
  },
};

export const actionEnum = (
  bill: BillWithActions,
  actions: BillActions,
  handleEdit: (bill: BillWithActions) => void,
  handleDelete: (bill: BillWithActions) => void,
) => [
  {
    key: 'checkPaid',
    label: 'Quitar',
    icon: <AiOutlineCheck />,
    actionCard: (
      <div
        key="checkPaid"
        className="flex items-center gap-2 justify-center"
        onClick={() => actions.updateStatus(bill.id, 'paid')}
      >
        Quitar
      </div>
    ),
    onClick: () => actions.updateStatus(bill.id, 'paid'),
  },
  {
    key: 'checkPending',
    label: 'Em aberto',
    icon: <AiOutlineDollar />,
    actionCard: (
      <div
        key="checkPending"
        className="flex items-center gap-2 justify-center"
        onClick={() => actions.updateStatus(bill.id, 'pending')}
      >
        Em aberto
      </div>
    ),
    onClick: () => actions.updateStatus(bill.id, 'pending'),
  },
  {
    key: 'edit',
    label: 'Editar',
    icon: <AiFillEdit />,
    actionCard: (
      <div
        key="edit"
        className="flex items-center gap-2 justify-center"
        onClick={() => handleEdit(bill)}
      >
        Editar
      </div>
    ),
    onClick: () => handleEdit(bill),
  },
  {
    key: 'delete',
    label: 'Excluir',
    icon: <AiFillDelete />,
    actionCard: (
      <div
        key="delete"
        className="flex items-center gap-2 justify-center"
        onClick={() => handleDelete(bill)}
      >
        Excluir
      </div>
    ),
    onClick: () => handleDelete(bill),
  },
];
