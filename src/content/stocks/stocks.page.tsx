import React, { useCallback, useEffect, useState } from "react";
import { DailyChart } from "./charts/daily-chart";
import { StockFinancials } from "./sections/stock-financials.section";
import {
  DarqubeTickerMarketData,
  DBStock,
  Ticker,
} from "../../types/stock.type";
import { StockAPI } from "../../api/stock.api";
import { iconSize } from "../../css-style/style";
import { Button } from "../../components/Button";
import { WeeklyChart } from "./charts/weekly-chart";
import { MonthlyChart } from "./charts/monthly-chart";
import { ReactComponent as Pen } from "../../icons/pen.svg";
import IconButton from "@mui/material/IconButton";
import { EditStocksDrawer } from "./edit-stocks-modal.component";
import { Box, Typography } from "@mui/material";
import { Content } from "../../util/components/content.component";
import { Title } from "../../util/components/title.component";

enum ChartType {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}

const CHART_TYPES = [ChartType.Daily, ChartType.Weekly, ChartType.Monthly];

const MenuButton = ({
  buttonName,
  buttonTicker,
  selectedTicker,
  setTicker,
}: {
  buttonName: string;
  buttonTicker: string;
  selectedTicker: string;
  setTicker: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const isCurrentTicker = buttonTicker === selectedTicker;

  return (
    <Button
      color="secondary"
      onClick={() => setTicker(buttonTicker)}
      variant={isCurrentTicker ? "contained" : "outlined"}
    >
      {buttonName}
    </Button>
  );
};

export const StocksPage = () => {
  const [ticker, setTicker] = useState<Ticker>("AAPL");
  const [chartType, setChartType] = useState<Ticker>(CHART_TYPES[0]);
  const [savedStocks, setSavedStocks] = useState<DBStock[]>([]);
  const [tickerData, setTickerData] = useState<DarqubeTickerMarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const refreshSavedStocks = useCallback(async () => {
    try {
      const stocks = await StockAPI.getDBStocks();
      setSavedStocks(stocks);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    refreshSavedStocks();
  }, [refreshSavedStocks]);

  const fetchTicker = useCallback(async (ticker) => {
    try {
      setLoading(true);
      const data = await StockAPI.getDailyDataByTicker(ticker);
      setTickerData(data);
    } catch (e) {
      setErrorMessage(`Something went wrong. ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ticker) fetchTicker(ticker);
  }, [ticker, fetchTicker]);

  return (
    <Content>
      <Title>Stocks page</Title>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="h5">Tickers</Typography>
        <Box sx={{ ml: 2 }}>
          <IconButton
            onClick={() => {
              setIsOpen(true);
            }}
            sx={{ color: "#777", ":hover": { color: "#ddd" } }}
          >
            <Pen {...iconSize} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          gap: 1,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            gap: "5px",
            width: "300px",
            height: "100%",
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          {savedStocks.map((stock) => (
            <MenuButton
              key={stock.ticker}
              buttonName={`${stock.name} (${stock.ticker})`}
              buttonTicker={stock.ticker}
              selectedTicker={ticker}
              setTicker={setTicker}
            />
          ))}
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexGrow: 1,
            justifySelf: "space-between",
            gap: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ height: "50px" }}>
              <div style={{ width: "100%", display: "flex", gap: "10px" }}>
                {CHART_TYPES.map((type, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    onClick={() => setChartType(type)}
                    className={`button button-secondary ${
                      chartType === type ? "" : "button-border"
                    }`}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div style={{ width: "100%", height: "100%", maxHeight: "600px" }}>
              {errorMessage && (
                <Typography variant="subtitle1">{errorMessage}</Typography>
              )}
              {!errorMessage && chartType === ChartType.Daily && (
                <DailyChart loading={loading} tickerData={tickerData} />
              )}
              {!errorMessage && chartType === ChartType.Weekly && (
                <WeeklyChart loading={loading} tickerData={tickerData} />
              )}
              {!errorMessage && chartType === ChartType.Monthly && (
                <MonthlyChart loading={loading} tickerData={tickerData} />
              )}
            </div>
          </div>
        </div>
      </Box>

      <StockFinancials ticker={ticker} />

      {isOpen && (
        <EditStocksDrawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          stocks={savedStocks}
          refresh={refreshSavedStocks}
        />
      )}
    </Content>
  );
};
