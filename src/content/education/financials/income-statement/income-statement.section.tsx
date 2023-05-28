import React from "react";
import { IncomeStatementChart } from "./income-statement-chart.component";

export const IncomeStatementSection = () => {
  return (
    <div>
      <p style={{ textAlign: "center", fontSize: "2rem", fontWeight: "600" }}>
        Income Statement
      </p>
      <IncomeStatementChart />
    </div>
  );
};
