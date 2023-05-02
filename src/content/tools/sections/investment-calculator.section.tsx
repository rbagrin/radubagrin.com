import React, { useMemo, useState } from "react";

const round = (value: number, digits = 4): number => {
  const aux = 10 ** digits;
  return Math.floor(value * aux) / aux;
};

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

    return round(total, 2);
  }, [startingSum, monthlyInvestment, investmentYears, growthRate]);

  const totalContributions = useMemo(() => {
    return monthlyInvestment * investmentYears * 12;
  }, [monthlyInvestment, investmentYears]);

  return (
    <div>
      <h1>Investment calculator</h1>
      <div>
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

      <p>
        Your investment after {investmentYears} year
        {investmentYears === 1 ? "" : "s"}: {finalInvestmentValue}
      </p>

      <p>End balance: {finalInvestmentValue}</p>
      <p>Starting Amount: {startingSum}</p>
      <p>Total Contributions: {totalContributions}</p>
      <p>
        Total interest:{" "}
        {finalInvestmentValue - startingSum - totalContributions}
      </p>
    </div>
  );
};
