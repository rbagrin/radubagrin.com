import React, { useState } from "react";
import { Pie } from "react-chartjs-2";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

interface PieChartProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
}

export const PieChart = ({ title, subtitle, chartData }: PieChartProps) => {
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: !!subtitle,
              text: subtitle,
            },
          },
        }}
      />
    </div>
  );
};
