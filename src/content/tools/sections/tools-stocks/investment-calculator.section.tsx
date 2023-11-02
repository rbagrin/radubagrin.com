import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Input } from "../../../../components/forms/Input";
import { PieChart } from "../../../../components/PieChart";
import React, { useMemo, useState } from "react";
import { round } from "../../../../util/number.util";
import { Card, CardContent, CardHeader } from "@mui/material";

export const InvestmentCalculatorSection = () => {
  const [startingSum, setStartingSum] = useState<number | "">(1000);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">(500);
  const [investmentYears, setInvestmentYears] = useState<number | "">(10);
  const [growthRate, setGrowthRate] = useState<number | "">(5);

  const finalInvestmentValue = useMemo(() => {
    const annualRate = Number(growthRate) / 100;
    const noOfMonths = Number(investmentYears) * 12;
    const monthlyReturnRate = (1 + annualRate) ** (1 / 12) - 1;

    let total = Number(startingSum);
    for (let i = 0; i < noOfMonths; i += 1) {
      total =
        (total + Number(monthlyInvestment)) * (1 + Number(monthlyReturnRate));
    }

    return round(total, 2);
  }, [startingSum, monthlyInvestment, investmentYears, growthRate]);

  const totalContributions = useMemo(() => {
    return Number(monthlyInvestment) * Number(investmentYears) * 12;
  }, [monthlyInvestment, investmentYears]);

  const totalInterest = useMemo(
    () => finalInvestmentValue - Number(startingSum) - totalContributions,
    [finalInvestmentValue, startingSum, totalContributions]
  );

  const chartData = useMemo(
    () => ({
      labels: [
        "Starting amount",
        "Total monthly contributions",
        "Total interest",
      ],
      datasets: [
        {
          label: "",
          data: [Number(startingSum), totalContributions, totalInterest],
          backgroundColor: [
            "rgb(12, 42, 204)",
            "rgb(13, 100, 217)",
            "rgb(11, 150, 129)",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    }),
    [startingSum, totalContributions, totalInterest]
  );

  return (
    <Card>
      <CardHeader title="Investment calculator" />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div>
            <Box sx={{ display: "flex", gap: "20px", mt: 2 }}>
              <Input
                name="startingSum"
                label="Starting amount:"
                type="number"
                value={startingSum}
                setValue={setStartingSum}
              />
              <Input
                name="monthlyInvestment"
                label="Monthly investment:"
                type="number"
                value={monthlyInvestment}
                setValue={setMonthlyInvestment}
              />
            </Box>
            <Box sx={{ display: "flex", gap: "20px", mt: 2 }}>
              <Input
                name="investmentYears"
                label="Investment years:"
                type="number"
                value={investmentYears}
                setValue={setInvestmentYears}
              />
              <Input
                name="growthRate"
                label="Growth rate (%)::"
                type="number"
                value={growthRate}
                setValue={setGrowthRate}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                mt: 2,
                alignItems: "center",
              }}
            >
              <Typography variant="h5">
                Your investment after {Number(investmentYears)} year
                {Number(investmentYears) === 1 ? "" : "s"}:
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                ${finalInvestmentValue}
              </Typography>
            </Box>
          </div>

          <Box sx={{ width: "45%" }}>
            <Box sx={{ pr: 8 }}>
              <PieChart
                title={
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant="h5">End Balance Breakdown</Typography>
                  </Box>
                }
                chartData={chartData}
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
