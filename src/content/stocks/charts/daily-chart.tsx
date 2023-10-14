import React from "react";
import { Chart } from "../../../components/Chart";
import { DarqubeTickerMarketData } from "../../../types/stock.type";

export const DailyChart = ({
  tickerData,
  loading,
}: {
  tickerData: DarqubeTickerMarketData[];
  loading: boolean;
}) => {
  return loading ? null : (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {tickerData && <Chart data={tickerData} />}
    </div>
  );
};
