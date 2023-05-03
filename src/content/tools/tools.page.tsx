import React from "react";
import { InvestmentCalculatorSection } from "./sections/investment-calculator.section";
import { RealEstateSection } from "./sections/real-estate.section";

export const ToolsPage = () => {
  return (
    <div
      style={{
        display: "flex",
        paddingLeft: "20px",
        paddingRight: "20px",
        width: "100%",
        gap: "20px",
      }}
    >
      <div style={{ width: "50%", borderRight: "2px solid #222" }}>
        <InvestmentCalculatorSection />
      </div>
      <div style={{ width: "50%" }}>
        <RealEstateSection />
      </div>
    </div>
  );
};
