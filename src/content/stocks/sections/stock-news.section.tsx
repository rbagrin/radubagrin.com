import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StockAPI } from "../../../api/stock.api";
import {
  IEXCloudBalanceSheet,
  IEXCloudIncomeStatement,
  NewsFeedItem,
} from "../../../types/stock.type";
import { BarChart } from "../../../components/BarChart";

export const StockNews = ({ ticker }: { ticker: string }) => {
  const [news, setNews] = useState<NewsFeedItem[]>([]);
  const [incomeStatement, setIncomeStatement] = useState<
    IEXCloudIncomeStatement[]
  >([]);

  const [balanceSheet, setBalanceSheet] = useState<IEXCloudBalanceSheet[]>([]);

  const [frequency, setFrequency] = useState<"quarterly" | "annual">(
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

  const fetchIncomeStatement = useCallback(async () => {
    try {
      const last = frequency === "quarterly" ? 8 : 10;
      const incomeStatement = await StockAPI.getStockIncomeStatement(
        ticker,
        frequency,
        last
      );
      setIncomeStatement(incomeStatement);
    } catch (error) {
      console.error(error);
    }
  }, [ticker, frequency]);

  const fetchBalanceSheet = useCallback(async () => {
    try {
      const last = frequency === "quarterly" ? 8 : 10;
      const balanceSheet = await StockAPI.getStockBalanceSheet(
        ticker,
        frequency,
        last
      );
      setBalanceSheet(balanceSheet);
    } catch (error) {
      console.error(error);
    }
  }, [ticker, frequency]);

  useEffect(() => {
    fetchIncomeStatement();
  }, [fetchIncomeStatement]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    fetchBalanceSheet();
  }, [fetchBalanceSheet]);

  const incomeStatementChartData = useMemo(() => {
    const labels = incomeStatement.map((d) => d.reportDate).reverse();
    const netIncomeDataSet = {
      label: "Net income",
      data: incomeStatement.map((d) => d.netIncome).reverse(),
      backgroundColor: ["yellow"],
    };
    const totalRevenueDataSet = {
      label: "Total revenue",
      data: incomeStatement.map((d) => d.totalRevenue).reverse(),
      backgroundColor: ["blue"],
    };

    const grossProfitDataSet = {
      label: "Gross profit",
      data: incomeStatement.map((d) => d.grossProfit).reverse(),
      backgroundColor: ["green"],
    };

    return {
      labels,
      datasets: [totalRevenueDataSet, grossProfitDataSet, netIncomeDataSet],
    };
  }, [incomeStatement]);

  const balanceSheetChartData = useMemo(() => {
    const labels = balanceSheet.map((d) => d.reportDate).reverse();
    const totalAssetsDataSet = {
      label: "Total assets",
      data: balanceSheet.map((d) => d.totalAssets).reverse(),
      backgroundColor: ["blue"],
    };
    const currentAssetsDataSet = {
      label: "Current assets",
      data: balanceSheet.map((d) => d.currentAssets).reverse(),
      backgroundColor: ["#5762ff"],
    };

    const totalLiabilitiesDataSet = {
      label: "Total liabilities",
      data: balanceSheet.map((d) => d.totalLiabilities).reverse(),
      backgroundColor: ["red"],
    };

    const totalCurrentLiabilitiesDataSet = {
      label: "Total current liabilities",
      data: balanceSheet.map((d) => d.totalCurrentLiabilities).reverse(),
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
  }, [balanceSheet]);

  return (
    <div
      style={{
        width: "100%",
        paddingLeft: 2,
        paddingRight: 2,
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <button
          onClick={() => setFrequency("quarterly")}
          // disabled={incomeStatementFrequency === "quarterly"}
          className={frequency === "quarterly" ? "" : "secondary"}
        >
          Quarterly
        </button>
        <button
          onClick={() => setFrequency("annual")}
          // disabled={incomeStatementFrequency === "annual"}
          className={frequency === "annual" ? "" : "secondary"}
        >
          Annual
        </button>
      </div>
      <BarChart title="Income statement" chartData={incomeStatementChartData} />

      <BarChart title="Balance sheet" chartData={balanceSheetChartData} />

      <div style={{ height: "50px" }}>
        <p style={{ fontWeight: 700, fontSize: 24, padding: 1 }}>
          {ticker} News
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {news &&
          news.map((item, index) => (
            <div key={index}>
              <div>
                <p style={{ marginBottom: 1, fontWeight: 700 }}>{item.title}</p>
                <div style={{ display: "flex", gap: 2 }}>
                  <div>
                    <img
                      alt={item.title}
                      width="200px"
                      src={item.banner_image}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <p>{item.summary}</p>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <p>
                        <a href={item.url} target="_blank" rel="noreferrer">
                          {item.source}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
