import { formatBrlMoney } from '../../utils/functions';
import dayjs from '../../utils/dayjs';
import type { BillWithActions } from '../../../../api/src/billings/billTypes';

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
