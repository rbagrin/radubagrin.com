import React, { useState } from "react";
import { DailyChart } from "./charts/daily-chart";
import { StockNews } from "./sections/stock-news.section";
import { Ticker } from "../../types/stock.type";

enum ChartType {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}

const CHART_TYPES = [ChartType.Daily, ChartType.Weekly, ChartType.Monthly];
const COMPANIES = [
  { name: "Apple", ticker: "AAPL" },
  { name: "AMD", ticker: "AMD" },
  { name: "Tesla", ticker: "TSLA" },
  { name: "Netflix", ticker: "NFLX" },
  { name: "Amazon", ticker: "AMZN" },
  { name: "Rivian", ticker: "RIVN" },
  { name: "NIO", ticker: "NIO" },
  { name: "Microsoft", ticker: "MSFT" },
  { name: "Nvidia", ticker: "NVDA" },
  { name: "Ford", ticker: "F" },
];

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      <header style={{ width: "100%", height: "50px", paddingLeft: "10px" }}>
        <h3>Stocks page</h3>
      </header>

      <div style={{ display: "flex", flexGrow: 1 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            width: "300px",
            height: "100%",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          {COMPANIES.map((company) => (
            <MenuButton
              key={company.ticker}
              buttonName={`${company.name} (${company.ticker})`}
              buttonTicker={company.ticker}
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
          <div style={{ width: "100%" }}>
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
            <div style={{ width: "100%" }}>
              {chartType === ChartType.Daily ? (
                <DailyChart ticker={ticker} />
              ) : (
                <div style={{ padding: 4 }}>
                  <p>Coming soon...</p>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexGrow: 1,
            }}
          >
            <StockNews ticker={ticker} />
          </div>
        </div>
      </div>
    </div>
  );
};
