import React, { useMemo } from "react";
import { Chart } from "../../../components/Chart";
import { DarqubeTickerMarketData } from "../../../types/stock.type";

export const MonthlyChart = ({
  tickerData,
  loading,
}: {
  tickerData: DarqubeTickerMarketData[];
  loading: boolean;
}) => {
  const monthlyData = useMemo(() => {
    const monthSet = new Set();

    return tickerData.filter((d) => {
      const date = new Date(d.time * 1000);
      const year = date.getFullYear();
      const monthCode = year * 100 + date.getMonth();
      if (!monthSet.has(monthCode)) {
        monthSet.add(monthCode);
        return true;
      }
      return false;
    });
  }, [tickerData]);

  return loading ? null : (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {monthlyData && <Chart data={monthlyData} />}
    </div>
  );
};
