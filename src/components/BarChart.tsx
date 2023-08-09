import React from "react";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Chart,
} from "chart.js";
import { Box, SxProps, Typography } from "@mui/material";

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
  sx = {},
}: {
  title: string;
  chartData: ChartData;
  sx?: SxProps;
}) => {
  return (
    <Box sx={sx}>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
      <Bar data={chartData} />
    </Box>
  );
};
