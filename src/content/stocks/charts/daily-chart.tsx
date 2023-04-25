import React, { useState, useCallback, useEffect } from "react";
import { StockAPI } from "../../../api/stock.api";
import { Chart } from "../../../components/Chart";
import Box from "@mui/material/Box";

export const DailyChart = ({ ticker }: { ticker: Ticker}) => {
  const [text, setText] = useState("");
  const [tickerData, setTickerData] = useState<TimeSeriesDailyAdjustedResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTicker = useCallback(async (ticker) => {
    try {
        setLoading(true);
      const data = await StockAPI.getDailyAdjustedDataByTicker(ticker);
      setTickerData(data);
    } catch {
      setText("ERROR!");
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTicker(ticker);
  }, [ticker, fetchTicker])

  return loading ? null : (
    <Box sx={{ width: '100%' }}>
      {text && <p>!!!!! {text}</p>}
      {tickerData && <Chart data={tickerData} />}
    </Box>
  );
};
