import type { BillWithActions } from '@financial/shared';

import { Card, Tag } from 'antd';

import { actionEnum, statusEnum, typeEnum } from '../../pages/financial/billEnums';
import type { BillActions } from '../../hooks/useBillActions';
import type { ActionKey } from '../../pages/financial/dashboardColumns';
import CreditInfo from './creditInfo';
import BasicInfo from './basicInfo';
import VitalInfo from './vitalInfo';

const InfoBills = ({
  bill,
  handleActions,
  handleEdit,
  handleDelete,
  loading,
}: {
  bill: BillWithActions;
  handleActions: BillActions;
  handleEdit: (bill: BillWithActions) => void;
  handleDelete: (bill: BillWithActions) => void;
  loading: boolean;
}) => {
  const title = () => {
    return (
      <div className="flex items-center gap-2">
        {typeEnum[bill.type].icon} {typeEnum[bill.type].label}
      </div>
    );
  };

  const statusInfo = () => {
    const statusItem = statusEnum[bill.status];

    return (
      <Tag color={statusItem.color} key={bill.status} className="w-full text-center!">
        {statusItem.label}
      </Tag>
    );
  };

  const actionsList = () => {
    const items = actionEnum(bill, handleActions, handleEdit, handleDelete)?.filter(
      (action) => action?.key && bill.actions.includes(action.key as ActionKey),
    );

    return items?.map((item) => item.actionCard);
  };

  return (
    <Card
      title={title()}
      extra={statusInfo()}
      variant="borderless"
      loading={loading}
      actions={actionsList()}
    >
      <div className="h-24 flex flex-col gap-1">
        <BasicInfo bill={bill} />

        {bill.type === 'credit' && <CreditInfo bill={bill} />}

        {bill.type === 'vital' && <VitalInfo bill={bill} />}
      </div>
    </Card>
  );
};

export default InfoBills;
