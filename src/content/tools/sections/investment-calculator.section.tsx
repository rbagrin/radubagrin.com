import React, { useMemo, useState } from "react";
import { keepOnlyXDigits } from "../../../util/number.util";
import { PieChart } from "../../../components/PieChart";
export const InvestmentCalculatorSection = () => {
  const [startingSum, setStartingSum] = useState(1000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [investmentYears, setInvestmentYears] = useState(10);

  const [growthRate, setGrowthRate] = useState(5);

  const finalInvestmentValue = useMemo(() => {
    const annualRate = growthRate / 100;
    const noOfMonths = investmentYears * 12;
    const monthlyReturnRate = (1 + annualRate) ** (1 / 12) - 1;

    let total = startingSum;
    for (let i = 0; i < noOfMonths; i += 1) {
      total = (total + monthlyInvestment) * (1 + monthlyReturnRate);
    }

    return keepOnlyXDigits(total, 2);
  }, [startingSum, monthlyInvestment, investmentYears, growthRate]);

  const totalContributions = useMemo(() => {
    return monthlyInvestment * investmentYears * 12;
  }, [monthlyInvestment, investmentYears]);

  const totalInterest = useMemo(
    () => finalInvestmentValue - startingSum - totalContributions,
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
          data: [startingSum, totalContributions, totalInterest],
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
            <div style={{ width: "200px" }}>
              <label htmlFor="startingSum">Starting amount:</label>
              <input
                type="number"
                id="startingSum"
                name="startingSum"
                value={startingSum}
                onChange={(e) => {
                  const value = Number.parseFloat(e.target.value);
                  setStartingSum(isNaN(value) ? 0 : value);
                }}
              />
            </div>

            <div style={{ width: "200px" }}>
              <label htmlFor="monthlyInvestment">Monthly investment:</label>
              <input
                type="number"
                id="monthlyInvestment"
                name="monthlyInvestment"
                value={monthlyInvestment}
                onChange={(e) => {
                  const value = Number.parseFloat(e.target.value);
                  setMonthlyInvestment(isNaN(value) ? 0 : value);
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ width: "200px" }}>
              <label htmlFor="investmentYears">Investment years:</label>
              <input
                type="number"
                id="investmentYears"
                name="investmentYears"
                value={investmentYears}
                onChange={(e) => {
                  const value = Number.parseFloat(e.target.value);
                  setInvestmentYears(isNaN(value) ? 0 : value);
                }}
              />
            </div>

            <div style={{ width: "200px" }}>
              <label htmlFor="growthRate">Growth rate (%):</label>
              <input
                type="number"
                id="growthRate"
                name="growthRate"
                value={growthRate}
                onChange={(e) => {
                  const value = Number.parseFloat(e.target.value);
                  setGrowthRate(isNaN(value) ? 0 : value);
                }}
              />
            </div>
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
                    Your investment after {investmentYears} year
                    {investmentYears === 1 ? "" : "s"}:
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
    </div>
  );
};
