import React, { useState } from "react";
import { DailyChart } from "./charts/daily-chart.tsx";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { StockNews } from "./sections/stock-news.section.tsx";

enum ChartType {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly'
}

const CHART_TYPES = [ChartType.Daily, ChartType.Weekly, ChartType.Monthly];

const MenuButton = ({ buttonTicker, selectedTicker, setTicker }: { buttonTicker: string; selectedTicker: string; setTicker: React.Dispatch<React.SetStateAction<string>> }) => {
  const isCurrentTicker = buttonTicker === selectedTicker;
  
  return <Button size="small" variant='contained' color={isCurrentTicker ? 'primary' : 'secondary'} onClick={() => setTicker(buttonTicker)}>{buttonTicker}</Button>
}

export const StocksPage = () => {
  const [ticker, setTicker] = useState<Ticker>('AAPL');
  const [chartType, setChartType] = useState<Ticker>(CHART_TYPES[0]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', backgroundColor: '#bbb' }}>
      <header style={{ width: '100%', backgroundColor: '#888', height: '50px'}}>Header here</header>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '300px', backgroundColor: '#F86', height: '100', p: 2, gap: 1 }}>
          <MenuButton buttonTicker="AAPL" selectedTicker={ticker} setTicker={setTicker} />
          <MenuButton buttonTicker="AMD" selectedTicker={ticker} setTicker={setTicker} />
          <MenuButton buttonTicker="TSLA" selectedTicker={ticker} setTicker={setTicker} />
          <MenuButton buttonTicker="NFLX" selectedTicker={ticker} setTicker={setTicker} />
          <MenuButton buttonTicker="AMZN" selectedTicker={ticker} setTicker={setTicker} />
          <MenuButton buttonTicker="RIVN" selectedTicker={ticker} setTicker={setTicker} />
          <MenuButton buttonTicker="NIO" selectedTicker={ticker} setTicker={setTicker} />
          <MenuButton buttonTicker="MSFT" selectedTicker={ticker} setTicker={setTicker} />
          <MenuButton buttonTicker="NVDA" selectedTicker={ticker} setTicker={setTicker} />
        </Box>

        <Box sx={{ width: '100%', display: 'flex', flexGrow: 1, justifySelf: 'space-between', gap: 2 }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ height: '50px' }}>
            <Box sx={{width: '100%', display: 'flex', gap: 2, p: 1 }}>
              {CHART_TYPES.map((type, index) => <Button key={index} variant='outlined' size='small' color={type === chartType ? 'primary' : 'secondary'} onClick={() => setChartType(type)}>{type}</Button>)}
            </Box></Box>
            <Box sx={{ width: '100%' }}>
              {chartType === ChartType.Daily ? <DailyChart ticker={ticker} /> : <Box sx={{ p: 4 }}><Typography>Coming soon...</Typography></Box>}
            </Box>
          </Box>

          <Box sx={{ width: '100%', display: 'flex', flexGrow: 1 }}>
              <StockNews ticker={ticker} />
          </Box>
        </Box>

      </Box>
    </Box>
  );
};
