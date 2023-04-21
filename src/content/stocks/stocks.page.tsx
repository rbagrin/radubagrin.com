import React, { useState } from "react";
import { DailyChart } from "./charts/daily-chart.tsx";

export const StocksPage = () => {
  const [ticker, setTicker] = useState<Ticker>('AAPL');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', backgroundColor: '#bbb' }}>
      <header style={{ width: '100%', backgroundColor: '#888', height: '50px'}}>Header here</header>

      <div style={{ display: 'flex', flexGrow: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '300px', backgroundColor: '#F86', height: '100'}}>
          <button onClick={() => setTicker('AAPL')} disabled={ticker === 'AAPL'}>APPL</button>
          <button onClick={() => setTicker('AMD')} disabled={ticker === 'AMD'}>AMD</button>
          <button onClick={() => setTicker('IBM')} disabled={ticker === 'IBM'}>IBM</button>
        </div>

        <div style={{ width: '100%', display: 'flex', flexGrow: 1, justifySelf: 'space-between', gap: '10px' }}>
          <div style={{ width: '100%' }}>
            <div style={{width: '100%', backgroundColor: '#999', height: '50px'}}>Chart TABS here</div>
            <div>
              <DailyChart ticker={ticker} />
            </div>
          </div>

          <div style={{ width: '100%', flexGrow: 1, backgroundColor: '#aaa'}}>Other data here</div>
        </div>

      </div>
    </div>
  );
};
