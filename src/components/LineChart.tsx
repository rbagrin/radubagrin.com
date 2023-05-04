import React from "react";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const getOptions = (title: string) => ({
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: title,
    },
  },
});

interface LineChartProps {
  readonly title: string;
  readonly chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      pointBackgroundColor?: string;
      pointBorderColor?: string;
      pointRadius?: number;
    }[];
  };
}

export const LineChart = ({ title, chartData }: LineChartProps) => {
  const options = getOptions(title);
  return <Line options={options} data={chartData} />;
};
