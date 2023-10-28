import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { DarqubeBalanceSheetResponse, Ticker } from "../../../types/stock.type";
import { round, shortenNumber } from "../../../util/number.util";
import Divider from "@mui/material/Divider";
import { CardField } from "./components/card-field.component";
import { PeriodLengthSelector } from "./components/period-length-selector.component";

interface BalanceSheetsStatsProps {
  readonly ticker: Ticker;

  readonly balanceSheet: DarqubeBalanceSheetResponse | undefined;
}

export const BalanceSheetsStats = ({
  ticker,
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

  const ratio = data1 ? round(data1.totalAssets / data1.totalLiab, 2) : 0;

  const currentRatio = data1
    ? round(data1?.totalCurrentAssets / data1?.totalCurrentLiabilities, 2)
    : 0;

  const totalCash = data1?.cashAndShortTermInvestments ?? 0;

  const cAssets = data1?.totalCurrentAssets ?? 0;
  const tAssets = data1?.totalAssets ?? 0;
  const cLiab = data1?.totalCurrentLiabilities ?? 0;
  const tLiab = data1?.totalLiab ?? 0;

  const sTDebt = data1?.shortTermDebt ?? 0;
  const tDebt = data1?.shortLongTermDebtTotal ?? 0;

  const bValue = data1?.totalStockholderEquity ?? 0;

  const lTDebt = data1?.longTermDebtTotal ?? 0;

  const stDebtToTotalCash = totalCash ? round(sTDebt / totalCash, 2) : 0;

  const debtToTotalCash = totalCash ? round(tDebt / totalCash, 2) : 0;

  const bValueToDebt = tDebt ? round(bValue / tDebt) : 0;
  const debtToBValue = bValue ? round(tDebt / bValue) : 0;

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader
        title={
          <Box>
            <Typography variant="h5">Balance sheet</Typography>
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
            <PeriodLengthSelector
              period={period}
              setPeriod={setPeriod}
              showTTM={false}
            />
            <Typography variant="caption" sx={{ color: "grey", mt: 0.5 }}>
              ({period1})
            </Typography>
          </Box>
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
