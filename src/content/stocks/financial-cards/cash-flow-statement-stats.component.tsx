import React, { useMemo, useState } from "react";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import {
  DarqubeCashFlow,
  DarqubeCashFlowResponse,
  Ticker,
} from "../../../types/stock.type";
import { PeriodLengthSelector } from "./components/period-length-selector.component";
import { getTTM } from "../stocks.util";
import { PeriodListing } from "./components/period-listing.component";
import Divider from "@mui/material/Divider";

interface CashFlowStatementStatsProps {
  readonly ticker: Ticker;
  readonly cashFlow: DarqubeCashFlowResponse;
}

export const CashFlowStatementStats = ({
  ticker,
  cashFlow,
}: CashFlowStatementStatsProps) => {
  const [period, setPeriod] = useState<"quarterly" | "annually" | "ttm">("ttm");

  const CFS = useMemo(
    () => (period === "annually" ? cashFlow.yearly : cashFlow.quarterly),
    [cashFlow, period]
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
    const periods = Object.keys(CFS).sort().reverse();
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
  }, [CFS]);

  const { data1, data2, data3, data4, data5 } = useMemo(() => {
    const data1 =
      period !== "ttm"
        ? CFS[period1]
        : getTTM<DarqubeCashFlow>(
            CFS[period1],
            CFS[period2],
            CFS[period3],
            CFS[period4]
          );
    const data2 =
      period !== "ttm"
        ? CFS[period2]
        : getTTM<DarqubeCashFlow>(
            CFS[period2],
            CFS[period3],
            CFS[period4],
            CFS[period5]
          );
    const data3 =
      period !== "ttm"
        ? CFS[period3]
        : getTTM<DarqubeCashFlow>(
            CFS[period3],
            CFS[period4],
            CFS[period5],
            CFS[period6]
          );
    const data4 =
      period !== "ttm"
        ? CFS[period4]
        : getTTM<DarqubeCashFlow>(
            CFS[period4],
            CFS[period5],
            CFS[period6],
            CFS[period7]
          );
    const data5 =
      period !== "ttm"
        ? CFS[period5]
        : getTTM<DarqubeCashFlow>(
            CFS[period5],
            CFS[period6],
            CFS[period7],
            CFS[period8]
          );

    return { data1, data2, data3, data4, data5 };
  }, [
    CFS,
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

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader
        title={
          <Box>
            <Typography variant="h5">Cash flow statement</Typography>
            <Typography variant="h6" sx={{ color: "grey" }}>
              {ticker}
            </Typography>
          </Box>
        }
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
              mr: 2,
            }}
          >
            <PeriodLengthSelector period={period} setPeriod={setPeriod} />
            <Typography variant="caption" sx={{ color: "grey", mt: 0.5 }}>
              ({period1})
            </Typography>
          </Box>
        }
      />

      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <PeriodListing
            title="Cash from Operating activities"
            value1={data1?.totalCashFromOperatingActivities}
            period1={period1}
            value2={data2?.totalCashFromOperatingActivities}
            period2={period2}
            value3={data3?.totalCashFromOperatingActivities}
            period3={period3}
            value4={data4?.totalCashFromOperatingActivities}
            period4={period4}
            value5={data5?.totalCashFromOperatingActivities}
            period5={period5}
            showPercentage={false}
          />

          <PeriodListing
            title="Cash from Investing activities"
            value1={data1?.totalCashflowsFromInvestingActivities}
            period1={period1}
            value2={data2?.totalCashflowsFromInvestingActivities}
            period2={period2}
            value3={data3?.totalCashflowsFromInvestingActivities}
            period3={period3}
            value4={data4?.totalCashflowsFromInvestingActivities}
            period4={period4}
            value5={data5?.totalCashflowsFromInvestingActivities}
            period5={period5}
            showPercentage={false}
          />
          <PeriodListing
            title="Cash from Financing activities"
            value1={data1?.totalCashFromFinancingActivities}
            period1={period1}
            value2={data2?.totalCashFromFinancingActivities}
            period2={period2}
            value3={data3?.totalCashFromFinancingActivities}
            period3={period3}
            value4={data4?.totalCashFromFinancingActivities}
            period4={period4}
            value5={data5?.totalCashFromFinancingActivities}
            period5={period5}
            showPercentage={false}
          />
          <PeriodListing
            title="Free Cash Flow"
            value1={data1?.freeCashFlow}
            period1={period1}
            value2={data2?.freeCashFlow}
            period2={period2}
            value3={data3?.freeCashFlow}
            period3={period3}
            value4={data4?.freeCashFlow}
            period4={period4}
            value5={data5?.freeCashFlow}
            period5={period5}
            showPercentage={false}
          />

          <Divider />
          <PeriodListing
            title="CAPEX"
            value1={data1?.capitalExpenditures}
            period1={period1}
            value2={data2?.capitalExpenditures}
            period2={period2}
            value3={data3?.capitalExpenditures}
            period3={period3}
            value4={data4?.capitalExpenditures}
            period4={period4}
            value5={data5?.capitalExpenditures}
            period5={period5}
          />
          <PeriodListing
            title="Issuance of Stock"
            value1={data1?.issuanceOfStock}
            period1={period1}
            value2={data2?.issuanceOfStock}
            period2={period2}
            value3={data3?.issuanceOfStock}
            period3={period3}
            value4={data4?.issuanceOfStock}
            period4={period4}
            value5={data5?.issuanceOfStock}
            period5={period5}
            showPercentage={false}
          />
          <PeriodListing
            title="Debt Repayments"
            value1={data1?.netBorrowings}
            period1={period1}
            value2={data2?.netBorrowings}
            period2={period2}
            value3={data3?.netBorrowings}
            period3={period3}
            value4={data4?.netBorrowings}
            period4={period4}
            value5={data5?.netBorrowings}
            period5={period5}
            showPercentage={false}
          />
          <PeriodListing
            title="NET change in Cash"
            value1={data1?.changeInCash}
            period1={period1}
            value2={data2?.changeInCash}
            period2={period2}
            value3={data3?.changeInCash}
            period3={period3}
            value4={data4?.changeInCash}
            period4={period4}
            value5={data5?.changeInCash}
            period5={period5}
            showPercentage={false}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
