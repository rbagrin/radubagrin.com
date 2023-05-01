import React from "react";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Chart,
} from "chart.js";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.register(Tooltip);

interface ChartData {
  labels?: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}
export const BarChart = ({
  title,
  chartData,
}: {
  title: string;
  chartData: ChartData;
}) => {
  return (
    <div>
      <h1>{title}</h1>
      <Bar data={chartData} />
    </div>
  );
};
