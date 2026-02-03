import type { BillWithActions } from '@isac-chuab/financial-shared';

import dayjs from '../../utils/dayjs';

import { formatBrlMoney } from '../../utils/functions';

const CreditInfo = ({ bill }: { bill: BillWithActions }) => {
  return (
    <>
      <div className="flex justify-between">
        <span>
          <b>Data Vencimento</b>
        </span>

        <span>{dayjs(bill?.dueDate).format('DD/MM/YYYY')}</span>
      </div>

      <div className="flex justify-between">
        <span>
          <b>Estágio</b>
        </span>

        <span>{`${bill.currentInstallment}/${bill.totalInstallments}`}</span>
      </div>

      <div className="flex justify-between">
        <span>
          <b>Valor parcela</b>
        </span>

        <span>{formatBrlMoney(bill.valueInstallment)}</span>
      </div>
    </>
  );
};

export default CreditInfo;
