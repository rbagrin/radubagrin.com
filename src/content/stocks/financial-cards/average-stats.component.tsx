import React, { useMemo } from "react";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import {
  DarqubeIncomeStatementResponse,
  DarqubeTickerMarketData,
  ISODate,
  Ticker,
} from "../../../types/stock.type";
import { shortenNumber } from "../../../util/number.util";

interface AverageStatsProps {
  readonly ticker: Ticker;
  readonly incomeStatement: DarqubeIncomeStatementResponse;
  readonly tickerData: DarqubeTickerMarketData[];
}

const getDailyPriceData = (
  data: DarqubeTickerMarketData[]
): Record<ISODate, number> => {
  return data.reduce((result, { time, open }): Record<ISODate, number> => {
    const date = new Date(time * 1000).toISOString().split("T")[0];
    result[date] = open;
    return result;
  }, {} as Record<ISODate, number>);
};

export const AverageStats = ({
  ticker,
  incomeStatement,
  tickerData,
}: AverageStatsProps) => {
  const allEarnings = useMemo(() => {
    const keys = Object.keys(incomeStatement.quarterly);

    return keys.map((key) => ({
      key: key,
      value: incomeStatement.quarterly[key].netIncome,
    }));
  }, [incomeStatement]);

  const priceArray = useMemo(() => getDailyPriceData(tickerData), [tickerData]);

  // TODO: @PE to get average: use darqube EPS historical to get EPS
  // then use formula:
  //  for each day:
  //    PE = Day Price / sum of last 4 quarters EPS.
  // having these - then calculate the average
  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader
        title={
          <Box>
            <Typography variant="h5">Average stats</Typography>
            <Typography variant="h6" sx={{ color: "grey" }}>
              {ticker}
            </Typography>
          </Box>
        }
      />

      <CardContent>
        <Box>
          {allEarnings.map((i) => {
            const keyDate = new Date(i.key);
            const keyDate1DayBefore = new Date(keyDate);
            keyDate1DayBefore.setDate(keyDate1DayBefore.getDate() - 1);
            const keyDate1DayAfter = new Date(keyDate);
            keyDate1DayAfter.setDate(keyDate1DayAfter.getDate() + 1);
            const keyDate2DaysAfter = new Date(keyDate);
            keyDate2DaysAfter.setDate(keyDate2DaysAfter.getDate() + 2);

            const price =
              priceArray[i.key] ??
              priceArray[keyDate1DayBefore.toISOString().split("T")[0]] ??
              priceArray[keyDate1DayAfter.toISOString().split("T")[0]] ??
              priceArray[keyDate2DaysAfter.toISOString().split("T")[0]];

            return (
              <Box key={i.key} sx={{ display: "flex", gap: 2 }}>
                <Typography>Date: {i.key} | </Typography>
                <Typography>
                  Net Income: {i.value ? shortenNumber(i.value) : "-"} |
                </Typography>
                <Typography>Price: {price}</Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};
