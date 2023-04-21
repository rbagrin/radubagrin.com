import React, { useEffect } from "react";
import { ColorType, createChart } from "lightweight-charts";
const chartOptions = { layout: { textColor: "black", background: { type: ColorType.Solid, color: "white" } } };

export const Chart = ({ data }: { data: TimeSeriesDailyAdjustedResponse | null }) => {
  useEffect(()=> {
    const chartContainer = document.getElementById("chart");
    console.log(chartContainer);
    if (data) setChart(data);
  }, [data])

  return (
    <div id="container" style={{ display: 'flex', flexDirection: 'column', height: '800px' }}>
      {data ? (<div style={{ display: 'flex', gap: '20px' }}>
        <p>{data["Meta Data"]["2. Symbol"]}</p>
        <p>{data["Meta Data"]['1. Information']}</p>
      </div>) : (<></>)}

      <div id="chart" style={{ display: 'flex', flexGrow: 1, height: "50%", width: "width: 100%" }} />
    </div>
  );
};

const setChart = ( stockResponse : TimeSeriesDailyAdjustedResponse ): void => {
  const chartContainer = document.getElementById("chart");
  if (!chartContainer) return;

  const chart = createChart(chartContainer, chartOptions);
  const areaSeries = chart.addAreaSeries({
    lineColor: "#2962FF",
    topColor: "#2962FF",
    bottomColor: "rgba(41, 98, 255, 0.28)",
  });

  const data = stockResponse['Time Series (Daily)'];
  const keys = Object.keys(data);
  const seriesData: { time: string; value: number }[] = keys
    .map((date): { time: string; value: number } => {
      return { time: date, value: Number(data[date]["1. open"]) };
    })
    .reverse();

  areaSeries.setData(seriesData);

  chart.timeScale().fitContent();
};
