import React, { useEffect, useRef } from "react";
import { ColorType, createChart } from "lightweight-charts";
import { DarqubeTickerMarketData } from "../types/stock.type";

const backgroundColor = "#555";
const lineColor = "#3e0059";
const textColor = "#fff";
const areaTopColor = "rgba(199, 71, 255, 1)";
const areaBottomColor = "rgba(199, 71, 255, 0.28)";

const getChartData = (
  data: DarqubeTickerMarketData[]
): { time: string; value: number }[] => {
  return data.map(({ time, open }): { time: string; value: number } => {
    return {
      time: new Date(time * 1000).toISOString().split("T")[0],
      value: open,
    };
  });
};

// TODO: This should receive the data formatted so it can be used in multiple places
export const Chart = ({ data }: { data: DarqubeTickerMarketData[] }) => {
  const chartContainerRef = useRef<any>();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef?.current
          ? chartContainerRef?.current.clientWidth
          : "100%",
      });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 800,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    const seriesData = getChartData(data);
    newSeries.setData(seriesData);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return <div style={{ width: "100%" }} ref={chartContainerRef} />;
};
