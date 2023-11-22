import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { IMOBILIARE_INDEX_BUCURESTI } from "../imobiliare-bucuresti";
import { IMOBILIARE_INDEX_ROMANIA } from "../imobiliare-romania";
import { LineChart } from "../../../../components/LineChart";
import { SALARII_MEDII } from "../salarii-medii";
import { round } from "../../../../util/number.util";

enum MONTHS {
  JAN,
  FEB,
  MAR,
  APR,
  MAY,
  JUN,
  JUL,
  AUG,
  SEP,
  OCT,
  NOV,
  DEC,
}

const ChartTypeToLabel = {
  IMOBILIARE_BUCURESTI: "AVG Sqm Price (B)",
  IMOBILIARE_RO: "AVG Sqm Price (RO)",
  SALARIU_MEDIU_RO: "AVG wage (RO)",
  PRICE_TO_WAGE: "AVG Sqm Price (B) to AVG Wage (RO)",
  PRICE_TO_WAGE_RO: "AVG Sqm Price (RO) to AVG Wage (RO)",
};
const getAllLabelsFromSalaryData = (
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number
): string[] => {
  const labels: string[] = [];
  for (let y = startYear; y <= endYear; y += 1) {
    if (y === startYear)
      for (let m = startMonth; m < 12; m += 1) {
        labels.push(`${m + 1}/${y}`);
      }
    else if (y === endYear) {
      for (let m = 0; m <= endMonth; m += 1) {
        labels.push(`${m + 1}/${y}`);
      }
    } else {
      for (let m = 0; m < 12; m += 1) {
        labels.push(`${m + 1}/${y}`);
      }
    }
  }

  return labels;
};

const getDataFromImobiliare = (
  source: { labels: string[]; datasets: { data: number[] }[] },
  startLabel: string,
  endLabel: string,
  multiplier: number
): number[] => {
  const startIndex = source.labels.indexOf(startLabel);
  const endIndex = source.labels.indexOf(endLabel);

  const result: number[] = source.datasets[0].data.slice(
    startIndex,
    endIndex + 1
  );

  return result.map((valueInEur) => valueInEur * multiplier);
};

const getWageData = (labels: string[], ronToEur: number): number[] => {
  return labels.map((label) => {
    const [m, y] = label.split("/");
    return round(SALARII_MEDII[y][Number(m) - 1] * ronToEur, 2);
  });
};

// TODO: Make this customizable - allow user to select what kind of graph and what chart to see instead of having all options as radio buttons

// TODO: Try to get the data in the same currency - converting EUR to RON at current rate in 2012 is not accurate
// https://uk.investing.com/currencies/eur-ron-historical-data
export const MyOwnDataChart = () => {
  const [chartType, setChartType] = useState<string>("IMOBILIARE_BUCURESTI");
  const [currency, setCurrency] = useState<"EUR" | "RON">("EUR");
  const EUR_TO_RON = 4.97;
  const RON_TO_EUR = 0.2;

  const multiplierConversionFromRON = currency === "EUR" ? RON_TO_EUR : 1;
  const multiplierConversionFromEUR = currency === "EUR" ? 1 : EUR_TO_RON;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChartType((event.target as HTMLInputElement).value);
  };

  const labels = useMemo(
    () => getAllLabelsFromSalaryData(2012, MONTHS.JUL, 2023, MONTHS.OCT),
    []
  );
  const squareMPriceBucharest = useMemo(
    () =>
      getDataFromImobiliare(
        IMOBILIARE_INDEX_BUCURESTI,
        labels[0],
        labels[labels.length - 1],
        multiplierConversionFromEUR
      ),
    [multiplierConversionFromEUR, labels]
  );

  const squareMPriceRO = useMemo(
    () =>
      getDataFromImobiliare(
        IMOBILIARE_INDEX_ROMANIA,
        labels[0],
        labels[labels.length - 1],
        multiplierConversionFromEUR
      ),
    [multiplierConversionFromEUR, labels]
  );

  const avgWageRoData = useMemo(
    () => getWageData(labels, multiplierConversionFromRON),
    [multiplierConversionFromRON, labels]
  );
  const mapping = useMemo(
    () => ({
      IMOBILIARE_BUCURESTI: squareMPriceBucharest,
      IMOBILIARE_RO: squareMPriceRO,
      SALARIU_MEDIU_RO: avgWageRoData,
      PRICE_TO_WAGE: squareMPriceBucharest.map(
        (price, index) => price / avgWageRoData[index]
      ),
      PRICE_TO_WAGE_RO: squareMPriceRO.map(
        (price, index) => price / avgWageRoData[index]
      ),
    }),
    [squareMPriceBucharest, squareMPriceRO, avgWageRoData]
  );

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: ChartTypeToLabel[chartType],
          backgroundColor: "rgba(151, 28, 51, 0.23)",
          borderColor: "#971C33",
          pointBackgroundColor: "#fafcfe",
          pointBorderColor: "#971C33",
          pointRadius: 2,
          data: mapping[chartType],
        },
      ],
    }),
    [mapping, chartType, labels]
  );

  return (
    <Box>
      <FormControl>
        <RadioGroup name="chart-type" value={chartType} onChange={handleChange}>
          <FormControlLabel
            value="IMOBILIARE_BUCURESTI"
            control={<Radio />}
            label={ChartTypeToLabel["IMOBILIARE_BUCURESTI"]}
          />
          <FormControlLabel
            value="IMOBILIARE_RO"
            control={<Radio />}
            label={ChartTypeToLabel["IMOBILIARE_RO"]}
          />
          <FormControlLabel
            value="SALARIU_MEDIU_RO"
            control={<Radio />}
            label={ChartTypeToLabel["SALARIU_MEDIU_RO"]}
          />
          <FormControlLabel
            value="PRICE_TO_WAGE"
            control={<Radio />}
            label={ChartTypeToLabel["PRICE_TO_WAGE"]}
          />
          <FormControlLabel
            value="PRICE_TO_WAGE_RO"
            control={<Radio />}
            label={ChartTypeToLabel["PRICE_TO_WAGE_RO"]}
          />
        </RadioGroup>
      </FormControl>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography>RON</Typography>
        <Switch
          checked={currency === "EUR"}
          onClick={() =>
            setCurrency((prev) => (prev === "EUR" ? "RON" : "EUR"))
          }
        />
        <Typography>EUR</Typography>
      </Box>
      <LineChart title="My chart" chartData={chartData} />
    </Box>
  );
};
