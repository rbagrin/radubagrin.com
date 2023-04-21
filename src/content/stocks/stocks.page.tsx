import React, { useState, useCallback } from "react";
import axios from "axios";
import { Chart } from "../../components/Chart.tsx";

export const StocksPage = () => {
  const [text, setText] = useState("");
  const [tickerData, setTickerData] = useState(null);

  const fetchTicker = useCallback(async (ticker) => {
    try {
      const data = (await axios.get(`/api/stocks/${ticker}`)).data;
      setTickerData(data);
    } catch {
      setText("ERROR!");
    }
  }, []);

  return (
    <div>
      {text && <p>!!!!! {text}</p>}
      <Chart data={tickerData} />
      <section>
        <button
          onClick={async () => {
            await fetchTicker("AAPL");
          }}
        >
          Apple
        </button>
        <button
          onClick={async () => {
            await fetchTicker("IBM");
          }}
        >
          IBM
        </button>
      </section>
    </div>
  );
};
