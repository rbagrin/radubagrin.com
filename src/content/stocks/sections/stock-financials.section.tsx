import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StockAPI } from "../../../api/stock.api";
import {
  DarqubeBalanceSheetResponse,
  DarqubeIncomeStatementResponse,
  TickerNewsItem,
} from "../../../types/stock.type";
import { BarChart } from "../../../components/BarChart";

export const StockFinancials = ({ ticker }: { ticker: string }) => {
  const [news, setNews] = useState<TickerNewsItem[]>([]);
  const [incomeStatement, setIncomeStatement] =
    useState<DarqubeIncomeStatementResponse>(undefined);
  const [items, setItems] = useState(12);

  const [balanceSheet, setBalanceSheet] =
    useState<DarqubeBalanceSheetResponse>(undefined);

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

  return (
    <div
      style={{
        width: "100%",
        paddingLeft: 2,
        paddingRight: 2,
        overflowY: "auto",
      }}
    >
      <h3>Financials</h3>
      <div style={{ display: "flex", gap: "20px" }}>
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

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setItems((prev) => prev + 1)}>+</button>
          <button onClick={() => setItems((prev) => prev - 1)}>-</button>
        </div>
      </div>
      {incomeStatementChartData && (
        <BarChart
          title="Income statement"
          chartData={incomeStatementChartData}
        />
      )}

      {balanceSheetChartData && (
        <BarChart title="Balance sheet" chartData={balanceSheetChartData} />
      )}

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
                  {item.img && (
                    <div>
                      <img alt={item.title} width="200px" src={item.img} />
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    {item.summary && <p>{item.summary}</p>}
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>
                        <a href={item.url} target="_blank" rel="noreferrer">
                          {item.source}
                        </a>
                      </p>
                      <p>
                        Published at:{" "}
                        {new Date(item.publishedAt).toLocaleDateString()}
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
