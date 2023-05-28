import React, { useCallback, useEffect, useState } from "react";
import { DailyChart } from "./charts/daily-chart";
import { StockFinancials } from "./sections/stock-financials.section";
import { Ticker } from "../../types/stock.type";
import { StockAPI } from "../../api/stock.api";
import { MAX_PAGE_WIDTH } from "../../css-style/style";

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
  const className = isCurrentTicker ? "" : "secondary";

  return (
    <button className={className} onClick={() => setTicker(buttonTicker)}>
      {buttonName}
    </button>
  );
};

export const StocksPage = () => {
  const [ticker, setTicker] = useState<Ticker>("AAPL");
  const [chartType, setChartType] = useState<Ticker>(CHART_TYPES[0]);
  const [savedStocks, setSavedStocks] = useState([]);

  const refreshSavedStocks = useCallback(async () => {
    try {
      const stocks = await StockAPI.getStocks();
      setSavedStocks(stocks);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    refreshSavedStocks();
  }, [refreshSavedStocks]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: MAX_PAGE_WIDTH,
      }}
    >
      <header style={{ width: "100%", height: "50px", paddingLeft: "10px" }}>
        <h3>Stocks page</h3>
      </header>

      <div style={{ display: "flex", flexGrow: 1, maxHeight: "900px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            width: "300px",
            height: "100%",
            paddingLeft: "10px",
            paddingRight: "10px",
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
                  <button
                    key={index}
                    onClick={() => setChartType(type)}
                    className={chartType === type ? "" : "outline"}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ width: "100%", height: "100%", maxHeight: "800px" }}>
              {chartType === ChartType.Daily ? (
                <DailyChart ticker={ticker} />
              ) : (
                <div style={{ padding: 4 }}>
                  <p>Coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexGrow: 1,
          marginTop: "50px",
        }}
      >
        <StockFinancials ticker={ticker} />
      </div>
    </div>
  );
};
