import { useEffect, useMemo } from "react";
import { Card, Typography } from "antd";
import { formatBrlMoney } from "../../utils/functions";
import { trpc } from "../../utils/trpc";
import { useOffline } from "../../providers/OfflineProvider";
import { SUMMARY_CACHE_KEY } from "../../utils/authConstants";
import { typeEnum } from "../../pages/financial/billEnums";

const { Text, Title } = Typography;

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

  const stats = [
    { key: 'credit', label: 'Credit', value: displayData?.totalCredit, color: typeEnum.credit.color },
    { key: 'debit', label: 'Debit', value: displayData?.totalDebit, color: typeEnum.debit.color },
    { key: 'vital', label: 'Recurring', value: displayData?.totalVital, color: typeEnum.vital.color },
  ];

  return (
    <Card variant="borderless" className="shadow-sm! rounded-2xl mb-4 w-full">
      <Title level={5} className="mb-4!">Summary</Title>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.key} className="flex flex-col gap-1 p-3 rounded-xl bg-black/5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
              <Text type="secondary" className="font-semibold">{stat.label}</Text>
            </div>
            <span className="text-lg font-bold">{formatBrlMoney(stat.value || 0)}</span>
          </div>
        ))}

        <div className="flex flex-col gap-1 p-3 rounded-xl" style={{ backgroundColor: '#53D38826' }}>
          <Text type="secondary" className="font-semibold">Total</Text>
          <span className="text-lg font-bold" style={{ color: '#1f9d5c' }}>
            {formatBrlMoney(displayData?.total || 0)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default Summary;
