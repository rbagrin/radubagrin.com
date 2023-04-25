import React, { useEffect, useRef } from "react";
import { ColorType, createChart } from "lightweight-charts";
import Box from "@mui/material/Box";

const backgroundColor = 'white';
const lineColor = '#2962FF';
const textColor = 'black';
const areaTopColor = '#2962FF';
const areaBottomColor = 'rgba(41, 98, 255, 0.28)';

const getChartData = ( stockResponse : TimeSeriesDailyAdjustedResponse ): any => {
  const data = stockResponse['Time Series (Daily)'];
  if (!data) return [];
  const keys = Object.keys(data);
  const seriesData: { time: string; value: number }[] = keys
    .map((date): { time: string; value: number } => {
      return { time: date, value: Number(data[date]["1. open"]) };
    })
    .reverse();

  return seriesData;
};

export const Chart = ({ data }: { data: TimeSeriesDailyAdjustedResponse | null }) => {  
  const chartContainerRef = useRef<any>();

  useEffect(
		() => {
			const handleResize = () => {
				chart.applyOptions({ width: chartContainerRef?.current ? chartContainerRef?.current.clientWidth : '100%' });
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

			const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
      		const seriesData = getChartData(data);
			newSeries.setData(seriesData);

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);
				chart.remove();
			};
		},
		[data]
	);

	return (<Box sx={{ width: '100%' }} ref={chartContainerRef} />);
};

