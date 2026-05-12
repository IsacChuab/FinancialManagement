import { useEffect, useMemo } from "react";
import { Typography } from "antd";
import { formatBrlMoney } from "../../utils/functions";
import { trpc } from "../../utils/trpc";
import { useOffline } from "../../providers/OfflineProvider";
import { SUMMARY_CACHE_KEY } from "../../utils/authConstants";

const { Text } = Typography;

const Summary = () => {
  const { isOffline } = useOffline();
  const { data } = trpc.bill.summary.useQuery(undefined, {
    enabled: !isOffline,
  });

  useEffect(() => {
    if (data) {
      localStorage.setItem(SUMMARY_CACHE_KEY, JSON.stringify(data));
    }
  }, [data]);

  type SummaryData = NonNullable<typeof data>;
  const displayData = useMemo<SummaryData | null>(() => {
    if (!isOffline) {
      return data ?? null;
    }

    const cached = localStorage.getItem(SUMMARY_CACHE_KEY);
    return cached ? (JSON.parse(cached) as SummaryData) : null;
  }, [isOffline, data]);

  return (
    <div className="flex flex-col gap-4 p-4 border border-gray-400 shadow-sm rounded-xl mb-4 lg:w-3/4">
      <h2 className="text-md font-bold">Resumo</h2>
      <div className="flex flex-col justify-between md:gap-4 lg:flex-row">
        <div className="flex justify-between lg:gap-2">
          <Text type="secondary" className="font-semibold">Crédito:</Text>
          <span className="font-bold">{formatBrlMoney(displayData?.totalCredit || 0)}</span>
        </div>
        <div className="flex justify-between lg:gap-2">
          <Text type="secondary" className="font-semibold">Débito:</Text>
          <span className="font-bold">{formatBrlMoney(displayData?.totalDebit || 0)}</span>
        </div>
        <div className="flex justify-between lg:gap-2">
          <Text type="secondary" className="font-semibold">Vitalício:</Text>
          <span className="font-bold">{formatBrlMoney(displayData?.totalVital || 0)}</span>
        </div>
        <div className="flex justify-between lg:gap-2">
          <Text type="secondary" className="font-semibold">Total:</Text>
          <span className="font-bold">{formatBrlMoney(displayData?.total || 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default Summary;
