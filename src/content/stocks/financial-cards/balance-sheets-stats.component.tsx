import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { DarqubeBalanceSheetResponse } from "../../../types/stock.type";
import { round, shortenNumber } from "../../../util/number.util";
import Divider from "@mui/material/Divider";
import { CardField } from "./components/card-field.component";
import { PeriodLengthSelector } from "./components/period-length-selector.component";

interface BalanceSheetsStatsProps {
  readonly balanceSheet: DarqubeBalanceSheetResponse | undefined;
}

export const BalanceSheetsStats = ({
  balanceSheet,
}: BalanceSheetsStatsProps) => {
  const [period, setPeriod] = useState<"quarterly" | "annually">("quarterly");

  const bs = useMemo(
    () =>
      period === "annually" ? balanceSheet.yearly : balanceSheet.quarterly,
    [balanceSheet, period]
  );

  const { period1 } = useMemo(() => {
    const periods = Object.keys(bs).sort().reverse();
    return {
      period1: periods[0],
    };
  }, [bs]);

  const { data1 } = useMemo(() => {
    const data1 = bs[period1];
    return { data1 };
  }, [bs, period1]);

  const mostRecentPeriod = useMemo(() => {
    return Object.keys(bs).sort().reverse()[0];
  }, [bs]);

  const ratio = round(data1.totalAssets / data1.totalLiab, 2);

  const currentRatio = round(
    data1.totalCurrentAssets / data1.totalCurrentLiabilities,
    2
  );

  const totalCash = data1.cashAndShortTermInvestments;

  const cAssets = data1.totalCurrentAssets;
  const tAssets = data1.totalAssets;
  const cLiab = data1.totalCurrentLiabilities;
  const tLiab = data1.totalLiab;

  const sTDebt = data1.shortTermDebt;
  const tDebt = data1.shortLongTermDebtTotal;

  const bValue = data1.totalStockholderEquity;

  const lTDebt = data1.longTermDebtTotal;

  const stDebtToTotalCash = round(sTDebt / totalCash, 2);

  const debtToTotalCash = round(tDebt / totalCash, 2);

  const bValueToDebt = round(bValue / tDebt);
  const debtToBValue = round(tDebt / bValue);

  return (
    <Card sx={{ width: "100%", maxWidth: "900px" }}>
      <CardHeader
        title={
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="h5">Balance sheet</Typography>
            <Typography variant="caption" sx={{ mt: 0.5, color: "grey" }}>
              ({mostRecentPeriod})
            </Typography>
          </Box>
        }
        action={
          <PeriodLengthSelector
            period={period}
            setPeriod={setPeriod}
            showTTM={false}
          />
        }
      />

      <CardContent>
        <Grid container spacing={4}>
          <Grid item md={6} xs={10}>
            <CardField l="Total cash" v={shortenNumber(totalCash)} />
            <CardField l="Current assets" v={shortenNumber(cAssets)} />
            <CardField
              l="Total assets"
              v={shortenNumber(tAssets)}
              c="green"
              sx={{ mb: 1 }}
            />

            <CardField l="Short term debt" v={shortenNumber(sTDebt)} />
            <CardField l="Current liabilities" v={shortenNumber(cLiab)} />
            <CardField l="Long term debt" v={shortenNumber(lTDebt)} />
            <CardField l="Total liabilities" v={shortenNumber(tLiab)} c="red" />
            <Divider />
            <CardField l="Total debt" v={shortenNumber(tDebt)} />
            <CardField
              l="Book value"
              v={shortenNumber(bValue)}
              c={bValue > 0 ? "green" : "red"}
            />
          </Grid>
          <Grid item md={6} xs={10}>
            <CardField l="Ratio" v={ratio} c={ratio > 1 ? "green" : "red"} />
            <CardField
              l="Current Ratio"
              v={currentRatio}
              c={currentRatio > 1 ? "green" : "red"}
            />

            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Debt
            </Typography>
            <CardField
              l="(Short term debt / Total cash) ratio"
              v={stDebtToTotalCash}
            />
            <CardField l="(Debt / Total cash) ratio" v={debtToTotalCash} />
            <CardField
              l="(Equity / Debt) ratio"
              v={bValueToDebt}
              c={bValueToDebt > 1 ? "red" : "green"}
            />
            <CardField
              l="(Debt / Equity) ratio"
              v={debtToBValue}
              c={debtToBValue > 1 ? "green" : "red"}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
