import React, { useMemo, useState } from "react";
import { keepOnlyXDigits } from "../../../util/number.util";
import { PieChart } from "../../../components/PieChart";
import { Input } from "../../../components/forms/Input";

export const InvestmentCalculatorSection = () => {
  const [startingSum, setStartingSum] = useState<number | "">(1000);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">(500);
  const [investmentYears, setInvestmentYears] = useState<number | "">(10);
  const [growthRate, setGrowthRate] = useState<number | "">(5);

  const [futureValue, setFutureValue] = useState<number | "">(10000);
  const [rateOfReturn, setRateOfReturn] = useState<number | "">(5);
  const [numberOfPeriods, setNumberOfPeriods] = useState<number | "">(10);

  const finalInvestmentValue = useMemo(() => {
    const annualRate = Number(growthRate) / 100;
    const noOfMonths = Number(investmentYears) * 12;
    const monthlyReturnRate = (1 + annualRate) ** (1 / 12) - 1;

    let total = Number(startingSum);
    for (let i = 0; i < noOfMonths; i += 1) {
      total =
        (total + Number(monthlyInvestment)) * (1 + Number(monthlyReturnRate));
    }

    return keepOnlyXDigits(total, 2);
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
      keepOnlyXDigits(
        Number(futureValue) /
          (1 + Number(rateOfReturn) / 100) ** Number(numberOfPeriods),
        2
      ),
    [futureValue, rateOfReturn, numberOfPeriods]
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
    <div>
      <h1>Stocks</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <div>
          <h2>Investment calculator</h2>
          <div style={{ display: "flex", gap: "20px" }}>
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
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
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
          </div>
        </div>

        <div style={{ width: "50%" }}>
          <div style={{ paddingRight: "80px" }}>
            <PieChart
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    marginBottom: "0",
                  }}
                >
                  <p>
                    Your investment after {Number(investmentYears)} year
                    {Number(investmentYears) === 1 ? "" : "s"}:
                  </p>
                  <p
                    style={{
                      marginLeft: "10px",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                  >
                    ${finalInvestmentValue}
                  </p>
                </div>
              }
              subtitle="End Balance Breakdown"
              chartData={chartData}
            />
          </div>
        </div>
      </div>

      <div>
        <h2>Present value = {presentValue}</h2>

        <div style={{ display: "flex", gap: "20px" }}>
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
        </div>
      </div>
    </div>
  );
};
