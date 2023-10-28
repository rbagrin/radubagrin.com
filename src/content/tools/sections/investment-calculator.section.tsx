import React, { useMemo, useState } from "react";
import { round } from "../../../util/number.util";
import { PieChart } from "../../../components/PieChart";
import { Input } from "../../../components/forms/Input";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export const InvestmentCalculatorSection = () => {
  const [startingSum, setStartingSum] = useState<number | "">(1000);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">(500);
  const [investmentYears, setInvestmentYears] = useState<number | "">(10);
  const [growthRate, setGrowthRate] = useState<number | "">(5);

  const [futureValue, setFutureValue] = useState<number | "">(10000);
  const [rateOfReturn, setRateOfReturn] = useState<number | "">(5);
  const [numberOfPeriods, setNumberOfPeriods] = useState<number | "">(10);

  const [endingValue, setEndingValue] = useState<number | "">(100);
  const [beginningValue, setBeginningValue] = useState<number | "">(100);
  const [years, setYears] = useState<number | "">(3);

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

  const presentValue = useMemo(
    () =>
      round(
        Number(futureValue) /
          (1 + Number(rateOfReturn) / 100) ** Number(numberOfPeriods),
        2
      ),
    [futureValue, rateOfReturn, numberOfPeriods]
  );

  const cagr = useMemo(() => {
    if (!endingValue || !beginningValue || !years) return 0;

    const result = ((endingValue / beginningValue) ** (1 / years) - 1) * 100;

    return round(result, 2);
  }, [endingValue, beginningValue, years]);

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
    <div>
      <Typography variant="h2" component="h1" sx={{ fontWeight: "bold" }}>
        Stocks
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <div>
          <Typography variant="h3">Investment calculator</Typography>
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
      </div>

      <Box sx={{ mt: 8 }}>
        <Typography variant="h3">Present value (PV)</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <a
            href="https://www.investopedia.com/terms/p/presentvalue.asp"
            target="_blank"
            rel="noreferrer"
          >
            Present value
          </a>{" "}
          is the current value of a future sum of money or stream of cash flows
          given a specified rate of return.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "end", mt: 2 }}>
          <Input
            label="Future value:"
            name="futureValue"
            value={futureValue}
            setValue={setFutureValue}
          />
          <Input
            label="Rate of return:"
            name="rateOfReturn"
            value={rateOfReturn}
            setValue={setRateOfReturn}
          />
          <Input
            label="Number of periods:"
            name="numberOfPeriods"
            value={numberOfPeriods}
            setValue={setNumberOfPeriods}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">Present value:</Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              ${presentValue}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 8 }}>
        <Typography variant="h3">Compound annual growth rate (CAGR)</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          The{" "}
          <a
            href="https://www.investopedia.com/terms/c/cagr.asp"
            target="_blank"
            rel="noreferrer"
          >
            compound annual growth rate
          </a>{" "}
          is the rate of return (RoR) that would be required for an investment
          to grow from its beginning balance to its ending balance, assuming the
          profits were reinvested at the end of each period of the investment’s
          life span.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "end", mt: 2 }}>
          <Input
            label="Ending value"
            name="endingValue"
            value={endingValue}
            setValue={setEndingValue}
          />
          <Input
            label="Beginning value"
            name="beginningValue"
            value={beginningValue}
            setValue={setBeginningValue}
          />
          <Input
            label="No of periods"
            name="years"
            value={years}
            setValue={setYears}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">CAGR:</Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {cagr}%
            </Typography>
          </Box>
        </Box>

        {/*  TODO: Add beginning value date picker & ending value date picker, count years between, get price at that moment, then calculate return */}
      </Box>
    </div>
  );
};
