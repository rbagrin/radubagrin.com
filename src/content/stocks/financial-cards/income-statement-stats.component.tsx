import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import {
  DarqubeIncomeStatement,
  DarqubeIncomeStatementResponse,
} from "../../../types/stock.type";
import { round } from "../../../util/number.util";
import { CardField } from "./components/card-field.component";
import { PeriodListing } from "./components/period-listing.component";
import { PeriodLengthSelector } from "./components/period-length-selector.component";
import { getTTM } from "../stocks.util";

interface IncomeStatementStatsProps {
  readonly incomeStatement: DarqubeIncomeStatementResponse | undefined;
}

export const IncomeStatementStats = ({
  incomeStatement,
}: IncomeStatementStatsProps) => {
  const [period, setPeriod] = useState<"quarterly" | "annually" | "ttm">("ttm");

  const iS = useMemo(
    () =>
      period === "annually"
        ? incomeStatement.yearly
        : incomeStatement.quarterly,
    [incomeStatement, period]
  );

  const {
    period1,
    period2,
    period3,
    period4,
    period5,
    period6,
    period7,
    period8,
  } = useMemo(() => {
    const periods = Object.keys(iS).sort().reverse();
    return {
      period1: periods[0],
      period2: periods[1],
      period3: periods[2],
      period4: periods[3],
      period5: periods[4],
      period6: periods[5],
      period7: periods[6],
      period8: periods[7],
    };
  }, [iS]);

  const { data1, data2, data3, data4, data5 } = useMemo(() => {
    const data1 =
      period !== "ttm"
        ? iS[period1]
        : getTTM<DarqubeIncomeStatement>(
            iS[period1],
            iS[period2],
            iS[period3],
            iS[period4]
          );
    const data2 =
      period !== "ttm"
        ? iS[period2]
        : getTTM<DarqubeIncomeStatement>(
            iS[period2],
            iS[period3],
            iS[period4],
            iS[period5]
          );
    const data3 =
      period !== "ttm"
        ? iS[period3]
        : getTTM<DarqubeIncomeStatement>(
            iS[period3],
            iS[period4],
            iS[period5],
            iS[period6]
          );
    const data4 =
      period !== "ttm"
        ? iS[period4]
        : getTTM<DarqubeIncomeStatement>(
            iS[period4],
            iS[period5],
            iS[period6],
            iS[period7]
          );
    const data5 =
      period !== "ttm"
        ? iS[period5]
        : getTTM<DarqubeIncomeStatement>(
            iS[period5],
            iS[period6],
            iS[period7],
            iS[period8]
          );

    return { data1, data2, data3, data4, data5 };
  }, [
    iS,
    period,
    period1,
    period2,
    period3,
    period4,
    period5,
    period6,
    period7,
    period8,
  ]);

  const revenueGrowthYoY = round(
    (data1.totalRevenue / data5.totalRevenue) * 100 - 100,
    2
  );

  const netIncomeGrowthYoY = round(
    (data1.netIncome / data5.netIncome) * 100 - 100,
    2
  );

  return (
    <Card sx={{ width: "100%", maxWidth: "900px" }}>
      <CardHeader
        title={
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="h5">Income statement</Typography>
            <Typography variant="caption" sx={{ color: "grey", mt: 0.5 }}>
              ({period1})
            </Typography>
          </Box>
        }
        action={<PeriodLengthSelector period={period} setPeriod={setPeriod} />}
      />

      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <PeriodListing
            title="Revenue"
            value1={data1.totalRevenue}
            period1={period1}
            value2={data2.totalRevenue}
            period2={period2}
            value3={data3.totalRevenue}
            period3={period3}
            value4={data4.totalRevenue}
            period4={period4}
            value5={data5.totalRevenue}
            period5={period5}
          />
          <PeriodListing
            title="Gross profit"
            value1={data1.grossProfit}
            period1={period1}
            value2={data2.grossProfit}
            period2={period2}
            value3={data3.grossProfit}
            period3={period3}
            value4={data4.grossProfit}
            period4={period4}
            value5={data5.grossProfit}
            period5={period5}
          />
          <PeriodListing
            title="Operating income"
            value1={data1.operatingIncome}
            period1={period1}
            value2={data2.operatingIncome}
            period2={period2}
            value3={data3.operatingIncome}
            period3={period3}
            value4={data4.operatingIncome}
            period4={period4}
            value5={data5.operatingIncome}
            period5={period5}
          />
          <PeriodListing
            title="Net income"
            value1={data1.netIncome}
            period1={period1}
            value2={data2.netIncome}
            period2={period2}
            value3={data3.netIncome}
            period3={period3}
            value4={data4.netIncome}
            period4={period4}
            value5={data5.netIncome}
            period5={period5}
          />
        </Box>

        <Grid container spacing={4}>
          <Grid item md={6} xs={10}>
            {period !== "annually" && (
              <CardField
                l={"Revenue growth YoY"}
                v={`${revenueGrowthYoY > 0 ? "+" : ""}${revenueGrowthYoY}%`}
                c={revenueGrowthYoY > 0 ? "green" : "red"}
              />
            )}
            {period !== "annually" && (
              <CardField
                l={"Net income growth YoY"}
                v={`${netIncomeGrowthYoY > 0 ? "+" : ""}${netIncomeGrowthYoY}%`}
                c={netIncomeGrowthYoY > 0 ? "green" : "red"}
              />
            )}
          </Grid>

          <Grid item md={6} xs={10}>
            {/*<CardField l="TODO" v={"todo"} />*/}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
