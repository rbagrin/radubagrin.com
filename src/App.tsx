import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { Chart } from "./Chart.tsx";

const App = () => {
  const [text, setText] = useState("AAA");
  const [tickerData, setTickerData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const text = (await axios.get("/api")).data;
        setText(text);
      } catch {
        setText("ERROR!");
      }
    })();
  }, []);

  const fetchTicker = useCallback(async (ticker) => {
    try {
      const data = (await axios.get(`/api/stocks/${ticker}`)).data;
      setTickerData(data);
    } catch {
      setText("ERROR!");
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{text}</h1>
        <img src={logo as unknown as string} className="App-logo" alt="logo" />
        <p>In progress...</p>
      </header>

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

export default App;
