import dayjs from '../../utils/dayjs';
import type { BillWithActions } from '@financial/shared';

const VitalInfo = ({ bill }: { bill: BillWithActions }) => {
  return (
    <>
      <div className="flex justify-between">
        <span>
          <b>Data Vencimento</b>
        </span>

        <span>{dayjs(bill?.dueDate).format('DD/MM/YYYY')}</span>
      </div>
    </>
  );
};

export default VitalInfo;
