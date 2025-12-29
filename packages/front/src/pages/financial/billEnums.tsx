import type { MenuProps } from 'antd';
import { AiFillDelete, AiFillEdit, AiOutlineCheck, AiOutlineDollar } from 'react-icons/ai';
import type { BillActions } from '../../hooks/useBillActions';

export const typeEnum = {
  debit: {
    label: 'Débito',
    color: '#20d0f7',
  },
  credit: {
    label: 'Crédito',
    color: '#b622f5',
  },
  vital: {
    label: 'Vitalício',
    color: '#00ab22',
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

export const actionEnum = (billId: string, actions: BillActions): MenuProps['items'] => [
  {
    key: 'checkPaid',
    label: 'Marcar Pago',
    icon: <AiOutlineCheck />,
    onClick: () => actions.updateStatus(billId, 'paid'),
  },
  {
    key: 'checkPending',
    label: 'Marcar Pendente',
    icon: <AiOutlineDollar />,
    onClick: () => actions.updateStatus(billId, 'pending'),
  },
  {
    key: 'edit',
    label: 'Editar',
    icon: <AiFillEdit />,
    onClick: () => console.log('edit', billId),
  },
  {
    key: 'delete',
    label: 'Excluir',
    icon: <AiFillDelete />,
    onClick: () => actions.deleteBill(billId),
  },
];
