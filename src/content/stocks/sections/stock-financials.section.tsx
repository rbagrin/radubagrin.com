import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StockAPI } from "../../../api/stock.api";
import {
  AlphavantageOverviewResponse,
  DarqubeBalanceSheetResponse,
  DarqubeCashFlowResponse,
  DarqubeIncomeStatementResponse,
  TickerNewsItem,
} from "../../../types/stock.type";
import { BarChart } from "../../../components/BarChart";
import { Box, Typography } from "@mui/material";
import { BalanceSheetsStats } from "../financial-cards/balance-sheets-stats.component";
import { IncomeStatementStats } from "../financial-cards/income-statement-stats.component";
import { CashFlowStatementStats } from "../financial-cards/cash-flow-statement-stats.component";
import { OtherStats } from "../financial-cards/other-stats.component";
import { NewsSection } from "./news.section";

export const StockFinancials = ({ ticker }: { ticker: string }) => {
  const [news, setNews] = useState<TickerNewsItem[]>([]);
  const [incomeStatement, setIncomeStatement] =
    useState<DarqubeIncomeStatementResponse>(undefined);
  const [items, setItems] = useState(12);

  const [balanceSheet, setBalanceSheet] =
    useState<DarqubeBalanceSheetResponse>(undefined);
  const [cashFlow, setCashFlow] = useState<DarqubeCashFlowResponse>(undefined);
  const [companyOverview, setCompanyOverview] =
    useState<AlphavantageOverviewResponse>(undefined);

  const [frequency, setFrequency] = useState<"quarterly" | "yearly">(
    "quarterly"
  );

  const fetchNews = useCallback(async () => {
    try {
      const news = await StockAPI.getStockNewsByTicker(ticker);
      setNews(news);
    } catch (error) {
      console.error(error);
    }
  }, [ticker]);

  const fetchCompanyOverview = useCallback(async () => {
    try {
      const companyOverview = await StockAPI.getCompanyOverviewByTicker(ticker);
      setCompanyOverview(companyOverview);
    } catch (error) {
      console.error(error);
    }
  }, [ticker]);

  const fetchIncomeStatement = useCallback(async () => {
    try {
      const incomeStatement = await StockAPI.getStockIncomeStatement(ticker);
      setIncomeStatement(incomeStatement);
    } catch (error) {
      console.error(error);
    }
  }, [ticker]);

  const fetchBalanceSheet = useCallback(async () => {
    try {
      const balanceSheet = await StockAPI.getStockBalanceSheet(ticker);
      setBalanceSheet(balanceSheet);
    } catch (error) {
      console.error(error);
    }
  }, [ticker]);

  const fetchCashFlow = useCallback(async () => {
    try {
      const cashFlow = await StockAPI.getStockCashFlow(ticker);
      setCashFlow(cashFlow);
    } catch (error) {
      console.error(error);
    }
  }, [ticker]);

  useEffect(() => {
    Promise.all([
      fetchIncomeStatement(),
      fetchBalanceSheet(),
      fetchCashFlow(),
      fetchNews(),
      fetchCompanyOverview(),
    ]);
  }, [
    fetchIncomeStatement,
    fetchBalanceSheet,
    fetchCashFlow,
    fetchNews,
    fetchCompanyOverview,
  ]);

  const incomeStatementChartData = useMemo(() => {
    if (!incomeStatement) return undefined;
    const responseData = incomeStatement[frequency];
    const labels = Object.keys(responseData).slice(-1 * items);

    const netIncome = labels.map((date) => responseData[date]?.netIncome ?? 0);
    const totalRevenue = labels.map(
      (date) => responseData[date]?.totalRevenue ?? 0
    );
    const grossProfit = labels.map(
      (date) => responseData[date]?.grossProfit ?? 0
    );

    const netIncomeDataSet = {
      label: "Net income",
      data: netIncome,
      backgroundColor: ["yellow"],
    };
    const totalRevenueDataSet = {
      label: "Total revenue",
      data: totalRevenue,
      backgroundColor: ["blue"],
    };

    const grossProfitDataSet = {
      label: "Gross profit",
      data: grossProfit,
      backgroundColor: ["green"],
    };

    return {
      labels,
      datasets: [totalRevenueDataSet, grossProfitDataSet, netIncomeDataSet],
    };
  }, [incomeStatement, frequency, items]);

  const balanceSheetChartData = useMemo(() => {
    if (!balanceSheet) return undefined;
    const responseData = balanceSheet[frequency];
    const labels = Object.keys(responseData).slice(-1 * items);

    const totalAssets = labels.map(
      (date) => responseData[date]?.totalAssets ?? 0
    );
    const totalLiabilities = labels.map(
      (date) => responseData[date]?.totalLiab ?? 0
    );

    const currentAssets = labels.map(
      (date) => responseData[date]?.totalCurrentAssets ?? 0
    );
    const currentLiabilities = labels.map(
      (date) => responseData[date]?.totalCurrentLiabilities ?? 0
    );
    const totalAssetsDataSet = {
      label: "Total assets",
      data: totalAssets,
      backgroundColor: ["blue"],
    };
    const currentAssetsDataSet = {
      label: "Current assets",
      data: currentAssets,
      backgroundColor: ["#5762ff"],
    };

    const totalLiabilitiesDataSet = {
      label: "Total liabilities",
      data: totalLiabilities,
      backgroundColor: ["red"],
    };

    const totalCurrentLiabilitiesDataSet = {
      label: "Total current liabilities",
      data: currentLiabilities,
      backgroundColor: ["#ff3838"],
    };

    return {
      labels,
      datasets: [
        totalAssetsDataSet,
        totalLiabilitiesDataSet,
        currentAssetsDataSet,
        totalCurrentLiabilitiesDataSet,
      ],
    };
  }, [balanceSheet, frequency, items]);

  const cashFlowStatementChartData = useMemo(() => {
    if (!cashFlow) return undefined;
    const responseData = cashFlow[frequency];
    const labels = Object.keys(responseData).slice(-1 * items);

    const freeCashFlow = labels.map(
      (date) => responseData[date]?.freeCashFlow ?? 0
    );
    const totalCashFromOperatingActivities = labels.map(
      (date) => responseData[date]?.totalCashFromOperatingActivities ?? 0
    );
    const totalCashflowsFromInvestingActivities = labels.map(
      (date) => responseData[date]?.totalCashflowsFromInvestingActivities ?? 0
    );
    const totalCashFromFinancingActivities = labels.map(
      (date) => responseData[date]?.totalCashFromFinancingActivities ?? 0
    );

    const freeCashFlowDataSet = {
      label: "Free Cash Flow",
      data: freeCashFlow,
      backgroundColor: ["green"],
    };
    const cashFromOperatingActivitiesDataSet = {
      label: "Cash from Operating Activities",
      data: totalCashFromOperatingActivities,
      backgroundColor: ["yellow"],
    };
    const cashFromInvestingActivitiesDataSet = {
      label: "Cash from Investing Activities",
      data: totalCashflowsFromInvestingActivities,
      backgroundColor: ["blue"],
    };
    const cashFromFinancingActivitiesDataSet = {
      label: "Cash from Financing Activities",
      data: totalCashFromFinancingActivities,
      backgroundColor: ["red"],
    };

    return {
      labels,
      datasets: [
        cashFromOperatingActivitiesDataSet,
        cashFromInvestingActivitiesDataSet,
        cashFromFinancingActivitiesDataSet,
        freeCashFlowDataSet,
      ],
    };
  }, [cashFlow, frequency, items]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Financials
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        {balanceSheet && (
          <BalanceSheetsStats ticker={ticker} balanceSheet={balanceSheet} />
        )}
        {incomeStatement && (
          <IncomeStatementStats
            ticker={ticker}
            incomeStatement={incomeStatement}
          />
        )}
        {cashFlow && (
          <CashFlowStatementStats ticker={ticker} cashFlow={cashFlow} />
        )}
        {companyOverview && (
          <OtherStats ticker={ticker} companyOverview={companyOverview} />
        )}
      </Box>

      <Box sx={{ display: "flex", gap: "20px", mb: 2 }}>
        <button
          onClick={() => setFrequency("quarterly")}
          className={`button button-secondary ${
            frequency === "quarterly" ? "" : "button-border"
          }`}
        >
          Quarterly
        </button>
        <button
          onClick={() => setFrequency("yearly")}
          className={`button button-secondary ${
            frequency === "yearly" ? "" : "button-border"
          }`}
        >
          Annual
        </button>

        <Box sx={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setItems((prev) => prev + 1)}>+</button>
          <button onClick={() => setItems((prev) => prev - 1)}>-</button>
        </Box>
      </Box>

      {incomeStatementChartData && (
        <BarChart
          title="Income statement"
          chartData={incomeStatementChartData}
          sx={{ mb: 2 }}
        />
      )}

      {balanceSheetChartData && (
        <BarChart
          title="Balance sheet"
          chartData={balanceSheetChartData}
          sx={{ mb: 2 }}
        />
      )}

      {cashFlowStatementChartData && (
        <BarChart
          title="Cash Flow"
          chartData={cashFlowStatementChartData}
          sx={{ mb: 2 }}
        />
      )}

      <NewsSection ticker={ticker} news={news} />
    </Box>
  );
};
