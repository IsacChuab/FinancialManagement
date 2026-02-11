import { Typography } from "antd";
import { formatBrlMoney } from "../../utils/functions";
import { trpc } from "../../utils/trpc";

const { Text } = Typography;

const Summary = () => {
  const { data } = trpc.bill.summary.useQuery();

  return (
  <div className="flex flex-col gap-4 p-4 border border-gray-400 shadow-sm rounded-xl mb-4 lg:w-1/2">
      <h2 className="text-md font-bold">Resumo</h2>
      <div className="flex flex-col justify-between md:gap-4 lg:flex-row">
      <div className="flex justify-between lg:gap-2">
        <Text type="secondary" className="font-semibold">Crédito:</Text>
        <span className="font-bold">{formatBrlMoney(data?.totalCredit || 0)}</span>
      </div>
      <div className="flex justify-between lg:gap-2">
        <Text type="secondary" className="font-semibold">Débito:</Text>
        <span className="font-bold">{formatBrlMoney(data?.totalDebit || 0)}</span>
      </div>
      <div className="flex justify-between lg:gap-2">
        <Text type="secondary" className="font-semibold">Vitalício:</Text>
        <span className="font-bold">{formatBrlMoney(data?.totalVital || 0)}</span>
      </div>
      <div className="flex justify-between lg:gap-2">
        <Text type="secondary" className="font-semibold">Total:</Text>
        <span className="font-bold">{formatBrlMoney(data?.total || 0)}</span>
      </div>

      </div>
  </div>
  );
};

export default Summary;