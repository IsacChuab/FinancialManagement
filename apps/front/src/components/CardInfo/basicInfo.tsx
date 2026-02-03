import type { BillWithActions } from '@isac-chuab/financial-shared';

import { Tooltip } from 'antd';

import { formatBrlMoney } from '../../utils/functions';

const BasicInfo = ({ bill }: { bill: BillWithActions }) => {
  return (
    <>
      <div className="flex justify-between">
        <span className="truncate">
          <Tooltip title={bill.name} placement="top">
            <b>{bill.name}</b>
          </Tooltip>
        </span>
        <span>{formatBrlMoney(bill.amount)}</span>
      </div>
    </>
  );
};

export default BasicInfo;
