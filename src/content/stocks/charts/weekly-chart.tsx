import React, { useMemo } from "react";
import { Chart } from "../../../components/Chart";
import { DarqubeTickerMarketData } from "../../../types/stock.type";

const getWeekNo = function (d: Date): number {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

export const WeeklyChart = ({
  tickerData,
  loading,
}: {
  tickerData: DarqubeTickerMarketData[];
  loading: boolean;
}) => {
  const weeklyData = useMemo(() => {
    const weeksSet = new Set();
    return tickerData.filter((d) => {
      const date = new Date(d.time * 1000);
      const year = date.getFullYear();
      const weekCode = year * 100 + getWeekNo(date);
      if (!weeksSet.has(weekCode)) {
        weeksSet.add(weekCode);
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
      {weeklyData && <Chart data={weeklyData} />}
    </div>
  );
};
