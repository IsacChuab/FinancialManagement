import type { MenuProps } from 'antd';
import { AiFillDelete, AiFillEdit, AiOutlineCheck, AiOutlineDollar } from 'react-icons/ai';

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
  pendent: {
    label: 'Pendente',
    color: '#f0a01f',
  },
};

export const actionEnum: MenuProps['items'] = [
  {
    key: 'checkPaid',
    label: 'Marcar Pago',
    icon: <AiOutlineCheck />,
  },
  {
    key: 'checkPendent',
    label: 'Marcar Pendente',
    icon: <AiOutlineDollar />,
  },
  {
    key: 'edit',
    label: 'Editar',
    icon: <AiFillEdit />,
  },
  {
    key: 'delete',
    label: 'Excluir',
    icon: <AiFillDelete />,
  },
];
