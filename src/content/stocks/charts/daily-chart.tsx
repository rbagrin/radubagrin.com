import React, { useState, useCallback, useEffect } from "react";
import { StockAPI } from "../../../api/stock.api";
import { Chart } from "../../../components/Chart";
import { DarqubeTickerMarketData, Ticker } from "../../../types/stock.type";

export const DailyChart = ({ ticker }: { ticker: Ticker }) => {
  const [text, setText] = useState("");
  const [tickerData, setTickerData] = useState<DarqubeTickerMarketData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTicker = useCallback(async (ticker) => {
    try {
      setLoading(true);
      const data = await StockAPI.getDailyDataBySticker(ticker);
      setTickerData(data);
    } catch {
      setText("ERROR!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTicker(ticker);
  }, [ticker, fetchTicker]);

  return loading ? null : (
    <div style={{ width: "100%" }}>
      {text && <p>!!!!! {text}</p>}
      {tickerData && <Chart data={tickerData} />}
    </div>
  );
};
